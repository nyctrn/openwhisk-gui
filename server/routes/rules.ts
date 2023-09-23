import express, { Request, Response } from "express";
import { keycloakConnect, openwhiskClient } from "../utils";

const router = express.Router();

router.get("/", keycloakConnect.protect("realm:user"), async (req, res) => {
  try {
    const rules = await openwhiskClient(req).rules.list();

    console.log("[GET /rules] Response:", rules);

    const data = rules.map((rule, i) => ({
      ...rule,
      id: rule.name,
    }));

    const total = rules.length;

    return res.status(200).json({ data, total });
  } catch (err: any) {
    console.log("Error at [GET /rules]", err);

    return res
      .status(err.statusCode || 500)
      .json({ error: err.error, message: err.reason });
  }
});

router.get(
  "/:ruleName",
  keycloakConnect.protect("realm:user"),
  async (req, res) => {
    const { ruleName } = req.params;

    try {
      const rule = await openwhiskClient(req).rules.get(ruleName);

      console.log(`[GET /rules/${ruleName}] Response:`, rule);

      const data = {
        ...rule,
        id: ruleName,
      };

      return res.status(200).json({ data });
    } catch (err: any) {
      console.log(`Error at [GET /rules/${ruleName}]`, err);

      return res
        .status(err.statusCode || 500)
        .json({ error: err.error, message: err.reason });
    }
  }
);

router.put(
  "/:ruleName",
  keycloakConnect.protect("realm:user"),
  async (req, res) => {
    const { ruleName } = req.params;

    const { namespace, action, trigger, status, annotations, version } =
      req.body;

    const payload = {
      name: ruleName,
      action: action ?? "",
      trigger: trigger ?? "",
      status,
      annotations,
      //
      version,
    };

    const { overwrite } = req.query;

    let data;

    try {
      if (overwrite === "false") {
        data = await openwhiskClient(req).rules.create(payload);
      } else {
        data = await openwhiskClient(req).rules.update(payload);
      }

      console.log(`[PUT /rules/${ruleName}] Response:`, data);

      return res.status(200).json({ data: { ...data, id: ruleName } });
    } catch (err: any) {
      console.log(`Error at [PUT /rules/${ruleName}]`, err);

      return res
        .status(err.statusCode || 500)
        .json({ error: err.error, message: err.reason });
    }
  }
);

router.delete(
  "/:ruleName",
  keycloakConnect.protect("realm:user"),
  async (req, res) => {
    const { ruleName } = req.params;

    try {
      const rule = await openwhiskClient(req).rules.delete(ruleName);

      console.log(`[DELETE /rules/${ruleName}] Response:`, rule);

      const data = {
        ...rule,
        id: ruleName,
      };

      return res.status(200).json({ data });
    } catch (err: any) {
      console.log(`Error at [DELETE /rules/${ruleName}]`, err);

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
      const data = await openwhiskClient(req).rules.delete(payload);

      console.log(`[POST /rules/delete] Response:`, data);

      return res.status(200).json({ data });
    } catch (err: any) {
      console.log("Error at [POST /rules/delete]", err);

      return res
        .status(err.statusCode || 500)
        .json({ error: err.error, message: err.reason });
    }
  }
);

export default router;
