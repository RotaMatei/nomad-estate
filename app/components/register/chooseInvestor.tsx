import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import CustomButton from '@/app/components/utils/button';
import TouchAppOutlinedIcon from '@mui/icons-material/TouchAppOutlined';
// explicit palette: two darker reds, base red, two lighter reds

export default function ChooseInvestor({ onSelect }: { onSelect: () => void }) {
  return (
    <Box sx={{ height: '100%', position: 'relative', overflow: 'hidden', color: '#fff', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', p: 6 }}>
      {/* Plain solid circle (red base), same size/position as previous wavy circle; no border or shadow */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          top: '-50vh',
          left: 0,
          zIndex: 0,
          width: 2000,
          height: 2000,
          borderRadius: '50%',
          backgroundColor: '#E93B20',
          boxShadow: 'none',
          border: 'none',
        }}
      />

      {/* Decorative SVG anchored bottom-left; grows with viewport without distortion */}
      <Box
        component="img"
        src="/ChooseInvestor.svg"
        alt=""
        aria-hidden
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          zIndex: 1,
          width: 'auto',
          height: { sm: '30%',md: '45%' , lg : '55%'},
          maxWidth: 'none',
          pointerEvents: 'none',
          userSelect: 'none',
          display: 'block',
        }}
      />

      <Box sx={{ width: '100%', maxWidth: '100%', textAlign: 'center', position: 'relative', top: '25vh', transform: 'translateY(-50%)', zIndex: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
          Are you an <Box component="span" sx={{ display: 'inline', fontWeight: 900 }}>Investor</Box>?
        </Typography>
        <Typography sx={{ mb: 4, opacity: 0.95, fontWeight: 700 }}>
          Use this button to become an investor and start using our tools now.
        </Typography>

        <CustomButton
          color="primary"
          label="SignUp"
          onClick={onSelect}
          type="button"
          fullWidth={false}
          sx={{
            width: 240,
            mx: 'auto',
            backgroundColor: '#ffffff',
            color: '#003FC7',
            boxShadow: '0 6px 0 rgba(0,63,199,0.35)',
            '&:hover': { backgroundColor: '#f7f7f7' },
          }}
          icon={<TouchAppOutlinedIcon sx={{ color: '#003FC7' }} />}
        />

        <Typography sx={{ mt: 3, color: '#fff', fontStyle: 'italic', fontWeight: 400 }}>
          Already have an Investor account?{' '}
          <Link href="/login" style={{ fontWeight: 700, fontStyle: 'normal', color: 'inherit', textDecoration: 'none' }}>Log in</Link>
        </Typography>
      </Box>
    </Box>
  );
}
