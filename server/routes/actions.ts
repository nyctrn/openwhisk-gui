import express, { Request, Response } from "express";
import { keycloakConnect, openwhiskClient } from "../utils";

interface OpenwhiskError {
  message: string;
  error: {
    code: string;
    error: string;
  };
  statusCode: number;
}

const router = express.Router();

router.get("/", keycloakConnect.protect("realm:user"), async (req, res) => {
  try {
    const { limit, skip } = req.query;

    const actionsResponse = await openwhiskClient(req).actions.list({
      ...(limit && { limit: Number(limit) }),
      ...(skip && { skip: Number(skip) }),
    });

    console.log("[GET /actions] Response:", actionsResponse);

    const actions = actionsResponse.map((action) => ({
      ...action,
      id: `${action.name}`,
    }));

    const total = actionsResponse.length;

    return res.status(200).json({ actions, total });
  } catch (err: any) {
    console.log("Error at [GET /actions]:", err);

    return res
      .status(err.statusCode || 500)
      .json({ error: err.error, message: err.reason });
  }
});

router.get(
  "/:actionName",
  keycloakConnect.protect("realm:user"),
  async (req, res) => {
    const { actionName } = req.params;

    try {
      const action = await openwhiskClient(req).actions.get(actionName);

      console.log(`[GET /actions/${actionName}] Response:`, action);

      const data = {
        ...action,
        id: actionName,
      };

      return res.status(200).json({ data });
    } catch (err: any) {
      console.log(`Error at [GET /actions/${actionName}]:`, err);

      return res
        .status(err.statusCode || 500)
        .json({ error: err.error, message: err.reason });
    }
  }
);

router.put(
  "/:actionName",
  keycloakConnect.protect("realm:user"),
  async (req, res) => {
    const { actionName } = req.params;

    const payload = { ...req.body, name: actionName };

    const { overwrite } = req.query;

    let data;

    try {
      if (overwrite) {
        data = await openwhiskClient(req).actions.update(payload);
      } else {
        data = await openwhiskClient(req).actions.create(payload);
      }

      console.log(`[PUT /actions/${actionName}] Response:`, data);

      return res.status(200).json({ data: { ...data, id: actionName } });
    } catch (err: any) {
      console.log(`Error at [PUT /actions/${actionName}]:`, err);

      return res
        .status(err.statusCode || 500)
        .json({ error: err.error, message: err.reason });
    }
  }
);

router.delete(
  "/:actionName",
  keycloakConnect.protect("realm:user"),
  async (req, res) => {
    const { actionName } = req.params;

    try {
      const action = await openwhiskClient(req).actions.delete(actionName);

      console.log(`[DELETE /actions/${actionName}] Response:`, action);

      const data = {
        ...action,
        id: actionName,
      };

      return res.status(200).json({ data });
    } catch (err: any) {
      console.log(`Error at [DELETE /actions/${actionName}]:`, err);

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
      const data = await openwhiskClient(req).actions.delete(payload);

      console.log("[POST /actions/delete] Response:", data);

      return res.status(200).json({ data });
    } catch (err: any) {
      console.log("Error at [POST /actions/delete]:", err);

      return res
        .status(err.statusCode || 500)
        .json({ error: err.error, message: err.reason });
    }
  }
);

router.post(
  "/:actionName",
  keycloakConnect.protect("realm:user"),
  async (req, res) => {
    const { actionName } = req.params;

    try {
      const data = await openwhiskClient(req).actions.invoke({
        name: actionName,
        ...req.body,
      });

      console.log(`[POST /actions/${actionName}] Response:`, data);

      return res.status(200).json({ data });
    } catch (err: any) {
      console.log(`Error at [POST /actions/${actionName}]:`, err);

      return res
        .status(err.statusCode || 500)
        .json({ error: err.error, message: err.reason });
    }
  }
);

export default router;
