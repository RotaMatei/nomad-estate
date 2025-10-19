import React, { useRef, useEffect, useState } from 'react';
import { Grid, Typography, Box, keyframes } from '@mui/material';

const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;
type StatBlockProps = {
  value: string | number;
  description: string;
  source?: string;
  delay?: number;
};
const StatBlock = ({ value, description, source, delay }: StatBlockProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setVisible(true);
            },
            { threshold: 0.3 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <Grid
            size={{
                xs: 12,
                sm: 4
            }}
            ref={ref}
            sx={{
                opacity: 0,
                animation: visible ? `${fadeUp} 1s ease ${delay}s forwards` : 'none',
            }}
        >
            <Typography
                variant="h3"
                fontWeight="800"
                sx={{ color: 'primary.main', textAlign: 'center', fontSize: { xs: '24px', md: '48px' } }}
            >
                {value}
            </Typography>
            <Typography
                variant="body1"
                sx={{ textAlign: 'center', fontWeight: 500, fontSize: { xs: '14px', md: '16px' } }}
            >
                {description}
            </Typography>
            <Typography
                variant="caption"
                sx={{
                    display: 'block',
                    textAlign: 'center',
                    marginTop: '8px',
                    color: 'grey.200',
                }}
            >
                {source}
            </Typography>
        </Grid>
    );
};

const InvestmentStats = () => {
    const stats = [
        {
            value: '$68T',
            description: 'Massive intergenerational wealth transfer happening now.',
            source: 'Industry Analysis',
        },
        {
            value: '$398B',
            description: 'Cross-Border Real Estate Investment (2023).',
            source: 'JLL Global Research',
        },
        {
            value: '72%',
            description: 'Of investors feel under-informed when investing abroad.',
            source: 'EY Global Wealth Report',
        },
    ];

    return (
        <Box
            sx={{
                backgroundColor: 'background.default',
                padding: { xs: '100px 20px', md: '200px 120px 120px' },
                color: 'text.secondary',
                fontFamily: 'Montserrat, sans-serif',
            }}
        >
            <Grid container spacing={4} justifyContent="center">
                {stats.map((stat, index) => {
                    
                    const delay = index === 1 ? 0 : 0.3;
                    return <StatBlock key={index} {...stat} delay={delay} />;
                })}

            </Grid>
        </Box>
    );
};

export default InvestmentStats;