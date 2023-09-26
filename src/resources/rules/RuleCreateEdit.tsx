import { Edit, Create } from "react-admin";
import { PageWrapper, CustomSimpleForm } from "@/components";
import { ElementType, useEffect } from "react";
import { useHasRecord } from "@/utils";
import { entityCreateEditStyles } from "@/themes/theme";
import { RestParams } from "@/components/EntityParameters";
import { useQueryClient } from "react-query";

const RuleCreateEdit = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries(["rules", "getOne"]);
  }, [queryClient]);

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
