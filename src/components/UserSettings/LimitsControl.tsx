import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  Switch,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDataProvider, useNotify, usePermissions } from "react-admin";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { SectionWrapper } from "./NamespacesControl";

const LimitsControl = () => {
  const dataProvider = useDataProvider();

  const { permissions, isLoading, error } = usePermissions();

  const isAdmin = permissions === "admin";

  const notify = useNotify();

  const queryClient = useQueryClient();

  const data = queryClient.getQueryData<{
    namespace?: "string";
  }>("namespace");

  const {
    data: namespaceLimits = [],
    isFetching,
    // isLoading,
  } = useQuery<any>(
    "limits",
    async () => await dataProvider.fetchNamespaceLimits(),
    { staleTime: Infinity }
  );

  const [limits, setLimits] = useState({
    namespace: "",
    concurrentInvocations: namespaceLimits.concurrentInvocations,
    firesPerMinute: namespaceLimits.firesPerMinute,
    invocationsPerMinute: namespaceLimits.invocationsPerMinute,
    allowedKinds: namespaceLimits.allowedKinds,
    storeActivations: namespaceLimits.storeActivations,
  });

  useEffect(() => {
    setLimits({
      namespace: "",
      concurrentInvocations: namespaceLimits.concurrentInvocations,
      firesPerMinute: namespaceLimits.firesPerMinute,
      invocationsPerMinute: namespaceLimits.invocationsPerMinute,
      allowedKinds: namespaceLimits.allowedKinds,
      storeActivations: namespaceLimits.storeActivations,
    });
  }, [namespaceLimits]);

  const { mutate: changeLimits } = useMutation(
    async (limitsPayload: any) => {
      const { data } = await dataProvider.changeLimits(limitsPayload);

      return data;
    },
    {
      onSuccess: () => {
        if (limits.namespace === data?.namespace)
          queryClient.refetchQueries("limits");

        notify(
          <Alert severity="info">
            Namespace limits updated successfully. Changes may take a few
            minutes to take effect.
          </Alert>,
          { autoHideDuration: 5000 }
        );
      },
    }
  );

  const { mutate: deleteLimits } = useMutation(
    async (namespace: any) => {
      const { data } = await dataProvider.deleteNameSpaceLimits(namespace);

      return data;
    },
    {
      onSuccess: () => {
        if (limits.namespace === data?.namespace)
          queryClient.refetchQueries("limits");

        notify(
          <Alert severity="info">
            Namespace deleted successfully. Changes may take a few minutes to
            take effect.
          </Alert>,
          { autoHideDuration: 5000 }
        );
      },
    }
  );

  const handleLimitsChange = (e: any) => {
    setLimits({
      ...limits,
      [e.target.name]: e.target.value,
    });

    setLimits((prevState: any) => ({
      ...prevState,
      [e.target.name]:
        e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));
  };

  const handleLimitsButtonClick = () => {
    changeLimits({
      namespace: limits.namespace,
      concurrentInvocations: Number(limits.concurrentInvocations),
      firesPerMinute: Number(limits.firesPerMinute),
      invocationsPerMinute: Number(limits.invocationsPerMinute),
      ...(limits?.allowedKinds !== "undefined" && {
        allowedKinds: limits.allowedKinds?.split(","),
      }),
      ...(limits.storeActivations !== "undefined" && {
        storeActivations: limits.storeActivations,
      }),
    });
  };

  const handleDeleteLimits = () => {
    deleteLimits(limits.namespace);
  };

  return (
    <Box>
      <SectionWrapper>
        <TextField
          variant="outlined"
          label="Concurrent Invocations"
          value={limits.concurrentInvocations || ""}
          onChange={handleLimitsChange}
          name="concurrentInvocations"
          type="number"
          InputLabelProps={{ shrink: true }}
          inputProps={{ min: 0 }}
          disabled={!isAdmin}
        />
        <TextField
          variant="outlined"
          label="Fires / Minute"
          value={limits.firesPerMinute || ""}
          onChange={handleLimitsChange}
          name="firesPerMinute"
          type="number"
          InputLabelProps={{ shrink: true }}
          disabled={!isAdmin}
        />
        <TextField
          variant="outlined"
          label="Invocations / Minute"
          value={limits.invocationsPerMinute || ""}
          onChange={handleLimitsChange}
          name="invocationsPerMinute"
          type="number"
          InputLabelProps={{ shrink: true }}
          disabled={!isAdmin}
        />
      </SectionWrapper>
      <SectionWrapper>
        <TextField
          variant="outlined"
          label="Allowed Kinds"
          value={limits.allowedKinds || ""}
          placeholder={
            !limits.allowedKinds ? "No limits set" : limits.allowedKinds
          }
          onChange={handleLimitsChange}
          name="allowedKinds"
          InputLabelProps={{ shrink: true }}
          disabled={!isAdmin}
        />

        <FormControlLabel
          control={
            <Switch
              onChange={handleLimitsChange}
              checked={
                limits.storeActivations === undefined
                  ? true
                  : limits.storeActivations
              }
              name="storeActivations"
              inputProps={{ "aria-label": "controlled" }}
            />
          }
          label="Store Activations"
          name="storeActivations"
          disabled={!isAdmin}
        />
      </SectionWrapper>

      {isAdmin && (
        <SectionWrapper style={{ marginTop: "50px" }}>
          <TextField
            variant="outlined"
            label="Choose namespace"
            value={limits.namespace}
            onChange={handleLimitsChange}
            name="namespace"
            InputLabelProps={{ shrink: true }}
            required
          />

          <Button
            disabled={!limits.namespace}
            variant="outlined"
            onClick={handleLimitsButtonClick}
          >
            Change limits
          </Button>

          <Button
            disabled={!limits.namespace}
            variant="outlined"
            onClick={handleDeleteLimits}
          >
            Delete limits
          </Button>
        </SectionWrapper>
      )}
    </Box>
  );
};

export default LimitsControl;
