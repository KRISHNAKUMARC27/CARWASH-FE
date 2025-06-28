import React from 'react';
import PropTypes from 'prop-types';
import { Box, useTheme } from '@mui/material';

const StatusCell = ({ cell }) => {
  const theme = useTheme();
  const value = cell.getValue();

  // Map status values to colors from theme
  const statusColors = {
    OPEN: {
      bg: theme.palette.success.dark,
      text: theme.palette.success.contrastText
    },
    CLOSED: {
      bg: theme.palette.info.dark,
      text: theme.palette.info.contrastText
    },
    CANCELLED: {
      bg: theme.palette.error.dark,
      text: theme.palette.error.contrastText
    }
  };

  const { bg, text } = statusColors[value] || {
    bg: theme.palette.grey[500],
    text: theme.palette.getContrastText(theme.palette.grey[500])
  };

  return (
    <Box
      component="span"
      sx={{
        cursor: 'pointer',
        backgroundColor: bg,
        color: text,
        borderRadius: '0.35rem',
        maxWidth: '9ch',
        p: '0.25rem',
        display: 'inline-block',
        textAlign: 'center',
        fontWeight: 500
      }}
    >
      {value}
    </Box>
  );
};

StatusCell.propTypes = {
  cell: PropTypes.shape({
    getValue: PropTypes.func.isRequired
  }).isRequired
};

export default StatusCell;
