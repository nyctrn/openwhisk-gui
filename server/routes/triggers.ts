import express, { Request, Response } from "express";
import { keycloakConnect, openwhiskClient } from "../utils";

const router = express.Router();

router.get("/", keycloakConnect.protect("realm:user"), async (req, res) => {
  try {
    const triggers = await openwhiskClient(req).triggers.list();

    console.log("[GET /triggers] Response:", triggers);

    const data = triggers.map((trigger, i) => ({
      ...trigger,
      id: trigger.name,
    }));

    const total = triggers.length;

    return res.status(200).json({ data, total });
  } catch (err: any) {
    console.log("Error at [GET /triggers]", err);

    return res
      .status(err.statusCode || 500)
      .json({ error: err.error, message: err.reason });
  }
});

router.get(
  "/:triggerName",
  keycloakConnect.protect("realm:user"),
  async (req, res) => {
    const { triggerName } = req.params;

    try {
      const trigger = await openwhiskClient(req).triggers.get(triggerName);

      console.log(`[GET /triggers/${triggerName}] Response:`, trigger);

      const data = {
        ...trigger,
        id: triggerName,
      };

      return res.status(200).json({ data });
    } catch (err: any) {
      console.log(`Error at [GET /triggers/${triggerName}]`, err);

      return res
        .status(err.statusCode || 500)
        .json({ error: err.error, message: err.reason });
    }
  }
);

router.put(
  "/:triggerName",
  keycloakConnect.protect("realm:user"),
  async (req, res) => {
    const { triggerName } = req.params;

    const { namespace, parameters, annotations, limits, version } = req.body;

    const payload = {
      name: triggerName,
      namespace: namespace ?? "_",
      trigger: {
        parameters,
        annotations,
        limits,
        version,
      },
    };

    const { overwrite } = req.query;

    let data;

    try {
      if (overwrite === "false") {
        data = await openwhiskClient(req).triggers.create({
          ...payload,
          overwrite: false,
        });
      } else {
        data = await openwhiskClient(req).triggers.update(payload);
      }

      console.log(`[PUT /triggers/${triggerName}] Response:`, data);

      return res.status(200).json({ data: { ...data, id: triggerName } });
    } catch (err: any) {
      console.log(`Error at [PUT /triggers/${triggerName}]`, err);

      return res
        .status(err.statusCode || 500)
        .json({ error: err.error, message: err.reason });
    }
  }
);

router.delete(
  "/:triggerName",
  keycloakConnect.protect("realm:user"),
  async (req, res) => {
    const { triggerName } = req.params;

    try {
      const trigger = await openwhiskClient(req).triggers.delete(triggerName);

      console.log(`[DELETE /triggers/${triggerName}] Response:`, trigger);

      const data = {
        ...trigger,
        id: triggerName,
      };

      return res.status(200).json({ data });
    } catch (err: any) {
      console.log(`Error at [DELETE /triggers/${triggerName}]`, err);

      return res
        .status(err.statusCode || 500)
        .json({ error: err.error, message: err.reason });
    }
  }
);

router.post(
  "/delete",
  keycloakConnect.protect("realm:user"),
  async (req, res) => {
    const payload = req.body;

    try {
      const data = await openwhiskClient(req).triggers.delete(payload);

      console.log("[POST /triggers/delete] Response:", data);

      return res.status(200).json({ data });
    } catch (err: any) {
      console.log("Error at [POST /triggers/delete]", err);

      return res
        .status(err.statusCode || 500)
        .json({ error: err.error, message: err.reason });
    }
  }
);

router.post("/", keycloakConnect.protect("realm:user"), async (req, res) => {
  const { triggerName, ...restParameters } = req.body;

  try {
    const data = await openwhiskClient(req).triggers.invoke({
      name: triggerName,
      ...restParameters,
    });

    console.log("[POST /triggers] Response:", data);

    return res.status(200).json({ data });
  } catch (err: any) {
    console.log("Error at [POST /triggers]", err);

    return res
      .status(err.statusCode || 500)
      .json({ error: err.error, message: err.reason });
  }
});

export default router;
