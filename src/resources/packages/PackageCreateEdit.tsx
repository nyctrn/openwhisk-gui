import { Edit, Create } from "react-admin";
import { Grid } from "@mui/material";
import { PageWrapper, CustomSimpleForm, CustomDivider } from "@/components";
import { ElementType, ReactNode } from "react";
import {
  Annotations,
  Parameters,
  RestParams,
} from "@/components/EntityParameters";
import { entityCreateEditStyles } from "@/themes/theme";
import { useHasRecord } from "@/utils";

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

const PackageCreateEdit = () => {
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

          <KeyValueWrapper>
            <Parameters />
            <Annotations />
          </KeyValueWrapper>
        </CustomSimpleForm>
      </Component>
    </PageWrapper>
  );
};

export default PackageCreateEdit;
