import React from 'react';
import { Button, alpha } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface ActionButtonProps {
  label: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  color?: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  onClick,
  icon = <AddIcon />,
  color = '#00A3FF'
}) => {
  return (
    <Button
      variant="contained"
      startIcon={icon}
      onClick={onClick}
      sx={{
        background: color,
        color: '#fff',
        textTransform: 'none',
        borderRadius: '12px',
        fontWeight: 600,
        px: 3,
        py: 1.2,
        boxShadow: `0 4px 12px ${alpha(color, 0.25)}`,
        '&:hover': {
          background: color,
          opacity: 0.9,
          boxShadow: `0 6px 16px ${alpha(color, 0.35)}`,
        },
      }}
    >
      {label}
    </Button>
  );
};

export default ActionButton;
