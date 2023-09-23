import express, { Response } from "express";
import next from "next";
import "dotenv/config";
import session from "express-session";
import { memoryStore, keycloakConnect } from "./utils";
import bodyParser from "body-parser";
import namespaceMiddleware from "./middlewares/namespaceMiddleware";
import actionsRoutes from "./routes/actions";
import activationsRoutes from "./routes/activations";
import triggersRoutes from "./routes/triggers";
import rulesRoutes from "./routes/rules";
import packagesRoutes from "./routes/packages";
import namespacesRoutes from "./routes/namespaces";
import metricsRoutes from "./routes/metrics";
import limitsRoutes from "./routes/limits";

type Namespace = {
  name: string;
  uuid: string;
  key: string;
};

declare module "express-session" {
  interface SessionData {
    namespace: Namespace;
    namespaces: Namespace[];
    username: string;
  }
}

const dev = process.env.NODE_ENV !== "production";

const app = next({ dev });

const handle = app.getRequestHandler();

const port = process.env.PORT || 3000;

const sessionSecret = process.env.EXPRESS_SESSION_SECRET;

if (!sessionSecret)
  throw new Error("EXPRESS_SESSION_SECRET environment variable not set!");

(async () => {
  try {
    await app.prepare();

    const server = express();

    server.use(
      session({
        secret: sessionSecret,
        resave: false,
        saveUninitialized: true,
        store: memoryStore,
      })
    );

    server.use(keycloakConnect.middleware());

    server.use(bodyParser.json());

    server.use(namespaceMiddleware);

    server.use("/api/actions", actionsRoutes);

    server.use("/api/triggers", triggersRoutes);

    server.use("/api/rules", rulesRoutes);

    server.use("/api/packages", packagesRoutes);

    server.use("/api/namespaces", namespacesRoutes);

    server.use("/api/activations", activationsRoutes);

    server.use("/api/limits", limitsRoutes);

    server.use("/api/metrics", metricsRoutes);

    server.delete(
      "/api/logout",
      keycloakConnect.protect("realm:user"),
      (req, res) => {
        if (req.session) {
          req.session.destroy((err) => {
            if (err) {
              console.log("Error while trying to destroy session:", err);

              res.status(400).send("Unable to log out");
            } else {
              console.log("User's session destroyed successfully");

              res.send("Logout was successful");
            }
          });

          res.clearCookie("connect.sid");
        } else {
          res.end();
        }
      }
    );

    server.all("*", (req, res: Response) => {
      return handle(req, res);
    });

    server.listen(port, (err?: any) => {
      if (err) throw err;
      console.log(`Express server ready on localhost:${port}`);
    });
  } catch (err) {
    console.error(err);

    process.exit(1);
  }
})();
