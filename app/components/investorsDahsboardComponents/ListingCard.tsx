'use client';

import {
    Card,
    CardContent,
    Typography,
    Button,
    useTheme,
    Box,
} from '@mui/material';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

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
}: Props) {
    const theme = useTheme();
    const mainColor = colorScheme === 'primary' ? theme.palette.primary.main : theme.palette.secondary.main;

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
                            <FavoriteBorderOutlinedIcon sx={{ fontSize: 16, color: mainColor }} /> {likes} Likes
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            variant="contained"
                            fullWidth
                            color={colorScheme === 'primary' ? 'primary' : 'secondary'}
                        >
                            Edit
                        </Button>
                        <Button
                            variant="contained"
                            fullWidth
                            color={colorScheme === 'primary' ? 'primary' : 'secondary'}
                        >
                            Delete
                        </Button>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}
