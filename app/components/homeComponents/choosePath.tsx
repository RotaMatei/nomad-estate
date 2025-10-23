import React from 'react';
import {
    Box,
    Grid,
    Typography,
    Button,
    Container,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import Groups3OutlinedIcon from '@mui/icons-material/Groups3Outlined';
import GradientText from '../../GradientText/GradientText';
import AnimatedContent from '../../reactDevBits/AnimatedContent/AnimatedContent';

const investorFeatures = [
    'Browse global investment opportunities',
    'Advanced filtering and market insights',
    'Golden Visa & citizenship programs',
    'Portfolio tracking and analytics',
];

const agencyFeatures = [
    'List properties for global investors',
    'Access international client network',
    'Verified listing platform',
    'Lead management tools',
];

export default function ChoosePath() {
    return (
        <Box
            sx={{
                backgroundColor: '#fff',
                py: 8,
                px: 2,
                textAlign: 'center',
                //pt: 3,
                pb: 20,
            }}
        >
            <Container maxWidth="md">
                <Box sx={{ borderTop: '1px solid #e0e0e0', pb: 12 }} />
            </Container>


            {/* <Typography
                variant="h4"
                fontWeight={700}
                sx={{
                    background: 'linear-gradient(to right, #00089D , #BC2DFF, #E80000 )',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1,
                }}
            >
                Choose your path
            </Typography> */}

            <GradientText
                colors={["#e80000ff", "#BC2DFF", "#121de6ff", "#BC2DFF", "#E80000"]}
                animationSpeed={5}
                showBorder={false}
                className="custom-class"
            >
                Choose your path
            </GradientText>

            <Typography variant="body1" color="text.secondary" mb={6}>
                Get started with personalized features designed for your specific needs
            </Typography>

            <Grid
                container
                spacing={4}
                justifyContent="center"
                alignItems="stretch"
                sx={{ maxWidth: 1200, mx: 'auto' }}
            >
                {/* Investor Panel */}
                <Grid size={{ xs: 12, md: 5 }} sx={{ justifyContent: 'center', alignItems: 'center' }}>
                    <AnimatedContent
                        distance={100}
                        direction="vertical"
                        reverse={false}
                        duration={1.1}
                        //ease="bounce.out"
                        initialOpacity={0.2}
                        animateOpacity
                        scale={1.0}
                        threshold={0.1}
                        delay={0}
                    >
                        <div>
                            <Box
                                sx={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #e0e0e050',
                                    borderRadius: 4,
                                    p: 4,
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    boxShadow: '0 2px 8px rgba(145, 145, 145, 0.1)',
                                    transition: 'transform 0.3s ease',
                                    '&:hover': { transform: 'scale(1.03)' },
                                }}
                            >
                                <Box>
                                    {/* Centered Icon */}
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4, mt: 5 }}>
                                        <TrendingUpOutlinedIcon sx={{ fontSize: 50, color: 'blue' }} />
                                    </Box>

                                    <Typography variant="h6" fontWeight={700} color='text.secondary' display='flex' justifyContent='left'>
                                        {"I'm an Investor"}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" mb={3} display='flex' justifyContent='left'>
                                        Individual Investors
                                    </Typography>
                                    {/* Feature List with Check Icons */}
                                    <Grid
                                        container
                                        direction="column"
                                        alignItems="flex-start"
                                        sx={{
                                            width: '100%',
                                            textAlign: 'left', // ensures text doesn't center
                                        }}
                                    >
                                        {investorFeatures.map((feature, index) => (
                                            <Grid key={index} sx={{ width: '100%' }}>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'flex-start',
                                                        width: '100%',
                                                        flexWrap: 'nowrap',
                                                        mb: 1,
                                                    }}
                                                >
                                                    <TaskAltOutlinedIcon
                                                        sx={{
                                                            fontSize: 18,
                                                            color: 'info.main',
                                                            mr: 1,
                                                            flexShrink: 0,
                                                        }}
                                                    />
                                                    <Typography
                                                        variant="body2"
                                                        color="grey.700"
                                                        sx={{
                                                            fontFamily: 'Montserrat, sans-serif',
                                                            wordBreak: 'break-word',
                                                            flexGrow: 1,
                                                            textAlign: 'left', // override any inherited centering
                                                        }}
                                                    >
                                                        {feature}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        ))}
                                    </Grid>

                                </Box>

                                <Button
                                    variant="contained"
                                    endIcon={<ArrowForwardIcon />}
                                    sx={{ mt: 5, textTransform: 'none', background: 'linear-gradient(to right, #00089D , #BC2DFF)', height: 45, mb: 5 }}
                                >
                                    Start Investing
                                </Button>
                            </Box>

                        </div>
                    </AnimatedContent>
                </Grid>

                {/* Agency Panel */}
                <Grid size={{ xs: 12, md: 5 }} sx={{ justifyContent: 'center', alignItems: 'center' }}>
                    <AnimatedContent
                        distance={100}
                        direction="vertical"
                        reverse={false}
                        duration={1.1}
                        //ease="bounce.out"
                        initialOpacity={0.2}
                        animateOpacity
                        scale={1.0}
                        threshold={0.1}
                        delay={0}
                    >
                        <div>
                            <Box
                                sx={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #e0e0e050',
                                    borderRadius: 4,
                                    p: 4,
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    boxShadow: '0 2px 8px rgba(145, 145, 145, 0.1)',
                                    transition: 'transform 0.3s ease',
                                    '&:hover': { transform: 'scale(1.03)' },
                                }}
                            >
                                <Box>
                                    {/* Centered Icon */}
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4, mt: 5 }}>
                                        <BusinessOutlinedIcon sx={{ fontSize: 50, color: '#E80000' }} />
                                    </Box>

                                    <Typography variant="h6" fontWeight={700} color='text.secondary' display='flex' justifyContent='left'>
                                        {"I'm an Agency"}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" mb={3} display='flex' justifyContent='left'>
                                        Real Estate Professionals
                                    </Typography>
                                    {/* Feature List with Check Icons */}
                                    <Grid
                                        container
                                        direction="column"
                                        alignItems="flex-start"
                                        sx={{
                                            width: '100%',
                                            textAlign: 'left',
                                        }}
                                    >
                                        {agencyFeatures.map((feature, index) => (
                                            <Grid key={index} sx={{ width: '100%' }}>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'flex-start',
                                                        width: '100%',
                                                        flexWrap: 'nowrap',
                                                        mb: 1,
                                                    }}
                                                >
                                                    <TaskAltOutlinedIcon
                                                        sx={{
                                                            fontSize: 18,
                                                            color: 'info.main',
                                                            mr: 1,
                                                            flexShrink: 0,
                                                        }}
                                                    />
                                                    <Typography
                                                        variant="body2"
                                                        color="grey.700"
                                                        sx={{
                                                            fontFamily: 'Montserrat, sans-serif',
                                                            wordBreak: 'break-word',
                                                            flexGrow: 1,
                                                            textAlign: 'left',
                                                        }}
                                                    >
                                                        {feature}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>

                                <Button
                                    variant="contained"
                                    endIcon={<Groups3OutlinedIcon />}
                                    sx={{ mt: 5, textTransform: 'none', height: 45, mb: 5, borderColor: 'info.main', backgroundImage: 'linear-gradient(to right, #BC2DFF, #E80000)', color: '#fff' }}
                                >
                                    Join as Partner
                                </Button>
                            </Box>

                        </div>
                    </AnimatedContent>
                </Grid>
            </Grid>
        </Box>
    );
}