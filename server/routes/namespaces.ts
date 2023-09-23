// @ts-nocheck
import express, { Request, Response } from "express";
import { keycloakConnect, openwhiskClient } from "../utils";
import DatabaseService, { nano } from "../services/DatabaseService";
import randomstring from "randomstring";
import { v4 as uuidv4 } from "uuid";
import { OpenWhiskSubject } from "../services/DatabaseService";

const router = express.Router();

router.get("/", keycloakConnect.protect("realm:user"), async (req, res) => {
  try {
    const namespaces = await openwhiskClient(req).namespaces.list();

    console.log("[GET /namespaces] Response:", namespaces);

    const data = namespaces.map((namespace, i) => ({
      id: i,
      name: namespace,
    }));

    const total = namespaces.length;

    return res.status(200).json({ data, total });
  } catch (err: any) {
    console.log("Error at [GET /namespaces]:", err);

    return res
      .status(err.statusCode || 500)
      .json({ error: err.error, message: err.reason });
  }
});

router.get(
  "/namespace",
  keycloakConnect.protect("realm:user"),
  async (req, res) => {
    try {
      const namespaces = await openwhiskClient(req).namespaces.list();

      console.log("[GET /namespaces/namespace] Response:", {
        namespace: namespaces[0],
      });

      return res.status(200).json({ namespace: namespaces[0] });
    } catch (error: any) {
      console.log("Error at [GET /namespaces/namespace]:", err);

      return res
        .status(err.statusCode || 500)
        .json({ error: err.error, message: err.reason });
    }
  }
);

router.post(
  "/:namespace",
  keycloakConnect.protect("realm:user"),
  async (req, res) => {
    try {
      const namespace = req.params.namespace;

      req.session.namespace = req.session.namespaces?.find(
        (ns) => ns.name === namespace
      );

      console.log(
        `[POST /namespaces/${namespace}] Now using namespace: ${req.session.namespace}`
      );

      res.status(200).json({ result: "ok" });
    } catch (err: any) {
      console.log(`Error at [POST /namespaces/${namespace}]:`, err);

      return res
        .status(err.statusCode || 500)
        .json({ error: err.error, message: err.reason });
    }
  }
);

router.put(
  "/:namespace",
  keycloakConnect.protect("realm:admin"),
  async (req: any, res) => {
    const { namespace } = req.params;
    const { email } = req.body;

    const mangoQuery = {
      selector: {
        "namespaces.0.name": email,
      },
    };

    try {
      const { docs } = await nano().find(mangoQuery);

      if (!docs.length)
        throw new Error(
          `A user with email ${email} does not exist in the Database`
        );

      console.log(`[PUT /namespaces/${namespace}] Response: Found user`, docs);

      let namespaceAlreadyExists;

      const userId = docs[0].subject;

      const { data, error } =
        await DatabaseService.getDocument<OpenWhiskSubject>(userId);

      if (error) throw new Error(error);

      namespaceAlreadyExists = !!data.namespaces.find(
        (ns) => ns.name === namespace
      );

      if (namespaceAlreadyExists) throw new Error("Namespace already exists");

      const uuid = uuidv4();
      const key = randomstring.generate({
        length: 64,
        charset: "alphanumeric",
      });

      (data.namespaces as any).push({ name: namespace, uuid, key });

      const dbResponse = await DatabaseService.insertDocument(data);

      if (dbResponse.ok) {
        console.log(`[PUT /namespaces/${namespace}] Response:`, dbResponse);

        return res
          .setHeader("content-type", "application/json")
          .status(200)
          .json({ status: "ok" });
      }
    } catch (err: any) {
      console.log(`Error at [PUT /namespaces/${namespace}]:`, err);

      return res
        .status(err?.statusCode || (namespaceAlreadyExists && 409) || 500)
        .json({
          error: err.error || (namespaceAlreadyExists && err.message),
          description:
            err?.description ||
            (namespaceAlreadyExists &&
              `The namespace '${namespace}' already exists for user '${username}'`) ||
            "Server error",
        });
    }
  }
);

router.get(
  "/fetch",
  keycloakConnect.protect("realm:user"),
  async (req: any, res) => {
    const userId = req.kauth.grant.access_token.content.sub;

    try {
      const { data } = await DatabaseService.getDocument<OpenWhiskSubject>(
        userId
      );

      //
      req.session.namespaces = data?.namespaces;

      const namespaces = data?.namespaces.map((namespace) => ({
        name: namespace.name,
      }));

      console.log("[GET /namespaces/fetch] Response:", namespaces);

      return res.status(200).json(namespaces);
    } catch (err: any) {
      console.log("Error at [GET /namespaces/fetch]:", err);

      return res
        .status(err.statusCode || 500)
        .json({ error: err.error, message: err.reason });
    }
  }
);

export default router;
