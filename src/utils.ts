import axios from "axios";
import { Dict } from "openwhisk";
import { useGetRecordId } from "react-admin";
import { KeycloakTokenParsed } from "keycloak-js";

export const objectifyArray = (arr: Dict) =>
  arr.reduce((acc: Dict, item: Dict) => {
    acc[item.key] = item.value;
    return acc;
  }, {});

export const getPermissions = (decoded: KeycloakTokenParsed) => {
  const roles = decoded?.realm_access?.roles;

  if (!roles) {
    return false;
  }

  if (roles.includes("admin")) return "admin";
  if (roles.includes("user")) return "user";

  return false;
};

export const filterOutEmptyValues = (
  obj: Record<string, any>
): Record<string, any> =>
  Object.keys(obj).reduce((filteredObj, key) => {
    const value = obj[key];

    if (value === undefined || value === null) {
      // Skip undefined and null values
      return filteredObj;
    }

    if (Array.isArray(value) && value.length === 0) {
      // Skip empty arrays
      return filteredObj;
    }

    if (typeof value === "object" && Object.keys(value).length === 0) {
      // Skip empty objects
      return filteredObj;
    }

    if (typeof value === "object" && !Array.isArray(value)) {
      // Recursively filter nested objects
      const filteredNested = filterOutEmptyValues(value);
      if (Object.keys(filteredNested).length === 0) {
        // Skip the entire object if all properties are filtered out
        return filteredObj;
      }
      filteredObj[key] = filteredNested;
    } else {
      // Include non-empty and non-undefined properties
      filteredObj[key] = value;
    }

    return filteredObj;
  }, {});

export const useHasRecord = () => {
  try {
    const recordId = useGetRecordId();

    if (recordId) return true;
  } catch {
    return false;
  }

  return null;
};
