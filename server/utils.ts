import openwhisk from "openwhisk";
import KeycloakConnect from "keycloak-connect";
import session from "express-session";
import { Request } from "express";

export const openwhiskClient = (req: Request) => {
  const apiKey = `${req.session.namespace?.uuid}:${req.session.namespace?.key}`;

  const options = {
    apihost: process.env.OPENWHISK_API_HOST,
    api_key: apiKey,
    apigw_token: process.env.OPENWHISK_API_GW_TOKEN,
  };

  return openwhisk(options);
};

export const memoryStore = new session.MemoryStore();

export const keycloakConnect = new KeycloakConnect(
  { store: memoryStore },
  {
    realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM as string,
    "bearer-only": true,
    "auth-server-url": process.env.NEXT_PUBLIC_KEYCLOAK_AUTH_SERVER as string,
    resource: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID as string,
    "confidential-port": "0",
    "ssl-required": "external",
  }
);
