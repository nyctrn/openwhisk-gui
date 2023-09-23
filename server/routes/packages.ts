import express, { Request, Response } from "express";
import { keycloakConnect, openwhiskClient } from "../utils";

const router = express.Router();

router.get("/", keycloakConnect.protect("realm:user"), async (req, res) => {
  try {
    const packages = await openwhiskClient(req).packages.list();

    console.log("[GET /packages] Response:", packages);

    const data = packages.map((pkg, i) => ({
      ...pkg,
      id: pkg.name,
    }));
    const total = packages.length;

    return res.status(200).json({ data, total });
  } catch (err: any) {
    console.log("Error at [GET /packages]:", err);

    const error = err;

    return res
      .status(error.statusCode || 500)
      .json({ error: error.error, message: error.reason });
  }
});

router.get(
  "/:packageName",
  keycloakConnect.protect("realm:user"),
  async (req, res) => {
    const { packageName } = req.params;

    try {
      const pkg = await openwhiskClient(req).packages.get(packageName);

      console.log(`[GET /packages/${packageName}] Response:`, pkg);

      const data = {
        ...pkg,
        id: packageName,
      };

      return res.status(200).json({ data });
    } catch (err: any) {
      console.log("Error at [GET /packages]:", err);

      const error = err;

      return res
        .status(error.statusCode || 500)
        .json({ error: error.error, message: error.reason });
    }
  }
);

router.put(
  "/:packageName",
  keycloakConnect.protect("realm:user"),
  async (req, res) => {
    const { packageName } = req.params;

    const {
      namespace,
      actions,
      feeds,
      parameters,
      annotations,
      binding,
      version,
      publish,
    } = req.body;

    // FIXME:
    const pkg = {
      // version,
      publish,
      parameters,
      annotations,
      // binding,
      // feeds,
      actions,
    };

    const payload = {
      name: packageName,
      package: pkg,
    };

    const { overwrite } = req.query;

    let data;

    try {
      if (overwrite === "false") {
        data = await openwhiskClient(req).packages.create(payload);
      } else {
        data = await openwhiskClient(req).packages.update(payload);
      }

      console.log(`[PUT /packages/${packageName}] Response:`, data);

      return res.status(200).json({ data: { ...data, id: packageName } });
    } catch (err: any) {
      console.log(`Error at [PUT /packages/${packageName}]:`, err);

      return res
        .status(err.statusCode)
        .json({ error: err.error, message: err.message });
    }
  }
);

router.delete(
  "/:packageName",
  keycloakConnect.protect("realm:user"),
  async (req, res) => {
    const { packageName } = req.params;

    try {
      const packageResponse = await openwhiskClient(req).packages.delete(
        packageName
      );

      console.log(
        `[DELETE /packages/${packageName}] Response:`,
        packageResponse
      );

      const data = {
        ...packageResponse,
        id: packageName,
      };

      return res.status(200).json({ data });
    } catch (err: any) {
      console.log(`Error at [DELETE /packages/${packageName}]:`, err);

      return res
        .status(err.statusCode)
        .json({ error: err.error, message: err.message });
    }
  }
);

router.post(
  "/delete",
  keycloakConnect.protect("realm:user"),
  async (req, res) => {
    const payload = req.body;

    try {
      const data = await openwhiskClient(req).packages.delete(payload);

      console.log("[POST /packages/delete] Response:", data);

      return res.status(200).json({ response: data });
    } catch (err: any) {
      console.log(`Error at [POST /packages/delete] Response:`, err);

      return res
        .status(err.statusCode)
        .json({ error: err.error, message: err.message });
    }
  }
);

export default router;
