import React, { useEffect, useRef, useState } from "react";
import { Admin, Resource, CustomRoutes, AuthProvider } from "react-admin";
import { Route } from "react-router-dom";
import Keycloak from "keycloak-js";
import { keycloakAuthProvider } from "ra-keycloak";
import actions from "./resources/actions";
import { dataProvider } from "./api/dataProvider";
import {
  AppLayout,
  Dashboard,
  ActionInvoker,
  Graphs,
  UserSettings,
  Flows,
  LoadingOpenWhisk,
} from "./components";
import activations from "./resources/activations";
import triggers from "./resources/triggers";
import rules from "./resources/rules";
import packages from "./resources/packages";
import { lightTheme } from "./themes";
import {
  FunctionsSharp as ActionsIcon,
  SatelliteAltSharp as TriggersIcon,
  Cable as RulesIcon,
  RocketLaunchSharp as ActivationsIcon,
  Inventory2Sharp as PackagesIcon,
} from "@mui/icons-material";
import { getPermissions } from "./utils";
import { keycloakConfig } from "./configs/keycloak";
import { queryClient } from "./configs/queryclient";

const App = () => {
  const [keycloak, setKeycloak] = useState<Keycloak>();

  const authProvider = useRef<AuthProvider>();

  useEffect(() => {
    const initKeycloakClient = async () => {
      const keycloakclient = new Keycloak(keycloakConfig);

      try {
        await keycloakclient.init({ onLoad: "login-required" });
      } catch (error) {
        console.error("Adapter initialization has failed: ", error);
      }

      authProvider.current = {
        ...keycloakAuthProvider(keycloakclient, {
          onPermissions: getPermissions,
        }),
      };

      setKeycloak(keycloakclient);

      keycloakclient?.token &&
        localStorage.setItem("accessToken", keycloakclient?.token);
    };

    if (!keycloak) {
      initKeycloakClient();
    }
  }, [keycloak]);

  if (!keycloak) return <LoadingOpenWhisk />;

  return (
    <React.StrictMode>
      <Admin
        authProvider={authProvider.current}
        dataProvider={dataProvider as any}
        layout={AppLayout}
        dashboard={Dashboard}
        title="OpenWhisk GUI"
        disableTelemetry
        theme={lightTheme}
        loginPage={false}
        queryClient={queryClient}
      >
        <Resource {...actions} icon={ActionsIcon} />
        <Resource {...triggers} icon={TriggersIcon} />
        <Resource {...rules} icon={RulesIcon} />
        <Resource {...packages} icon={PackagesIcon} />
        <Resource {...activations} icon={ActivationsIcon} />

        <CustomRoutes>
          <Route path="/invoker" element={<ActionInvoker />} />
          <Route path="/graphs" element={<Graphs />} />
          <Route path="/flows" element={<Flows />} />
          <Route path="/settings" element={<UserSettings />} />
        </CustomRoutes>
      </Admin>
    </React.StrictMode>
  );
};

export default App;
