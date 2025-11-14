'use client';

import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Button,
    useTheme,
    Box,
} from '@mui/material';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { useRouter } from 'next/navigation';

interface Props {
    id?: string;
    title: string;
    location: string;
    price: string;
    likes: number;
    saves: number;
    colorScheme?: 'primary' | 'secondary';
    isAddCard?: boolean;
    imageUrl?: string;
    onAddClick?: () => void;
    onEdit?: (id: string) => void;
    onDelete?: (id?: string) => void;
}

export default function ListingCard({
    id,
    title,
    location,
    price,
    likes,
    saves,
    colorScheme = 'secondary',
    isAddCard = false,
    imageUrl,
    onAddClick,
    onEdit,
    onDelete,
}: Props) {
    const theme = useTheme();
    const router = useRouter();
    const mainColor = colorScheme === 'primary' ? theme.palette.primary.main : theme.palette.secondary.main;

    const handleEditClick = () => {
        if (!id) return;
        if (onEdit) {
            onEdit(id);
            return;
        }
        // Fallback: navigate to dashboard with edit query to open edit form
        try {
            router.push(`/investorsDashboard?edit=${encodeURIComponent(id)}`);
        } catch {}
    };

    if (isAddCard) {
        return (
            <Card
                elevation={4}
                sx={{
                    borderRadius: 4,
                    backgroundColor: theme.palette.background.default,
                    boxShadow: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 420,
                    cursor: 'pointer',
                    border:'1px solid',
                    borderColor: '#c2c2c265',
                }}
                onClick={onAddClick}
            >
                <CardContent sx={{ textAlign: 'center' }}>
                    <AddOutlinedIcon sx={{ fontSize: 40, color: mainColor, mb: 2 }} />
                    <Typography variant="subtitle1" sx={{ color: mainColor, fontWeight: 500 }}>
                        Add New Listing
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card elevation={4} sx={{ borderRadius: 4, backgroundColor: theme.palette.background.default, boxShadow: 'none', justifyContent: 'center', height: 420, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ backgroundImage: `url(${imageUrl || '/dubai4.jpg'})`, backgroundSize: 'cover', backgroundPosition: 'center', height: 200, borderRadius: '4px 4px 0 0' }} />
            <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box>
                    <Typography variant="subtitle1" sx={{ color: 'text.info', fontWeight: 600 }}>{title}</Typography>
                    <Typography variant="body2">Location: {location}</Typography>
                    <Typography variant="body2" sx={{color:'success.main'}}>Price: {price}</Typography>
                </Box>
                <Box>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <FavoriteBorderOutlinedIcon sx={{ fontSize: 16, color: mainColor }} /> {saves} Saves
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            variant="contained"
                            fullWidth
                            color={colorScheme === 'primary' ? 'primary' : 'secondary'}
                            onClick={handleEditClick}
                            disabled={!id}
                            title={!id ? 'Editing not available here' : 'Edit this property'}
                        >
                            Edit
                        </Button>
                        <Button
                            variant="contained"
                            fullWidth
                            color={colorScheme === 'primary' ? 'primary' : 'secondary'}
                            onClick={() => onDelete?.(id)}
                            disabled={!id || !onDelete}
                            title={!id || !onDelete ? 'Deleting not available here' : 'Delete this property'}
                        >
                            Delete
                        </Button>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}
