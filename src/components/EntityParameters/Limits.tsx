import { FormControl, FormLabel, Grid } from "@mui/material";
import { NumberInput, maxValue, minValue } from "react-admin";
import { CustomInputLabel } from "../index";

const actionLimits = [
  {
    source: "limits.concurrency",
    label: "concurrency (N)",
    placeholder: "1",
    infoIcon: {
      info: "The number of concurrent activation processing within the same action container. This limit can only be changed if the limit in conf file has changed.",
      defaultValue: "1",
    },
    width: "130px",
  },
  {
    source: "limits.logs",
    label: "logs (MB)",
    placeholder: "10",
    validate: [minValue(0), maxValue(10)],
    infoIcon: {
      info: "The number of MB that a container is allowed to write to stdout. Valid numbers are between 0 and 10.",
      defaultValue: "10",
    },
  },
  {
    source: "limits.memory",
    label: "memory (MB)",
    placeholder: "256",
    validate: [minValue(128), maxValue(512)],
    infoIcon: {
      info: "The number of MB a container is allowed to allocate. Valid numbers are between 128 and 512.",
      defaultValue: "256",
    },
  },
  {
    source: "limits.timeout",
    label: "timeout (ms)",
    placeholder: "60000",
    validate: [minValue(0), maxValue(300000)],
    infoIcon: {
      info: "The timeout limit a container is allowed to run. Valid number are between 100 and 300000.",
      defaultValue: "60000",
    },
  },
];

const Limits = () => {
  return (
    <Grid item xs={12} sm={12} md={12}>
      <FormControl
        sx={{ flexWrap: "wrap", flexDirection: "row", columnGap: 4 }}
      >
        <FormLabel sx={{ display: "flex", alignItems: "center" }}>
          Limits
        </FormLabel>
        {actionLimits.map((limit) => (
          <NumberInput
            key={limit.source}
            source={limit.source}
            label={
              <CustomInputLabel
                label={limit.label}
                {...(limit.infoIcon && {
                  infoIcon: {
                    info: limit.infoIcon?.info,
                    defaultValue: limit.infoIcon?.defaultValue,
                  },
                })}
              />
            }
            placeholder={limit.placeholder}
            validate={limit.validate}
            sx={{
              width: limit.width || "120px",
              input: { textAlign: "center" },
            }}
            InputLabelProps={{ shrink: true }}
          />
        ))}
      </FormControl>
    </Grid>
  );
};

export default Limits;
