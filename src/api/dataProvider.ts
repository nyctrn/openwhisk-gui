import { axiosClient } from "./axiosClient";
import qs from "qs";
import { objectifyArray } from "../utils";
import { Action } from "openwhisk";

export const dataProvider = {
  getList: async (resource: string, params: { [key: string]: any }) => {
    switch (resource) {
      case "actions":
        const limit = params.filter.limit ?? 200;
        const skip = params.filter.skip ?? 0;

        try {
          const {
            data: { actions, total },
          } = await axiosClient.get(`actions?limit=${limit}&skip=${skip}`);

          const filteredActions = params.filter?.q
            ? actions.filter((action: Action) =>
                action?.name
                  ?.toLowerCase()
                  .includes(params.filter?.q?.toLowerCase())
              )
            : actions;

          return { data: filteredActions, total };
        } catch (error) {
          console.error(error);

          return Promise.reject(error);
        }

      case "activations":
        try {
          const queryParams = {
            limit: params.filter.limit ?? 200,
            docs: params.filter.fullDesc ?? true,
            skip: params.filter.skip,
            since: params.filter.since,
            upto: params.filter.upto,
            count: params.filter.count,
            name: params.filter.name,
          };

          const queryStringParams = qs.stringify(queryParams);

          const { data } = await axiosClient.get(
            `activations?${queryStringParams}`
          );

          return data;
        } catch (error) {
          console.error(error);

          return Promise.reject(error);
        }

      case "triggers":
        try {
          const { data } = await axiosClient.get("triggers");

          return data;
        } catch (error) {
          console.error(error);

          return Promise.reject(error);
        }

      case "rules":
        try {
          const { data } = await axiosClient.get("rules");

          return data;
        } catch (error) {
          console.error(error);

          return Promise.reject(error);
        }

      case "packages":
        try {
          const { data } = await axiosClient.get("packages");

          return data;
        } catch (error) {
          console.error(error);

          return Promise.reject(error);
        }

      // case "namespaces":
      //   try {
      //     const { data } = await axiosClient.get("namespaces");
      //     console.log(data);

      //     return data;
      //   } catch (error) {
      //     console.error(error);

      // return Promise.reject(error);

      //   }

      default:
        return Promise.reject();
    }
  },

  getOne: async (resource: string, params: { [key: string]: any }) => {
    switch (resource) {
      case "actions":
        try {
          const { data } = await axiosClient.get(`actions/${params.id}`);

          return data;
        } catch (error) {
          console.error(error);

          return Promise.reject(error);
        }

      case "activations":
        try {
          const { data } = await axiosClient.get(`activations/${params.id}`);

          return data;
        } catch (error) {
          console.error(error);

          return Promise.reject(error);
        }

      case "triggers":
        try {
          const { data } = await axiosClient.get(`triggers/${params.id}`);

          return data;
        } catch (error) {
          console.error(error);

          return Promise.reject(error);
        }

      case "rules":
        try {
          const { data } = await axiosClient.get(`rules/${params.id}`);

          return data;
        } catch (error) {
          console.error(error);

          return Promise.reject(error);
        }

      case "packages":
        try {
          const { data } = await axiosClient.get(`packages/${params.id}`);

          return data;
        } catch (error) {
          console.error(error);

          return Promise.reject(error);
        }

      default:
        return Promise.reject();
    }
  },

  create: async (resource: string, params: { [key: string]: any }) => {
    switch (resource) {
      case "actions":
        const isSequence = params.data.exec.kind === "sequence";

        try {
          const actionPayload = {
            // name: params.data.name,
            // namespace:
            action: !isSequence
              ? {
                  exec: {
                    code: params.data.exec.code,
                    main: params.data.exec.main,
                    kind: params.data.exec.kind,
                    image: params.data.exec.image,
                  },
                  parameters: params.data.parameters,
                  annotations: params.data.annotations,
                  limits: params.data.limits,
                  version: params.data.version,
                }
              : {
                  exec: {
                    kind: "sequence",
                    components: params.data.exec.components
                      .split(",")
                      .map(
                        (a: string) =>
                          `/${params.data.namespace ?? "_"}/${a.trim()}`
                      ),
                    code: params.data.exec.code,
                  },
                },
          };

          const { data } = await axiosClient.put(
            `actions/${params.data.name}`,
            actionPayload
          );

          return data;
        } catch (error: any) {
          console.error(error);

          return Promise.reject(error.response.data.error.error);
        }

      case "triggers":
        const triggerPayload = {
          name: params.data.name,
          // namespace:
          parameters: params.data.parameters,
          annotations: params.data.annotations,
          // limits:
          version: params.data.version,
          publish: params.data.publish,
        };

        try {
          const { data } = await axiosClient.put(
            `triggers/${params.data.name}`,
            triggerPayload
          );

          return data;
        } catch (error: any) {
          console.error(error);

          return Promise.reject(error.response.data.error.error);
        }

      case "rules":
        const rulePayload = {
          name: params.data.name,
          version: params.data.version,
          // publish: params.data.publish,
          // annotations: params.data.annotations,
          status: "active",
          trigger: params.data.trigger,
          action: params.data.action,
        };

        try {
          const { data } = await axiosClient.put(
            `rules/${params.data.name}`,
            rulePayload
          );

          return data;
        } catch (error: any) {
          console.error(error);

          return Promise.reject(error.response.data.error.error);
        }

      case "packages":
        const packagePayload = {
          // name: params.data.name,
          // namespace
          version: params.data.version,
          publish: params.data.publish,
          annotations: params.data.annotations,
          parameters: params.data.parameters,
          binding: params.data.binding,
        };

        try {
          const { data } = await axiosClient.put(
            `packages/${params.data.name}`,
            packagePayload
          );

          return data;
        } catch (error: any) {
          console.error(error);

          return Promise.reject(error.response.data.error.error);
        }

      default:
        return Promise.reject();
    }
  },

  update: async (resource: string, params: { [key: string]: any }) => {
    switch (resource) {
      case "actions":
        const isSequence = params.data.exec.kind === "sequence";

        try {
          const actionPayload = {
            // name: params.data.name,
            // namespace:
            action: !isSequence
              ? {
                  exec: {
                    code: params.data.exec.code,
                    main: params.data.exec.main,
                    kind: params.data.exec.kind,
                    image: params.data.exec.image,
                  },
                  parameters: params.data.parameters ?? [],
                  annotations: params.data.annotations,
                  limits: params.data.limits,
                  version: params.data.version,
                }
              : {
                  exec: {
                    kind: "sequence",
                    components: params.data.exec.components
                      .split(",")
                      .map(
                        (a: string) =>
                          `/${params.data.namespace ?? "_"}/${a.trim()}`
                      ),
                    code: params.data.exec.code,
                  },
                },
          };

          const { data } = await axiosClient.put(
            `actions/${params.data.name}?overwrite=true`,
            actionPayload
          );

          return data;
        } catch (error) {
          console.error(error);

          return Promise.reject(error);
        }

      case "triggers":
        const triggerPayload = {
          name: params.data.name,
          // namespace:
          parameters: params.data.parameters,
          annotations: params.data.annotations,
          // limits:
          version: params.data.version,
          publish: params.data.publish,
        };

        try {
          const { data } = await axiosClient.put(
            `triggers/${params.data.name}?overwrite=true`,
            triggerPayload
          );

          return data;
        } catch (error) {
          console.error(error);

          return Promise.reject(error);
        }

      case "rules":
        const rulesPayload = {
          // name: params.data.name,
          version: params.data.version,
          // publish: params.data.publish,
          // annotations: params.data.annotations,
          status: params.data.status,
          trigger: params.data.trigger.name,
          action: params.data.action.name,
        };

        try {
          const { data } = await axiosClient.put(
            `rules/${params.data.name}?overwrite=true`,
            rulesPayload
          );

          return data;
        } catch (error) {
          console.error(error);

          return Promise.reject(error);
        }

      case "packages":
        const packagesPayload = {
          // name: params.data.name,
          version: params.data.version,
          publish: params.data.publish,
          annotations: params.data.annotations,
          parameters: params.data.parameters,
        };

        try {
          const { data } = await axiosClient.put(
            `packages/${params.data.name}?overwrite=true`,
            packagesPayload
          );

          return data;
        } catch (error) {
          console.error(error);

          return Promise.reject(error);
        }

      default:
        return Promise.reject();
    }
  },

  delete: async (resource: string, params: { [key: string]: any }) => {
    switch (resource) {
      case "actions":
        try {
          const { data } = await axiosClient.delete(`actions/${params.id}`);

          return data;
        } catch (error) {
          console.error(error);

          return Promise.reject(error);
        }

      case "triggers":
        try {
          const { data } = await axiosClient.delete(`triggers/${params.id}`);

          return data;
        } catch (error) {
          console.error(error);

          return Promise.reject(error);
        }

      case "rules":
        try {
          const { data } = await axiosClient.delete(`rules/${params.id}`);

          return data;
        } catch (error) {
          console.error(error);

          return Promise.reject(error);
        }

      case "packages":
        try {
          const { data } = await axiosClient.delete(`packages/${params.id}`);

          return data;
        } catch (error) {
          console.error(error);

          return Promise.reject(error);
        }

      default:
        return Promise.reject();
    }
  },

  deleteMany: async (resource: string, params: { [key: string]: any }) => {
    switch (resource) {
      case "actions":
        const actionsPayload = params.ids;

        try {
          const { data } = await axiosClient.post(
            `actions/delete`,
            actionsPayload
          );

          return data;
        } catch (error) {
          console.error(error);

          return Promise.reject(error);
        }

      case "triggers":
        const triggersPayload = params.ids;

        try {
          const { data } = await axiosClient.post(
            `triggers/delete`,
            triggersPayload
          );

          return data;
        } catch (error) {
          console.error(error);

          return Promise.reject(error);
        }

      case "rules":
        const rulesPayload = params.ids;

        try {
          const { data } = await axiosClient.post(`rules/delete`, rulesPayload);

          return data;
        } catch (error) {
          console.error(error);

          return Promise.reject(error);
        }

      case "packages":
        const packagesPayload = params.ids;

        try {
          const { data } = await axiosClient.post(
            `packages/delete`,
            packagesPayload
          );

          return data;
        } catch (error) {
          console.error(error);

          return Promise.reject(error);
        }

      default:
        return Promise.reject();
    }
  },

  invokeAction: async (actionName: string, params: { [key: string]: any }) => {
    console.log("invokeAction: -> params:", params);
    const objectifiedParameters = objectifyArray(params.parameters);

    try {
      const { data } = await axiosClient.post(`actions/${actionName}`, {
        ...params,
        params: objectifiedParameters,
      });

      return data;
    } catch (error) {
      console.error(error);

      return Promise.reject(error);
    }
  },

  invokeTrigger: async (
    triggerName: string,
    params: { [key: string]: any }
  ) => {
    const objectifiedParameters = objectifyArray(params.parameters);

    try {
      const { data } = await axiosClient.post(`/triggers`, {
        triggerName,
        ...params,
        params: objectifiedParameters,
      });

      return data;
    } catch (error) {
      console.error(error);

      return Promise.reject(error);
    }
  },

  fetchCurrentNamespace: async () => {
    try {
      const { data } = await axiosClient.get("namespaces/namespace");

      return data;
    } catch (error) {
      console.error(error);

      return Promise.reject(error);
    }
  },

  fetchNamespaces: async () => {
    try {
      const { data } = await axiosClient.get("namespaces/fetch");

      return data;
    } catch (error) {
      console.error(error);

      return Promise.reject(error);
    }
  },

  useNamespace: async (namespace: string) => {
    try {
      const { data } = await axiosClient.post(`namespaces/${namespace}`);

      return data;
    } catch (error) {
      console.error(error);

      return Promise.reject(error);
    }
  },

  createNamespace: async ({
    namespace,
    email,
  }: {
    namespace: string;
    email: string;
  }) => {
    try {
      const { data } = await axiosClient.put(`namespaces/${namespace}`, {
        email,
      });

      console.error(namespace, "params namespace");

      return data;
    } catch (error) {
      console.error(error);

      return Promise.reject(error);
    }
  },

  fetchEntitiesCount: async () => {
    try {
      const { data } = await axiosClient.get("metrics/entitiesCount");

      return data;
    } catch (error) {
      return Promise.reject(error);
    }
  },

  fetchActivationsMetrics: async () => {
    try {
      const { data } = await axiosClient.get("metrics/activationsMetrics");

      return data;
    } catch (error) {
      console.error(error);

      return Promise.reject(error);
    }
  },

  fetchNamespaceLimits: async () => {
    try {
      const { data } = await axiosClient.get("limits");

      return data;
    } catch (error) {
      console.error(error);

      return Promise.reject(error);
    }
  },

  changeLimits: async (limitsPayload: { [key: string]: any }) => {
    const { namespace, ...limits } = limitsPayload;

    try {
      const { data } = await axiosClient.put(`limits/${namespace}`, {
        ...limits,
      });

      return data;
    } catch (error) {
      return Promise.reject(error);
    }
  },

  deleteNameSpaceLimits: async (namespace: string) => {
    try {
      const { data } = await axiosClient.delete(`limits/${namespace}`);

      return data;
    } catch (error) {
      console.error(error);

      return Promise.reject(error);
    }
  },
};
