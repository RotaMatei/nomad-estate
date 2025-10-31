import React from 'react';
import { Box, Grid, Typography, Paper } from '@mui/material';
import FadeContent from '../../reactDevBits/FadeContent/FadeContent';
import AnimatedContent from '@/app/reactDevBits/AnimatedContent/AnimatedContent';

const WhyChooseNomad = () => {
    const features = [
        {
            title: 'First-Mover Advantage',
            description:
                'No existing competitor offers a global, data-driven investment-first experience.',
        },
        {
            title: 'Market Demand',
            description:
                'Matches growing demand for intelligent, decision-making tools in real estate.',
        },
        {
            title: 'Scalable Platform',
            description:
                'Easily expandable into financing, legal services, and wealth management.',
        },
        {
            title: 'Global Opportunity',
            description:
                'Golden visas & digital residency programs expanding worldwide.',
        },
    ];

    return (
        <Box sx={{ position: 'relative', alignItems: 'center', display: 'flex', justifyContent: 'center', backgroundColor: '#fff' }}>
            <Box
                sx={{
                    backgroundColor: 'primary.main',
                    padding: { xs: '80px 24px', md: '100px 80px' },
                    color: '#fff',
                    fontFamily: 'Montserrat, sans-serif',
                    width: { xs: '100%', md: '96vw' },
                    borderRadius: '15px',

                }}
            >
                <Typography
                    //variant="h4"
                    fontWeight="700"
                    textAlign="center"
                    gutterBottom
                    sx={{ marginBottom: '16px', fontSize: { xs: '25px', md: '35px' } }}
                >
                    Why choose Nomad Estate?
                </Typography>

                <Typography
                    variant="subtitle1"
                    textAlign="center"
                    sx={{ marginBottom: '48px', opacity: 0.9 }}
                >
                    Four key factors that guarantee our market dominance.
                </Typography>

                <Grid container spacing={4} justifyContent="center" alignItems="center">
                    {features.map((feature, index) => (

                        <Grid size={{ xs: 12, md: 5 }} key={index}>
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
                                <Paper
                                    elevation={3}
                                    sx={{
                                        backgroundColor: '#fff',
                                        padding: '32px',
                                        borderRadius: '16px',
                                        textAlign: 'left',

                                    }}
                                >
                                    <Typography variant="h6" fontWeight="700" color="error.main" gutterBottom>
                                        {feature.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {feature.description}
                                    </Typography>
                                </Paper>
                            </AnimatedContent>
                        </Grid>

                    ))}
                </Grid>

            </Box>
        </Box>
    );
};

export default WhyChooseNomad;