import { NextFunction, Request, Response } from "express";
import DatabaseService, { OpenWhiskSubject } from "../services/DatabaseService";
import { RequestError } from "nano";
import randomstring from "randomstring";
import { v4 as uuidv4 } from "uuid";

const namespaceMiddleware = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  if (req.kauth?.grant?.access_token && !req.session.namespaces) {
    const userId = req.kauth.grant.access_token.content.sub;

    const email = req.kauth.grant.access_token.content.email;

    try {
      const { data, error } =
        await DatabaseService.getDocument<OpenWhiskSubject>(userId);

      if (error && error?.statusCode !== 404) throw new Error(error.message);

      if (error?.statusCode === 404) {
        console.log("[namespaceMiddleware] Creating new user...");

        const uuid = uuidv4();
        const key = randomstring.generate({
          length: 64,
          charset: "alphanumeric",
        });

        const dbResponse = await DatabaseService.insertDocument({
          _id: userId,
          subject: userId,
          namespaces: [
            {
              name: email,
              uuid,
              key,
            },
          ],
        });

        if (dbResponse.ok) {
          console.log(
            `[namespaceMiddleware] Created new user: ${userId} with namespace: { name: ${email}, uuid: ${uuid}, key: ${key} }`
          );

          req.session.namespaces = [{ name: email, uuid, key }];
          req.session.namespace = { name: email, uuid, key };
        }

        return next();
      }

      req.session.namespaces = data?.namespaces;

      req.session.namespace = data?.namespaces.find((ns) => ns.name === email);

      console.log(
        `[namespaceMiddleware] Fetched user's {id:${userId}, email:${email}} namespaces:`,
        data?.namespaces
      );
      console.log("for user:", userId);
    } catch (err) {
      console.log("Error at [namespaceMiddleware]", err);

      const error = err as RequestError;

      return res.status(error?.statusCode || 500).json({
        error: error.error,
        description: error?.description || "Server error",
      });
    }
  }

  next();
};

export default namespaceMiddleware;
