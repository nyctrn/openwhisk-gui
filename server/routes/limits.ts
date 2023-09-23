import { OpenWhiskLimits } from "./../services/DatabaseService";
import express from "express";
import { keycloakConnect } from "../utils";
import axios from "axios";
import DatabaseService from "../services/DatabaseService";
// import { RequestError } from "nano";

const router = express.Router();

router.get("/", keycloakConnect.protect("realm:user"), async (req, res) => {
  try {
    const { data: limits } = await axios.get(
      `${process.env.OPENWHISK_API_HOST}/api/v1/namespaces/_/limits`,
      {
        auth: {
          username: `${req.session.namespace?.uuid}`,
          password: `${req.session.namespace?.key}`,
        },
      }
    );

    console.log("[GET /limits] Response:", limits);

    return res.status(200).json({ ...limits });
  } catch (err: any) {
    console.log("Error at [GET /limits]:", err);

    return res
      .status(err.statusCode || 500)
      .json({ error: err.error, message: err.reason });
  }
});

router.put(
  "/:namespace",
  keycloakConnect.protect("realm:admin"),
  async (req, res) => {
    const requestedLimits = {};

    Object.entries(req.body).forEach(
      // @ts-ignore
      (limit) => (requestedLimits[limit[0]] = limit[1])
    );

    const namespace = req.params.namespace;

    try {
      const { data, error } =
        await DatabaseService.getDocument<OpenWhiskLimits>(
          `${namespace}/limits`
        );

      if (error?.error === "not_found") {
        console.log(
          `[PUT /limits/${namespace}] Not limits found for namespace: ${namespace}. Creating limits for it...:`
        );

        const databaseResponse = await DatabaseService.insertDocument({
          _id: `${namespace}/limits`,
          ...requestedLimits,
        });

        if (databaseResponse.ok) {
          return res.status(200).json({ message: "success" });
        }
      }

      const updatedNamespaceLimits = await DatabaseService.insertDocument({
        ...data,
        ...requestedLimits,
      });

      console.log(
        `[PUT /limits/${namespace}] Response:`,
        updatedNamespaceLimits
      );

      return res.status(200).json({ updatedNamespaceLimits });
    } catch (err: any) {
      console.log(`Error at [PUT /limits/${namespace}]`, err);

      return res
        .status(err.statusCode || 500)
        .json({ error: err.error, message: err.reason });
    }
  }
);

router.delete(
  "/:namespace",
  keycloakConnect.protect("realm:admin"),
  async (req, res) => {
    const namespace = req.params.namespace;

    try {
      const { response } = await DatabaseService.deleteDocument(
        `${namespace}/limits`
      );

      if (response.ok) {
        console.log(`[DELETE /limits/${namespace}] Response:`, response);

        return res.status(200).json({ message: "success" });
      }
    } catch (err: any) {
      console.log(`Error at [DELETE /limits/${namespace}]:`, err);

      return res
        .status(err.statusCode || 500)
        .json({ error: err.error, message: err.reason });
    }
  }
);

export default router;
