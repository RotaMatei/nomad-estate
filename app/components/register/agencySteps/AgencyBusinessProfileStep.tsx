import { Box, Typography, Menu, MenuItem } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import CustomInput from '@/app/components/utils/input';
import CustomTextArea from '@/app/components/utils/textarea';
import CheckboxGroup, { Option as CheckOption } from '@/app/components/utils/checkboxGroup';
import EuroOutlinedIcon from '@mui/icons-material/EuroOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import CurrencyPoundOutlinedIcon from '@mui/icons-material/CurrencyPoundOutlined';
import CurrencyYenOutlinedIcon from '@mui/icons-material/CurrencyYenOutlined';
import CurrencyFrancOutlinedIcon from '@mui/icons-material/CurrencyFrancOutlined';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import { useState } from 'react';

type CurrencyCode = 'EUR' | 'USD' | 'GBP' | 'JPY' | 'CHF';

type Props = {
  primaryMarkets: string[];
  setPrimaryMarkets: (v: string[]) => void;
  yearlyTransactions: string;
  setYearlyTransactions: (v: string) => void;
  averagePropertyValue: string;
  setAveragePropertyValue: (v: string) => void;
  experienceExpertise: string;
  setExperienceExpertise: (v: string) => void;
  notableProjects: string;
  setNotableProjects: (v: string) => void;
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
};

const marketOptions: CheckOption[] = [
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'luxury', label: 'Luxury' },
  { value: 'land', label: 'Land Development' },
];

export default function AgencyBusinessProfileStep({
  primaryMarkets,
  setPrimaryMarkets,
  yearlyTransactions,
  setYearlyTransactions,
  averagePropertyValue,
  setAveragePropertyValue,
  experienceExpertise,
  setExperienceExpertise,
  notableProjects,
  setNotableProjects,
  currency,
  setCurrency,
}: Props) {
  const GAP = 2;
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const currencyIcon = (code: typeof currency) => {
    switch (code) {
      case 'USD':
        return <AttachMoneyOutlinedIcon />;
      case 'GBP':
        return <CurrencyPoundOutlinedIcon />;
      case 'JPY':
        return <CurrencyYenOutlinedIcon />;
      case 'CHF':
        return <CurrencyFrancOutlinedIcon />;
      case 'EUR':
      default:
        return <EuroOutlinedIcon />;
    }
  };
  const handleCurrencyClick = (e?: React.MouseEvent<HTMLElement>) =>
    setAnchorEl((e?.currentTarget as HTMLElement) || null);
  const handleCurrencySelect = (code: typeof currency) => {
    setCurrency(code);
    setAnchorEl(null);
  };
  return (
    <Box>
      <Typography
        sx={{
          fontWeight: 700,
          mb: GAP,
          textAlign: 'left',
          color: 'grey.500',
          fontSize: { xs: '1.1rem', md: '1.2rem' },
        }}
      >
        Business Profile
      </Typography>
      <Typography
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          fontWeight: 700,
          mt: 1,
          mb: 1,
          textAlign: 'left',
          color: 'grey.500',
          fontSize: { xs: '16px', md: '18px', lg: '20px' },
        }}
      >
        <MonetizationOnOutlinedIcon sx={{ color: theme.palette.primary.main }} /> Primary Markets
      </Typography>
      <CheckboxGroup
        options={marketOptions}
        values={primaryMarkets}
        onChange={setPrimaryMarkets}
        focusColor={theme.palette.primary.main}
      />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: GAP, mt: GAP }}>
        <Box sx={{ flex: 1 }}>
          <CustomInput
            label="Yearly Transactions"
            value={yearlyTransactions}
            onChange={(e) =>
              setYearlyTransactions((e.target as HTMLInputElement).value.replace(/[^0-9]/g, ''))
            }
            placeholder="Yearly Transactions"
            icon={<TrendingUpOutlinedIcon />}
            focusColor={theme.palette.primary.main}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <CustomInput
            label="Average Property Value"
            value={averagePropertyValue}
            onChange={(e) =>
              setAveragePropertyValue((e.target as HTMLInputElement).value.replace(/[^0-9.,]/g, ''))
            }
            placeholder="Average Property Value"
            icon={<TrendingUpOutlinedIcon />}
            endAdornment={
              <Box
                sx={{ display: 'flex', alignItems: 'center', color: theme.palette.primary.main }}
              >
                {currencyIcon(currency)}
                <ArrowDropDownIcon />
              </Box>
            }
            onEndAdornmentClick={handleCurrencyClick}
            focusColor={theme.palette.primary.main}
          />
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={() => setAnchorEl(null)}
            PaperProps={{
              sx: {
                bgcolor: theme.palette.common.white,
                borderRadius: 2,
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              },
            }}
            MenuListProps={{
              sx: {
                p: 0,
                bgcolor: theme.palette.common.white,
              },
            }}
          >
            {(
              [
                { code: 'EUR', label: 'EUR', Icon: EuroOutlinedIcon },
                { code: 'USD', label: 'USD', Icon: AttachMoneyOutlinedIcon },
                { code: 'GBP', label: 'GBP', Icon: CurrencyPoundOutlinedIcon },
                { code: 'JPY', label: 'JPY', Icon: CurrencyYenOutlinedIcon },
                { code: 'CHF', label: 'CHF', Icon: CurrencyFrancOutlinedIcon },
              ] as const
            ).map(({ code, label, Icon }) => (
              <MenuItem
                key={code}
                onClick={() => handleCurrencySelect(code)}
                selected={currency === code}
                sx={{
                  bgcolor: theme.palette.background.default,
                  '&.Mui-selected': {
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                  },
                  '&.Mui-selected:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.16),
                  },
                  '&:hover': {
                    bgcolor: alpha(theme.palette.background.default, 0.9),
                  },
                }}
              >
                <Icon
                  sx={{ mr: 1, color: currency === code ? theme.palette.primary.main : grey[500] }}
                />
                {label}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Box>

      <Box sx={{ mt: GAP }}>
        <CustomTextArea
          label="Company Experience & Expertise"
          value={experienceExpertise}
          onChange={(e) => setExperienceExpertise((e.target as HTMLInputElement).value)}
          placeholder="Briefly describe your experience and areas of expertise"
          icon={<WorkOutlineOutlinedIcon sx={{ color: theme.palette.primary.main }} />}
          focusColor={theme.palette.primary.main}
        />
      </Box>

      <Box sx={{ mt: GAP }}>
        <CustomTextArea
          label="Notable Projects"
          value={notableProjects}
          onChange={(e) => setNotableProjects((e.target as HTMLInputElement).value)}
          placeholder="Share a few standout projects"
          icon={<EmojiEventsOutlinedIcon sx={{ color: theme.palette.primary.main }} />}
          focusColor={theme.palette.primary.main}
        />
      </Box>
    </Box>
  );
}
