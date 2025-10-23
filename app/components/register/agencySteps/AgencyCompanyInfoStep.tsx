import { Box, Typography } from '@mui/material';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import CustomInput from '@/app/components/utils/input';
import CustomAutocomplete from '@/app/components/utils/autocomplete';

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
  return (
    <Box>
  <Typography sx={{ fontWeight: 700, mb: GAP, textAlign: 'left', color: 'grey.500', fontSize: { xs: '1.1rem', md: '1.2rem' } }}>Company Information</Typography>

      <CustomInput
        label="Company Name"
        value={companyName}
        onChange={(e) => setCompanyName((e.target as HTMLInputElement).value)}
        placeholder="Company Name"
        icon={<BusinessCenterOutlinedIcon />}
        focusColor="#e93b20"
      />

      <Box sx={{ mt: GAP }}>
        <CustomInput
          label="License Number"
          value={licenseNumber}
          onChange={(e) => setLicenseNumber((e.target as HTMLInputElement).value)}
          placeholder="License Number"
          icon={<BadgeOutlinedIcon />}
          focusColor="#e93b20"
        />
      </Box>

      <Box sx={{ display: 'flex', gap: GAP, mt: GAP }}>
        <Box sx={{ flex: 1 }}>
          <CustomInput
            label="Established Year"
            value={establishedYear}
            onChange={(e) => setEstablishedYear((e.target as HTMLInputElement).value.replace(/[^0-9]/g, '').slice(0, 4))}
            placeholder="e.g. 2012"
            icon={<CalendarMonthOutlinedIcon />}
            focusColor="#e93b20"
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <CustomAutocomplete
            options={companyTypeOptions}
            value={companyType}
            onChange={(v) => setCompanyType(v)}
            label="Company Type"
            icon={<PublicOutlinedIcon />}
            focusColor="#e93b20"
          />
        </Box>
      </Box>

      <Box sx={{ mt: GAP }}>
        <CustomInput
          label="Company Website"
          value={companyWebsite}
          onChange={(e) => setCompanyWebsite((e.target as HTMLInputElement).value)}
          placeholder="https://example.com"
          icon={<LanguageOutlinedIcon />}
          focusColor="#e93b20"
        />
      </Box>
    </Box>
  );
}
