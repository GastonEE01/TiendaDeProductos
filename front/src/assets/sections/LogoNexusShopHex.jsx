import React from 'react';
import { FaCircleNodes,FaBoltLightning,FaBolt,FaBagShopping  } from 'react-icons/fa6'; // Un rayo moderno y veloz
import {Box, Typography} from '@mui/material';
import { Link } from "react-router-dom";

import { FaHubspot } from 'react-icons/fa6'; 
export const LogoNexusShopHex = ({
  size = { xs: 24, sm: 30 },
  fontSize = { xs: '1rem', sm: '1.25rem' },
}) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 }, minWidth: 0, maxWidth: '100%' }}>
      <Box 
       component={Link}
       to="/"
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          flex: '0 0 auto',
          background: 'linear-gradient(135deg, #1d4ed8 0%, #0284c7 100%)',
          p: { xs: 0.75, sm: 1.25 },
          borderRadius: '10px',
          boxShadow: '0 4px 14px rgba(2, 132, 199, 0.25)',
          '& svg': {
            width: size,
            height: size,
          },
        }}
      >
        <FaHubspot color="#f8fafc" />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: '6px' }, minWidth: 0 }}>
        <Typography
          variant="h5"
          sx={{ fontSize, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#f8fafc', lineHeight: 1, whiteSpace: 'nowrap' }}
        >
          Nexus
        </Typography>
        <Box 
          sx={{ 
            backgroundColor: '#2563eb', 
            borderRadius: '4px', 
            px: { xs: 0.75, sm: 1 }, 
            py: { xs: 0.25, sm: 0.5 },
            display: 'flex',
            alignItems: 'center',
            flex: '0 0 auto',
          }}
        >
          <Typography variant="caption" sx={{ fontSize: { xs: '0.55rem', sm: '0.75rem' }, fontWeight: 'bold', letterSpacing: '1px', color: '#f8fafc' }}>
            SHOP
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
