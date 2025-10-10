
'use client';
import { Box, Button, Grid, InputBase, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
export default function Navbar() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 4,
        py: 2,
        backgroundColor: 'background.default',
        fontFamily: 'Montserrat, sans-serif',
        borderBottom: '1px solid',
        borderColor: '#e6e6e6ff',
        zIndex: 300,
      }}
    >

      <Grid container sx={{position: 'relative', alignItems: 'center'}}>
        <Grid size={{ xs: 4 }} textAlign={"left"}>
          <Typography
            sx={{ color: 'primary.main', fontWeight: "bold", fontSize: "16px", position: 'relative', alignItems:'center' }}
          >
            Nomad Estate
          </Typography>
        </Grid>
        <Grid size={{ xs: 8 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              border: '1px solid',
              borderColor: 'background.paper',
              borderRadius: 4,
              px: 4,
              py: 0.5,
              width: '25vw',
              height: '35px',

            }}
          >
            <SearchIcon sx={{ color: 'background.paper', mr: 1 }} />
            <InputBase
              placeholder="Search Properties"
              sx={{ width: '100%', fontFamily: 'Montserrat, sans-serif', fontSize: "16px" }}
            />
          </Box>
        </Grid>
      </Grid>
      {/* Right: Links & Buttons */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Typography
          sx={{
            color: 'primary.main',
            fontWeight: 500,
            cursor: 'pointer',
            alignSelf: 'center',
          }}
        >
          About Us
        </Typography>

        <Button
          variant="contained"
          startIcon={<CreditCardOutlinedIcon />}
          sx={{
            backgroundColor: 'primary.main',
            color: '#fff',
            fontFamily: 'Montserrat, sans-serif',
            textTransform: 'none',
            borderRadius: 3,
            '&:hover': {
              backgroundColor: '#cc0000',
            },
          }}
        >
          Plans
        </Button>

        <Button
          variant="outlined"
          sx={{
            borderColor: 'primary.main',
            color: 'primary.main',
            fontFamily: 'Montserrat, sans-serif',
            textTransform: 'none',
            borderRadius: 3,
            '&:hover': {
              backgroundColor: '#ffe5e5',
              borderColor: 'primary.main',
            },
          }}
        >
          Log in
        </Button>
      </Box>
    </Box >
  );
}