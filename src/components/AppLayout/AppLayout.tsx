import { ReactQueryDevtools } from "react-query/devtools";
import { CustomAppBar, CustomMenu } from "../index";
import { Layout } from "react-admin";

const AppLayout = (props: any) => (
  <>
    <Layout {...props} appBar={CustomAppBar} menu={CustomMenu} />

    <ReactQueryDevtools initialIsOpen={false} />
  </>
);

export default AppLayout;
