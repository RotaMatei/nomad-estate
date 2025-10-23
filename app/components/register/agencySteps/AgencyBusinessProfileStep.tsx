import { Box, Typography } from '@mui/material';
import CustomInput from '@/app/components/utils/input';
import CustomTextArea from '@/app/components/utils/textarea';
import CheckboxGroup, { Option as CheckOption } from '@/app/components/utils/checkboxGroup';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';

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
}: Props) {
  const GAP = 2;
  return (
    <Box>
  <Typography sx={{ fontWeight: 700, mb: GAP, textAlign: 'left', color: 'grey.500', fontSize: { xs: '1.1rem', md: '1.2rem' } }}>Business Profile</Typography>

      <CheckboxGroup label="Primary Markets" options={marketOptions} values={primaryMarkets} onChange={setPrimaryMarkets} />

      <Box sx={{ display: 'flex', gap: GAP, mt: GAP }}>
        <Box sx={{ flex: 1 }}>
          <CustomInput
            label="Yearly Transactions"
            value={yearlyTransactions}
            onChange={(e) => setYearlyTransactions((e.target as HTMLInputElement).value.replace(/[^0-9]/g, ''))}
            placeholder="e.g. 120"
            icon={<TrendingUpOutlinedIcon />}
            focusColor="#e93b20"
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <CustomInput
            label="Average Property Value (USD)"
            value={averagePropertyValue}
            onChange={(e) => setAveragePropertyValue((e.target as HTMLInputElement).value.replace(/[^0-9.,]/g, ''))}
            placeholder="e.g. 350,000"
            icon={<MonetizationOnOutlinedIcon />}
            focusColor="#e93b20"
          />
        </Box>
      </Box>

      <Box sx={{ mt: GAP }}>
        <CustomTextArea
          label="Company Experience & Expertise"
          value={experienceExpertise}
          onChange={(e) => setExperienceExpertise((e.target as HTMLInputElement).value)}
          placeholder="Briefly describe your experience and areas of expertise"
          focusColor="#e93b20"
        />
      </Box>

      <Box sx={{ mt: GAP }}>
        <CustomTextArea
          label="Notable Projects"
          value={notableProjects}
          onChange={(e) => setNotableProjects((e.target as HTMLInputElement).value)}
          placeholder="Share a few standout projects"
          focusColor="#e93b20"
        />
      </Box>
    </Box>
  );
}
