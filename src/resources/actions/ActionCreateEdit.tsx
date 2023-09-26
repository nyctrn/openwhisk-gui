import { Create, Edit } from "react-admin";
import {
  PageWrapper,
  CustomSimpleForm,
  CustomDivider,
  ActionInvoker,
} from "@/components";
import { filterOutEmptyValues, useHasRecord } from "@/utils";
import { useQueryClient } from "react-query";
import { ElementType, useEffect } from "react";
import {
  RestParams,
  Execution,
  Limits,
  Annotations,
} from "@/components/EntityParameters";
import { entityCreateEditStyles } from "@/themes/theme";

const tranformData = (data: Record<string, any>) => ({
  ...filterOutEmptyValues(data),
});

const ActionCreateEdit = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries(["actions", "getOne"]);
  }, [queryClient]);

  //   const loading = useLoading();

  const isEdit = useHasRecord();

  const Component: ElementType = isEdit ? Edit : Create;

  return (
    <PageWrapper>
      <Component
        component={"div"}
        sx={entityCreateEditStyles}
        transform={tranformData}
        redirect={isEdit ? false : "edit"}
      >
        <CustomSimpleForm>
          <RestParams />

          <CustomDivider />

          <Execution />

          <CustomDivider />

          {isEdit && (
            <>
              <ActionInvoker />
              <CustomDivider />
            </>
          )}

          <Limits />

          <CustomDivider />

          <Annotations />
        </CustomSimpleForm>
      </Component>
    </PageWrapper>
  );
};

export default ActionCreateEdit;
