import React from "react";
import { Box, Card, Grid, Typography, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LanguageIcon from "@mui/icons-material/Language";

const images = [
    "https://images.unsplash.com/photo-1599423300746-b62533397364",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914"
];

export default function GlassPropertyGallery() {
    return (
        <Card
            sx={{
                width: "100%",
                height: "550px",
                maxWidth: 1000,
                padding: 3,
                borderRadius: 4,
                backdropFilter: "blur(20px)",
                background: "rgba(255, 255, 255, 0.1)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                border: "1px solid rgba(235, 235, 235, 0.48)",
            }}
        >

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginLeft: 20,
                    mb: 3,
                    height: 40,
                    borderRadius: "25px",
                    background: "rgba(255,255,255,0.15)",
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", paddingLeft: 6, }}>
                    <SearchIcon sx={{ color: "white", mr: 1 }} />
                    <Typography
                        variant="body1"
                        sx={{
                            color: "white",
                            fontWeight: 500,
                            letterSpacing: 0.3,
                        }}
                    >
                        Nomad Estate Properties
                    </Typography>
                </Box>
            </Box>

            {/* Image grid */}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: 2,
                    position: "relative",
                    ml: 15,
                }}
            >
                {images.map((src, i) => {
                    // compute row number
                    const row = Math.floor(i / 2); // 0,1,2...
                    const offset = row * 50;
                    const gap = 30;

                    return (
                        <Box
                            key={i}
                            component="img"
                            src={src}
                            alt={`property-${i}`}
                            sx={{
                                width: "90%",
                                height: 135,
                                objectFit: "cover",
                                borderRadius: 3,
                                boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                                transition: "transform 0.3s ease",
                                "&:hover": { transform: "scale(1.03)" },
                                ml: i % 2 === 0 ? `${offset}px` : `${offset - gap}px`, 
                            }}
                        />
                    );
                })}
            </Box>
        </Card>
    );
}
