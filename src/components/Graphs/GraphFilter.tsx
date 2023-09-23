import React from "react";
import "chart.js/auto";
import { Button } from "react-admin";
import { Box, TextField, Typography, styled } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

const FieldsWrapper = styled("div")`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-top: 1rem;
  margin-left: 2rem;
`;

type GrapFilterProps = {
  limit: number;
  setLimit: (limit: number) => void;
  since?: number;
  setSince: (since?: number) => void;
  upto?: number;
  setUpto: (upto?: number) => void;
  name?: string;
  setName: (name: string) => void;
  activationId?: string;
  setActivationId: (activationId?: string) => void;
  refetchActivations: () => void;
  refetchActivation: () => void;
  setIsActivationId: (arg: boolean) => void;
};

const GraphFilter = ({
  limit,
  setLimit,
  since,
  setSince,
  upto,
  setUpto,
  name,
  setName,
  activationId,
  setActivationId,
  refetchActivations,
  refetchActivation,
  setIsActivationId,
}: GrapFilterProps) => {
  const handleActivationIdChange = (e: any) => {
    setActivationId(e.target.value);
  };

  const handleLimitChange = (e: any) => {
    setLimit(e.target.value);
  };

  const handleNameChange = (e: any) => {
    setName(e.target.value);
  };

  return (
    <Box>
      <FieldsWrapper>
        <TextField
          label="Search Query"
          variant="outlined"
          value={activationId}
          onChange={handleActivationIdChange}
          InputLabelProps={{ shrink: true }}
          placeholder="Enter activation ID"
        />
        <Button
          variant="contained"
          sx={{ backgroundColor: "#325c80", span: { mr: 0 } }}
          size="small"
          onClick={() => {
            refetchActivation();
            setIsActivationId(true);
          }}
        >
          <Typography variant="subtitle2">search</Typography>
        </Button>
      </FieldsWrapper>

      <FieldsWrapper>
        <TextField
          label="Activations Number Limit (0-200)"
          variant="outlined"
          value={limit}
          type="number"
          onChange={handleLimitChange}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          label="Entity name"
          variant="outlined"
          value={name}
          onChange={handleNameChange}
          InputLabelProps={{ shrink: true }}
        />

        <DateTimePicker
          label="Since"
          onChange={(val: any) => setSince(Date.parse(val.$d))}
          slotProps={{
            textField: {
              variant: "outlined",
              InputLabelProps: { shrink: true },
            },
          }}
        />

        <DateTimePicker
          label="Upto"
          onChange={(val: any) => setUpto(Date.parse(val.$d))}
          slotProps={{
            textField: {
              variant: "outlined",
              InputLabelProps: { shrink: true },
            },
          }}
        />

        <Button
          variant="contained"
          sx={{
            backgroundColor: "#325c80",
            fontSize: "0.8rem",
            span: { mr: 0 },
          }}
          size="small"
          onClick={() => {
            refetchActivations();
            setIsActivationId(false);
          }}
        >
          <Typography variant="subtitle2">search</Typography>
        </Button>
      </FieldsWrapper>
    </Box>
  );
};

export default GraphFilter;
