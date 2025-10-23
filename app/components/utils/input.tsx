import { ReactNode } from "react";
import { Box, Input } from "@mui/material";
import DoNotDisturbAltOutlinedIcon from '@mui/icons-material/DoNotDisturbAltOutlined';
import { grey } from "@mui/material/colors";

export const CustomInput = ({
    focusColor = '#000000',
    icon = <DoNotDisturbAltOutlinedIcon sx={{ color: grey[500] }} />,
    label = "",
    value = "",
    onChange = () => {},
    placeholder = "",
    type = "text",
    disabled = false,
    locked = false,
    endAdornment,
    onEndAdornmentClick,
}: {
    focusColor?: string;
    icon?: ReactNode;
    label?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    type?: string;
    disabled?: boolean;
    locked?: boolean;
    endAdornment?: ReactNode;
    onEndAdornmentClick?: () => void;
}) => {
    const isDisabled = disabled || locked;
    return (
        <Box
            sx= {{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                height: {xs: '36px', md: '48px'},
                bgcolor: isDisabled ? 'grey.200' : '#fff',
                mx: 0,
                borderRadius: {xs:'12px', md: '16px'},
                color: 'grey.200',
                boxShadow: `0 6px 0 ${grey[300]}`,
                px: {xs: 1, md: 2},
                py: {xs: 1, md: 2},
                ...(isDisabled ? {} : {
                    '&:focus-within': {
                        boxShadow: `0 6px 0 ${focusColor}`,
                    },
                }),
                cursor: isDisabled ? 'not-allowed' : 'text',
                opacity: isDisabled ? 0.95 : 1,
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', color: isDisabled ? grey[500] : focusColor }}>
                {icon}
            </Box>
            
            <Input
                disableUnderline
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                type={type}
                aria-label={label}
                disabled={isDisabled}
                sx={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: {xs: '14px', md: '18px'},
                    paddingLeft: 2,
                    flex: 1,
                    color: isDisabled ? 'text.disabled' : 'text.primary',
                }}
            />
            {endAdornment ? (
                <Box onClick={onEndAdornmentClick} sx={{ ml: 1, display: 'flex', alignItems: 'center', color: isDisabled ? grey[500] : focusColor, cursor: onEndAdornmentClick ? 'pointer' : 'default' }}>
                    {endAdornment}
                </Box>
            ) : null}
        </Box>
    )
}

export default CustomInput;