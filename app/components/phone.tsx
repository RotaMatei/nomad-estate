import { Box, Typography, TextField } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import GoogleIcon from '@mui/icons-material/Google';
import AppleIcon from '@mui/icons-material/Apple';

export default function Phone() {
    return (
        <Box
            sx={{
                width: 290,
                height: 580,
                borderRadius: '36px',
                padding: 1,
                backgroundColor: '#000',
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
                    alignItems: 'center'
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
                    sx={{ color: 'info.main', fontWeight: 'bold', position: 'relative', paddingTop: 5, fontSize: '20px' }}
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
                        boxShadow: 'inset 0 -2px 0px 0px',
                        boxShadowColor: 'transparent',
                        width: '15vw'
                    }}
                >
                    <EmailIcon color='action' />
                    <Typography
                        sx={{
                            color: '#7B7B7B',
                            fontWeight: 500,
                            fontSize: '14px',
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
                        boxShadow: 'inset 0 -2px 0px 0px',
                        boxShadowColor: 'transparent',
                        width: '15vw'
                    }}
                >
                    <LockIcon color='action' />
                    <Typography
                        sx={{
                            color: '#7B7B7B',
                            fontWeight: 500,
                            fontSize: '14px',
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
                        cursor: 'pointer',
                        width: '5vw',
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    Sign in
                </Box>

                <Typography sx={{ color: 'grey.500', fontSize: '12px', fontStyle: 'italic', paddingTop: 1, justifyContent: 'center', textAlign: 'center' }}>
                    Don't have an account?{' '}
                    <Box component="span" sx={{ color: 'blue', fontWeight: 'bold' }}>
                        Sign up
                    </Box>
                    <br/>
                    Connect with other apps
                </Typography>

                <Box sx={{ textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, position:'relative', alignItems:'center' }}>
                        <img src="google-logo.webp" alt="Google" style={{ width: 32, height: 32 }} />
                        <AppleIcon sx={{ color: '#c2c2c2ff', fontSize: 33 }} />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}