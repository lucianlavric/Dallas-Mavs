import React, { useState } from 'react';
import { TextField, Button, Box, Typography, FormControl } from '@mui/material';

const ScoutingReportForm = ({ onAddReport }) => {
  const [scoutName, setScoutName] = useState('');
  const [reportText, setReportText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation: prevent submitting empty reports or reports with only whitespace
    if (!scoutName.trim() || !reportText.trim()) {
      // Optionally, show an error message to the user here if desired
      return;
    }
    onAddReport({
      scout: scoutName.trim(), // Trim whitespace
      report: reportText.trim(), // Trim whitespace
      // Date and ID will be added by the parent component (PlayerProfile)
    });
    setScoutName('');
    setReportText('');
  };

  const isSubmitDisabled = !scoutName.trim() || !reportText.trim();

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, p: 2, border: '1px solid #ddd', borderRadius: '4px' }}>
      <Typography variant="h6" gutterBottom sx={{ fontFamily: 'Inter' }}>Add New Scouting Report</Typography>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <TextField
          multiline
          rows={4}
          label="Scouting Report"
          value={reportText}
          onChange={(e) => setReportText(e.target.value)}
          sx={{ 
            fontFamily: 'Inter',
            '& .MuiInputBase-input': { fontFamily: 'Inter' },
            '& .MuiInputLabel-root': { fontFamily: 'Inter' }
          }}
          required
        />
      </FormControl>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <TextField
          label="Scout Name"
          value={scoutName}
          onChange={(e) => setScoutName(e.target.value)}
          sx={{ 
            fontFamily: 'Inter',
            '& .MuiInputBase-input': { fontFamily: 'Inter' },
            '& .MuiInputLabel-root': { fontFamily: 'Inter' }
          }}
          required
        />
      </FormControl>
      <Button 
        type="submit" 
        variant="contained" 
        color="primary" 
        sx={{ mt: 1, fontFamily: 'Inter' }}
        disabled={isSubmitDisabled} 
      >
        Add Report
      </Button>
    </Box>
  );
};

export default ScoutingReportForm;
