import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

const AnalysisModal = ({ open, handleClose, data }) => {
  console.log(data);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Analysis Results</DialogTitle>
      <DialogContent dividers>
        <Typography variant="h6" gutterBottom>
          Overall Summary:
        </Typography>
        <Typography variant="body1" paragraph>
          {data.overall}
        </Typography>

        <Typography variant="h6" gutterBottom>
          Insights:
        </Typography>
        {data.insights.split("\n\n").map((insight, index) => (
          <Typography key={index} variant="body2" paragraph>
            {insight}
          </Typography>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AnalysisModal;
