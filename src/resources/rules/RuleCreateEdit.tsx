import { Edit, Create } from "react-admin";
import { PageWrapper, CustomSimpleForm } from "@/components";
import { ElementType } from "react";
import { useHasRecord } from "@/utils";
import { entityCreateEditStyles } from "@/themes/theme";
import { RestParams } from "@/components/EntityParameters";

const RuleCreateEdit = () => {
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

          {/* <CustomDivider /> */}
          {/* <Annotations /> */}
        </CustomSimpleForm>
      </Component>
    </PageWrapper>
  );
};

export default RuleCreateEdit;
