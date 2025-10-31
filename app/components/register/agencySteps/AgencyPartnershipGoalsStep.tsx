import { Box, Typography } from '@mui/material';
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import CustomTextArea from '@/app/components/utils/textarea';
import ChipSelect, { Option as ChipOption } from '@/app/components/utils/chipSelect';
import CheckboxGroup, { Option as CheckOption } from '@/app/components/utils/checkboxGroup';
import { useTheme } from '@mui/material/styles';

type Props = {
  partnershipReason: string;
  setPartnershipReason: (v: string) => void;
  regionPreferences: string[];
  setRegionPreferences: (v: string[]) => void;
  targetClients: string[];
  setTargetClients: (v: string[]) => void;
  servicesProvided: string[];
  setServicesProvided: (v: string[]) => void;
  additionalInterests: string[];
  setAdditionalInterests: (v: string[]) => void;
};

const regionOptions: ChipOption[] = [
  { value: 'local', label: 'Local' },
  { value: 'regional', label: 'Regional' },
  { value: 'national', label: 'National' },
  { value: 'international', label: 'International' },
];

const targetOptions: ChipOption[] = [
  { value: 'buyers', label: 'Buyers' },
  { value: 'sellers', label: 'Sellers' },
  { value: 'investors', label: 'Investors' },
  { value: 'renters', label: 'Renters' },
  { value: 'developers', label: 'Developers' },
];

const servicesOptions: CheckOption[] = [
  { value: 'valuation', label: 'Property Valuation' },
  { value: 'legal', label: 'Legal Assistance' },
  { value: 'management', label: 'Property Management' },
  { value: 'market_analysis', label: 'Market Analysis' },
  { value: 'mortgage', label: 'Mortgage Assistance' },
  { value: 'renovation', label: 'Renovation Experts' },
  { value: 'staging', label: 'Home Staging' },
  { value: 'exclusive', label: 'Exclusive Property Deals' },
];

const additionalOptions: CheckOption[] = [
  { value: 'networking', label: 'Networking/Promotional Support' },
  { value: 'exclusive_deals', label: 'Exclusive Property Deals' },
];

export default function AgencyPartnershipGoalsStep({
  partnershipReason,
  setPartnershipReason,
  regionPreferences,
  setRegionPreferences,
  targetClients,
  setTargetClients,
  servicesProvided,
  setServicesProvided,
  additionalInterests,
  setAdditionalInterests,
}: Props) {
  const GAP = 1; // compact spacing to fit 100vh
  const theme = useTheme();
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography
        sx={{
          fontWeight: 700,
          mb: GAP,
          textAlign: 'left',
          color: 'grey.500',
          fontSize: { xs: '1.05rem', md: '1.15rem' },
        }}
      >
        Partnership Goals
      </Typography>

      <CustomTextArea
        label="Why do you want to partner with Nomad Estate?"
        value={partnershipReason}
        onChange={(e) => setPartnershipReason((e.target as HTMLInputElement).value)}
        placeholder="Tell us about your goals and what you want to achieve"
        icon={<HandshakeOutlinedIcon sx={{ color: theme.palette.primary.main }} />}
        focusColor={theme.palette.primary.main}
        minRows={2}
        maxRows={4}
      />

      {/* Keep chips side-by-side on desktop for compactness */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: { xs: GAP, md: GAP * 1.5 },
          mt: GAP,
        }}
      >
        <ChipSelect
          label="Regional Network Listings"
          options={regionOptions}
          values={regionPreferences}
          onChange={setRegionPreferences}
        />
        <ChipSelect
          label="Target Client Type"
          options={targetOptions}
          values={targetClients}
          onChange={setTargetClients}
        />
      </Box>

      {/* Make the two checkbox groups full-width stacked rows */}
      <Box sx={{ mt: GAP }}>
        <CheckboxGroup
          label="Services You Provide"
          options={servicesOptions}
          values={servicesProvided}
          onChange={setServicesProvided}
          focusColor={theme.palette.primary.main}
        />
      </Box>
      <Box sx={{ mt: GAP }}>
        <CheckboxGroup
          label="Additional Partnership Interests"
          options={additionalOptions}
          values={additionalInterests}
          onChange={setAdditionalInterests}
          focusColor={theme.palette.primary.main}
        />
      </Box>
    </Box>
  );
}
