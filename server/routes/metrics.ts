// @ts-nocheck
import express from "express";
import { keycloakConnect, openwhiskClient } from "../utils";
import DatabaseService from "../services/DatabaseService";

const router = express.Router();

router.get(
  "/entitiesCount",
  keycloakConnect.protect("realm:user"),
  async (req, res) => {
    try {
      const [{ actions }, { triggers }, { rules }, { packages }] =
        await Promise.all([
          openwhiskClient(req).actions.list({ count: true }),
          openwhiskClient(req).triggers.list({ count: true }),
          openwhiskClient(req).rules.list({ count: true }),
          openwhiskClient(req).packages.list({ count: true }),
        ]);

      console.log("[GET /metrics/entitiesCount] Response:", {
        actions,
        triggers,
        rules,
        packages,
      });

      return res.status(200).json({ actions, triggers, rules, packages });
    } catch (err: any) {
      console.log("Error at [GET /metrics/entitiesCount]:", err);

      return res
        .status(err.statusCode || 500)
        .json({ error: err.error, message: err.reason });
    }
  }
);

router.get(
  "/activationsMetrics",
  keycloakConnect.protect("realm:user"),
  async (req, res) => {
    try {
      const namespaceActivationsResponse =
        await DatabaseService.fetcActivations(req.session.namespace.name);

      const activationsMetrics = namespaceActivationsResponse.rows.map(
        (activation) => ({
          kind: activation.doc.annotations.find((el) => el.key === "kind")
            ?.value,
          path: activation.doc.annotations.find((el) => el.key === "path")
            ?.value,
          duration: activation.doc.duration,
          waitTime: activation.doc.annotations.find(
            (el) => el.key === "waitTime"
          )?.value,
          initTime: activation.doc.annotations.find(
            (el) => el.key === "initTime"
          )?.value,
        })
      );

      let durationSum = 0;
      let durationCount = 0;

      let waitTimeSum = 0;
      let waitTimeCount = 0;

      let initTimeSum = 0;
      let initTimeCount = 0;

      for (const activation of activationsMetrics) {
        if (activation?.duration) {
          durationSum += activation.duration;
          durationCount++;
        }
        if (activation?.waitTime) {
          waitTimeSum += activation.waitTime;
          waitTimeCount++;
        }

        if (activation?.initTime) {
          initTimeSum += activation.initTime;
          initTimeCount++;
        }
      }

      const durationAvg = durationCount
        ? (durationSum / durationCount).toFixed(1)
        : null;

      const waitTimeAvg = waitTimeCount
        ? (waitTimeSum / waitTimeCount).toFixed(1)
        : null;

      const initTimeAvg = initTimeCount
        ? (initTimeSum / initTimeCount).toFixed(1)
        : null;

      console.log("[GET /metrics/activationsMetrics] Response:", {
        totalActivations: activationsMetrics.length,
        totalActionActivations: durationCount,
        totalTriggerActivations: activationsMetrics.length - durationCount,
        coldStarts: initTimeCount,
        activationsTimeMetrics: {
          durationAvg,
          waitTimeAvg,
          initTimeAvg,
        },
      });

      return res.status(200).json({
        totalActivations: activationsMetrics.length,
        totalActionActivations: durationCount,
        totalTriggerActivations: activationsMetrics.length - durationCount,
        coldStarts: initTimeCount,
        activationsTimeMetrics: {
          durationAvg,
          waitTimeAvg,
          initTimeAvg,
        },
      });
    } catch (err: any) {
      console.log("Error at [GET /metrics/activationsMetrics]:", err);

      return res
        .status(err.statusCode || 500)
        .json({ error: err.error, message: err.reason });
    }
  }
);

export default router;
