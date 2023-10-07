import express, { Request, Response } from "express";
import { keycloakConnect, openwhiskClient } from "../utils";
import { Limits } from "openwhisk";

type AnnotationsObject = {
  initTime: number;
  kind: string;
  path: string;
  timeout: boolean;
  waitTime: number;
  limits: Limits & { [key: string]: any };
} & { [key: string]: any };

const router = express.Router();

router.get(
  "/",
  keycloakConnect.protect("realm:user"),
  async (req: Request, res) => {
    const { limit, docs, since, skip, upto, count, name } = req.query;

    try {
      const activations = await openwhiskClient(req).activations.list({
        ...(docs && { docs: docs === "true" }),
        ...(limit && { limit: Number(limit) }),
        ...(since && { since: Number(since) }),
        ...(skip && { skip: Number(skip) }),
        ...(upto && { upto: Number(upto) }),
        ...(count && { count: count === "true" }),
        ...(name && { name: name as string }),
      });

      console.log("[GET /activations] Response:", activations);

      const data = activations.map((activation, i) => {
        const processedAnnotations = activation.annotations?.map(
          (annotation) => {
            return { [annotation.key]: annotation.value };
          }
        );

        // FIXME:
        const annotationsObj: AnnotationsObject = Object.assign(
          {},
          ...(processedAnnotations || [])
        );

        const isAction = annotationsObj.kind !== undefined;

        return {
          ...activation,
          // @ts-ignore
          duration: isAction ? activation.duration : "-",
          // @ts-ignore
          waitTime: isAction ? annotationsObj.waitTime : "-",
          kind: isAction ? annotationsObj.kind : "-",
          // @ts-ignore
          path: isAction ? annotationsObj.path : "-",
          id: activation.activationId,
          annotationsObj,
          containerStart: isAction
            ? annotationsObj.initTime
              ? "cold"
              : "warm"
            : "-",
          initTime: annotationsObj.initTime ?? "-",
          entity: isAction ? "action" : "trigger",
          index: i + 1,
        };
      });

      const total = await openwhiskClient(req).activations.list({
        count: true,
      });
      console.log("totalActivations -> totalActivations:", total);
      // @ts-ignore
      return res.status(200).json({ data, total: total.activations });
    } catch (err: any) {
      console.log("Error at [GET /activations]:", err);

      return res
        .status(err.statusCode || 500)
        .json({ error: err.error, message: err.reason });
    }
  }
);

router.get(
  "/:activationId",
  keycloakConnect.protect("realm:user"),
  async (req, res) => {
    const { activationId } = req.params;

    try {
      const activation = await openwhiskClient(req).activations.get(
        activationId
      );

      console.log(`[GET /activations/${activationId}] Response:`, activation);

      const processedAnnotations = activation.annotations?.map(
        (annotation) => ({
          [annotation.key]: annotation.value,
        })
      );

      const annotationsObj = Object.assign({}, ...(processedAnnotations || []));

      const data = {
        ...activation,
        id: activation.activationId,
        annotationsObj,
        containerStart: annotationsObj.initTime ? "cold" : "warm",
        initTime: annotationsObj.initTime ?? "-",
      };

      return res.status(200).json({ data });
    } catch (err: any) {
      console.log(`Error at [GET /activations/${activationId}]:`, err);

      return res
        .status(err.statusCode || 500)
        .json({ error: err.error, message: err.reason });
    }
  }
);

export default router;
