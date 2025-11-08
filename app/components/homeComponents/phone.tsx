/* eslint-disable @next/next/no-img-element */
import { Box, Typography } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
// Removed unused GoogleIcon import
import AppleIcon from '@mui/icons-material/Apple';

export default function Phone() {
  return (
    <Box
      sx={{
        width: 290,
        height: 580,
        borderRadius: '30px',
        padding: 1,
        backgroundColor: '#0C2239',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          backgroundColor: '#fff',
          borderRadius: '24px',
          overflow: 'hidden',
          padding: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          fontFamily: 'Montserrat, sans-serif',
          alignItems: 'center',
        }}
      >
        <Typography
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            color: 'background.paper',
            fontWeight: 500,
            paddingTop: 8,
            cursor: 'default',
          }}
        >
          <span>
            <i>Join</i> <strong>Nomad Estate</strong>
          </span>
          <span>
            <i> today</i>
          </span>
        </Typography>

        <Typography
          sx={{
            color: 'info.main',
            fontWeight: 'bold',
            position: 'relative',
            paddingTop: 5,
            fontSize: '20px',
            cursor: 'default',
          }}
        >
          Log in
        </Typography>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            paddingY: 1.5,
            paddingX: 2,
            borderRadius: 2,
            border: '1px solid',
            borderColor: '#e3e3e3ff',
            backgroundColor: '#fff',
            position: 'relative',
            boxShadow: 'inset 0 -2px 0px 0px #e3e3e3ff',
            width: '100%',
          }}
        >
          <EmailIcon color="action" />
          <Typography
            sx={{
              color: '#7B7B7B',
              fontWeight: 500,
              fontSize: '14px',
              cursor: 'default',
            }}
          >
            Email Completed
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            paddingY: 1.5,
            paddingX: 2,
            borderRadius: 2,
            border: '1px solid',
            borderColor: '#e3e3e3ff',
            backgroundColor: '#fff',
            position: 'relative',
            boxShadow: 'inset 0 -2px 0px 0px #e3e3e3ff',
            width: '100%',
          }}
        >
          <LockIcon color="action" />
          <Typography
            sx={{
              color: '#7B7B7B',
              fontWeight: 500,
              fontSize: '14px',
              cursor: 'default',
            }}
          >
            Password
          </Typography>
        </Box>
        <Box
          sx={{
            background: 'linear-gradient(to right, blue, #BC2DFF)',
            color: '#fff',
            fontWeight: 'bold',
            borderRadius: 2,
            paddingY: 1,
            textAlign: 'center',
            width: '50%',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            cursor: 'default',
          }}
        >
          Sign in
        </Box>

        <Typography
          sx={{
            color: 'grey.500',
            fontSize: '12px',
            fontStyle: 'italic',
            paddingTop: 1,
            justifyContent: 'center',
            textAlign: 'center',
            cursor: 'default',
          }}
        >
          {"Don't have an account?"}{' '}
          <Box component="span" sx={{ color: 'blue', fontWeight: 'bold' }}>
            Sign up
          </Box>
          <br />
          Connect with other apps
        </Typography>

        <Box sx={{ textAlign: 'center' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 2,
              position: 'relative',
              alignItems: 'center',
            }}
          >
            <img src="google-logo.webp" alt="Google" style={{ width: 32, height: 32 }} />
            <AppleIcon sx={{ color: '#c2c2c2ff', fontSize: 33 }} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
