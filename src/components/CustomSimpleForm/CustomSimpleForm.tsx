import { PropsWithChildren } from "react";
import { Box, Card, CardContent, Grid } from "@mui/material";
import { SimpleForm, SimpleFormProps } from "react-admin";
import { BackButton } from "../index";
import CustomToolBar from "./CustomToolbar";

const CustomSimpleForm = (props: PropsWithChildren<SimpleFormProps>) => (
  <Box maxWidth="80rem" minWidth="73rem" margin="0 auto">
    <Card>
      <CardContent>
        <SimpleForm
          mode="onChange"
          reValidateMode="onChange"
          onError={() => console.log("error")}
          toolbar={<CustomToolBar />}
          {...props}
        >
          <Grid container spacing={3} display="flex" flexDirection="column">
            <BackButton />

            {props.children}
          </Grid>
        </SimpleForm>
      </CardContent>
    </Card>
  </Box>
);

export default CustomSimpleForm;
