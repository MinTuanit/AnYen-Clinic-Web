import React from 'react';
import { Box, Paper, Typography, Chip, alpha } from '@mui/material';

interface StatCardProps {
  label: string;
  value: string | number;
  subLabel?: string;
  icon: React.ReactNode;
  iconBg: string;
  change?: string;
  changeColor?: 'success' | 'error' | 'warning' | 'info';
  valueColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subLabel,
  icon,
  iconBg,
  change,
  changeColor,
  valueColor = '#1E293B'
}) => {
  // Determine chip colors based on change string or prop
  const isPositive = change?.startsWith('+');
  const isNegative = change?.startsWith('-');

  const getChipBg = () => {
    if (changeColor === 'success' || isPositive) return '#E8F8F1';
    if (changeColor === 'error' || isNegative) return '#FDEDEE';
    if (changeColor === 'warning') return '#FFF7ED';
    return '#F1F5F9';
  };

  const getChipColor = () => {
    if (changeColor === 'success' || isPositive) return '#27AE60';
    if (changeColor === 'error' || isNegative) return '#E74C3C';
    if (changeColor === 'warning') return '#F97316';
    return '#475569';
  };

  return (
    <Paper
      sx={{
        p: '12px 16px',
        borderRadius: 3,
        boxShadow: 'none',
        background: '#fff',
        border: '1px solid #E8ECF0',
        position: 'relative',
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        transition: '0.3s',
        '&:hover': {
          boxShadow: '0 4px 20px ' + alpha('#000', 0.05),
          transform: 'translateY(-2px)'
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box
          sx={{
            bgcolor: iconBg,
            borderRadius: 2,
            p: 1,
            display: 'flex',
            '& svg': { fontSize: 24 }
          }}
        >
          {icon}
        </Box>
        {change && (
          <Chip
            label={change}
            size="small"
            sx={{
              fontSize: 11,
              fontWeight: 700,
              height: 22,
              bgcolor: getChipBg(),
              color: getChipColor(),
              borderRadius: '6px'
            }}
          />
        )}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mt: 1 }}>
        <Typography
          fontWeight={700}
          fontSize={24}
          lineHeight={1}
          sx={{ color: valueColor }}
        >
          {value}
        </Typography>
        {subLabel && (
          <Typography fontSize={14} color="text.secondary" fontWeight={600}>
            {subLabel}
          </Typography>
        )}
      </Box>
      <Typography fontSize={15} color="text.secondary" fontWeight={500} >
        {label}
      </Typography>
    </Paper>
  );
};

export default StatCard;
