import { Edit, useLoading, Create } from "react-admin";
import { Grid } from "@mui/material";
import {
  PageWrapper,
  Parameters,
  CustomDivider,
  CustomSimpleForm,
} from "@/components";
import { ReactNode, ElementType, useEffect } from "react";
import { useQueryClient } from "react-query";
import { Annotations, RestParams } from "@/components/EntityParameters";
import { useHasRecord } from "@/utils";
import { TriggerInvoker } from "@/components";
import { entityCreateEditStyles } from "@/themes/theme";

const KeyValueWrapper = ({ children }: { children: ReactNode }) => (
  <Grid
    item
    xs={12}
    sm={12}
    md={12}
    display="flex"
    justifyContent="space-around"
  >
    {children}
  </Grid>
);

const TriggerCreateEdit = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries(["triggers", "getOne"]);
  }, [queryClient]);

  //   const loading = useLoading();

  const isEdit = useHasRecord();

  const Component: ElementType = isEdit ? Edit : Create;

  return (
    <PageWrapper>
      <Component
        component={"div"}
        sx={entityCreateEditStyles}
        redirect={isEdit ? false : "edit"}
      >
        <CustomSimpleForm>
          <RestParams />

          <CustomDivider />

          {isEdit && (
            <>
              <TriggerInvoker />
              <CustomDivider />
            </>
          )}

          <KeyValueWrapper>
            <Parameters />
            <Annotations />
          </KeyValueWrapper>

          {/*limits */}
        </CustomSimpleForm>
      </Component>
    </PageWrapper>
  );
};

export default TriggerCreateEdit;
