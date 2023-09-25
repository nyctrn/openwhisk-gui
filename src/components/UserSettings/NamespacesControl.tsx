import { useState } from "react";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { TextField, Button, styled, Alert } from "@mui/material";
import {
  useNotify,
  useDataProvider,
  usePermissions,
  useLoading,
} from "react-admin";

export const SectionWrapper = styled("div")`
  display: flex;
  gap: 50px;
  justify-content: center;
  align-content: space-between;
  margin-bottom: 10px;

  > div {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
  }
`;

const NamespaceControl = () => {
  const queryClient = useQueryClient();

  const isLoading = useLoading();

  const {
    permissions,
    isLoading: isLoadingPermissions,
    error,
  } = usePermissions();

  const isAdmin = permissions === "admin";

  const { namespace } = queryClient.getQueryData(["namespace"]) as any;

  const [userNamespace, setUserNamespace] = useState(namespace ?? "");

  const [targetUser, setTargetUser] = useState("");

  const [newNamespaceValue, setNewNamespaceValue] = useState("");

  const notify = useNotify();

  const dataProvider = useDataProvider();

  const { data: userNamespaces = [], isFetching: isFetchingUserNamespaces } =
    useQuery<any>(
      ["userNamespaces"],
      async () => await dataProvider.fetchNamespaces()
    );

  const {
    mutate: changeNamespace,
    // isLoading,
    data,
    // error,
  } = useMutation(
    async (value: string) => {
      const { data } = await dataProvider.useNamespace(value);

      return data;
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries("namespace");
        queryClient.refetchQueries("limits");
        queryClient.refetchQueries("entitiesCount");
        queryClient.refetchQueries("activationsMetrics");

        ["actions", "triggers", "rules", "activations"].forEach((item) =>
          queryClient.invalidateQueries(item)
        );
      },
    }
  );

  const { mutate: createNamespace } = useMutation(
    async ({ namespace, email }: { namespace: string; email: string }) => {
      const { data } = await dataProvider.createNamespace({ namespace, email });

      queryClient.invalidateQueries("userNamespaces");

      return data;
    },
    {
      onError: (data) => {
        notify(
          <Alert severity="error" sx={{ alignItems: "center" }}>
            <Box display="flex" flexDirection="column">
              <span>Error: {data?.response?.data?.error}.</span>{" "}
              <span>Description: {data?.response?.data?.description}.</span>
            </Box>
          </Alert>,
          { autoHideDuration: 5000 }
        );
      },
      onSuccess: () => {
        notify(
          <Alert severity="success">
            Namespace {newNamespaceValue} created successfully
          </Alert>,
          { autoHideDuration: 5000 }
        );

        setNewNamespaceValue("");
        setTargetUser("");

        queryClient.refetchQueries("userNamespaces");
      },
    }
  );

  const handleSelectorChange = (event: SelectChangeEvent) => {
    setUserNamespace(event.target.value);

    changeNamespace(event.target.value);

    notify(<Alert severity="success">Successfully changed namespace</Alert>);
  };

  const handleTargetUserChange = (event: any) => {
    setTargetUser(event.target.value);
  };

  const handleInputChange = (event: any) => {
    setNewNamespaceValue(event.target?.value);
  };

  const handleCreateClick = () => {
    createNamespace({ namespace: newNamespaceValue, email: targetUser });
  };

  return (
    <SectionWrapper>
      <Box>
        <Typography variant="body1" fontSize={18}>
          Choose namespace:
        </Typography>
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <Select
            variant="outlined"
            value={userNamespace ?? ""}
            onChange={handleSelectorChange}
            // disabled={isFetchingUserNamespaces || isLoading}
            placeholder="Your namespaces"
            sx={{
              width: "300px",
              //   height: "60px",
              // ".MuiSvgIcon-root": {
              //   display:
              //     isFetchingUserNamespaces || isLoading ? "none" : "initial",
              // },
            }}
          >
            {userNamespaces?.map((namespace: any) => (
              <MenuItem key={namespace.name} value={namespace.name}>
                {namespace.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      {isAdmin && (
        <Box>
          <Typography variant="body1" fontSize={18}>
            Create namespace:
          </Typography>
          <TextField
            variant="outlined"
            label="New namespace"
            onChange={handleInputChange}
            value={newNamespaceValue}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            variant="outlined"
            label="for user"
            value={targetUser || ""}
            onChange={handleTargetUserChange}
            InputLabelProps={{ shrink: true }}
            placeholder="enter user's email..."
          />
          <Button disabled={!newNamespaceValue} onClick={handleCreateClick}>
            Create
          </Button>
        </Box>
      )}
      {/* {isLoading && <CircularProgress />} */}
    </SectionWrapper>
  );
};

export default NamespaceControl;
