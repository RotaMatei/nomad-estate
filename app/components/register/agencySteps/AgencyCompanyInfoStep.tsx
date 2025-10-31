import { Box, Typography } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import { useState, useMemo } from 'react';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import CustomInput from '@/app/components/utils/input';
import CustomAutocomplete from '@/app/components/utils/autocomplete';
import { useTheme } from '@mui/material/styles';

type Option = { value: string | number; label: string };

type Props = {
  companyName: string;
  setCompanyName: (v: string) => void;
  licenseNumber: string;
  setLicenseNumber: (v: string) => void;
  establishedYear: string;
  setEstablishedYear: (v: string) => void;
  companyType: string | number | '';
  setCompanyType: (v: string | number | '') => void;
  companyWebsite: string;
  setCompanyWebsite: (v: string) => void;
};

const companyTypeOptions: Option[] = [
  { value: 'brokerage', label: 'Brokerage' },
  { value: 'developer', label: 'Developer' },
  { value: 'property_mgmt', label: 'Property Management' },
  { value: 'investment', label: 'Investment Firm' },
  { value: 'other', label: 'Other' },
];

export default function AgencyCompanyInfoStep({
  companyName,
  setCompanyName,
  licenseNumber,
  setLicenseNumber,
  establishedYear,
  setEstablishedYear,
  companyType,
  setCompanyType,
  companyWebsite,
  setCompanyWebsite,
}: Props) {
  const GAP = 2;
  const theme = useTheme();
  const [nameFocused, setNameFocused] = useState(false);
  const [yearFocused, setYearFocused] = useState(false);
  const [siteFocused, setSiteFocused] = useState(false);
  const currentYear = new Date().getFullYear();
  const isValidCompanyName = (s: string) => /^[A-Za-z\u00C0-\u017F\s.]+$/.test(s);
  const isValidWebsite = (s: string) => /^https?:\/\/.+\..+/.test(s);
  const yearNum = parseInt(establishedYear || '0', 10);
  const isYearTooHigh = establishedYear.length === 4 && yearNum > currentYear;
  const isYearInvalid =
    establishedYear.length > 0 && (isNaN(yearNum) || establishedYear.length !== 4);
  const invalidName = companyName.length > 0 && !isValidCompanyName(companyName) && !nameFocused;
  const invalidYear =
    (isYearInvalid || isYearTooHigh) && !yearFocused && establishedYear.length > 0;
  const invalidSite = companyWebsite.length > 0 && !isValidWebsite(companyWebsite) && !siteFocused;
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
        Company Information
      </Typography>

      <CustomInput
        label="Company Name"
        value={companyName}
        onChange={(e) => setCompanyName((e.target as HTMLInputElement).value)}
        onFocus={() => setNameFocused(true)}
        onBlur={() => setNameFocused(false)}
        placeholder="Company Name"
        icon={<BusinessCenterOutlinedIcon />}
        focusColor={theme.palette.primary.main}
        invalid={invalidName}
      />
      <Collapse
        in={nameFocused && companyName.length > 0 && !isValidCompanyName(companyName)}
        timeout={200}
        unmountOnExit
      >
        <Typography variant="caption" sx={{ color: 'error.main', pl: 1, mt: 0.5 }}>
          Company name can contain letters, spaces and dots only.
        </Typography>
      </Collapse>

      <Box sx={{ mt: GAP }}>
        <CustomInput
          label="License Number"
          value={licenseNumber}
          onChange={(e) => setLicenseNumber((e.target as HTMLInputElement).value)}
          placeholder="License Number"
          icon={<BadgeOutlinedIcon />}
          focusColor={theme.palette.primary.main}
        />
      </Box>

      <Box sx={{ display: 'flex', gap: GAP, mt: GAP, flexDirection: { xs: 'column', md: 'row' } }}>
        <Box sx={{ flex: 1 }}>
          <CustomInput
            label="Established Year"
            value={establishedYear}
            onChange={(e) =>
              setEstablishedYear(
                (e.target as HTMLInputElement).value.replace(/[^0-9]/g, '').slice(0, 4),
              )
            }
            onFocus={() => setYearFocused(true)}
            onBlur={() => setYearFocused(false)}
            placeholder="Year Of Establishment"
            icon={<CalendarMonthOutlinedIcon />}
            focusColor={theme.palette.primary.main}
            invalid={invalidYear}
          />
          <Collapse in={yearFocused && isYearInvalid} timeout={200} unmountOnExit>
            <Typography variant="caption" sx={{ color: 'error.main', pl: 1, mt: 0.5 }}>
              Enter a 4-digit year.
            </Typography>
          </Collapse>
          <Collapse in={yearFocused && !isYearInvalid && isYearTooHigh} timeout={200} unmountOnExit>
            <Typography variant="caption" sx={{ color: 'error.main', pl: 1, mt: 0.5 }}>
              Year cannot be in the future.
            </Typography>
          </Collapse>
        </Box>
        <Box sx={{ flex: 1 }}>
          <CustomAutocomplete
            options={companyTypeOptions}
            value={companyType}
            onChange={(v) => setCompanyType(v)}
            label="Company Type"
            icon={<PublicOutlinedIcon />}
            focusColor={theme.palette.primary.main}
          />
        </Box>
      </Box>

      <Box sx={{ mt: GAP }}>
        <CustomInput
          label="Company Website"
          value={companyWebsite}
          onChange={(e) => setCompanyWebsite((e.target as HTMLInputElement).value)}
          onFocus={() => setSiteFocused(true)}
          onBlur={() => setSiteFocused(false)}
          placeholder="Official Website (https://example.com)"
          icon={<LanguageOutlinedIcon />}
          focusColor={theme.palette.primary.main}
          invalid={invalidSite}
        />
        <Collapse
          in={siteFocused && companyWebsite.length > 0 && !isValidWebsite(companyWebsite)}
          timeout={200}
          unmountOnExit
        >
          <Typography variant="caption" sx={{ color: 'error.main', pl: 1, mt: 0.5 }}>
            Must start with http:// or https:// and contain a dot.
          </Typography>
        </Collapse>
      </Box>
    </Box>
  );
}
