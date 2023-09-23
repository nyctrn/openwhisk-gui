import { Grid } from "@mui/material";
import { CustomArrayInput } from "../index";

const Annotations = () => (
  <Grid item xs={12} sm={12} md={12}>
    <CustomArrayInput source="annotations" />
  </Grid>
);

export default Annotations;
