import { PropertyTypeEnum, StatusEnum } from './Enums';
import { useTheme } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import { Box, Typography } from '@mui/material';
import CustomInput from '../../components/utils/input';
import CustomTextArea from '../../components/utils/textarea';
import CustomSelect from '../../components/utils/select';
import { PropertyFormData } from './types';

interface DetailsProps {
  formData: PropertyFormData;
  setFormData: React.Dispatch<React.SetStateAction<PropertyFormData>>;
}

export default function DetailsSection({ formData, setFormData }: DetailsProps) {
  const theme = useTheme();
  const focusColor = theme.palette.primary.main;
  const bgColor = theme.palette.background.default;
  const textColor = grey[700];

  const numberFloat = (v: string) => (v === '' ? undefined : parseFloat(v));
  const numberInt = (v: string) => (v === '' ? undefined : parseInt(v, 10));

  const enumOptions = (values: readonly string[]) => values.map(v => ({ value: v, label: v }));

  return (
    <Box component="fieldset" sx={{ display: 'flex', flexDirection: 'column', gap: 3, my: '1px' }}>
      <Typography component="legend" variant="h6" sx={{ fontWeight: 600 }}>Details</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[700]}>Agency identifier linked to your organization</Typography>
        <CustomInput
          placeholder="Agency ID"
          value={formData.agencyId || ''}
          onChange={(e) => setFormData({ ...formData, agencyId: e.target.value })}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[700]}>Agent identifier managing this listing</Typography>
        <CustomInput
          placeholder="Agent ID"
          value={formData.agentId || ''}
          onChange={(e) => setFormData({ ...formData, agentId: e.target.value })}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[700]}>Listing title shown publicly</Typography>
        <CustomInput
          placeholder="Title"
          value={formData.title || ''}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[700]}>Detailed description to highlight key features</Typography>
        <CustomTextArea
          placeholder="Description"
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
          minRows={3}
          maxRows={6}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[700]}>Property type classification</Typography>
        <CustomSelect
          label="Type"
          value={formData.type || ''}
          onChange={(value) => setFormData({ ...formData, type: String(value) })}
          options={enumOptions(Object.values(PropertyTypeEnum))}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[700]}>Availability status for buyers</Typography>
        <CustomSelect
          label="Status"
          value={formData.status || ''}
          onChange={(value) => setFormData({ ...formData, status: String(value) })}
          options={enumOptions(Object.values(StatusEnum))}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[700]}>Asking price in euros</Typography>
        <CustomInput
          type="number"
          placeholder="Price"
          value={formData.price !== undefined ? String(formData.price) : ''}
          onChange={(e) => setFormData({ ...formData, price: numberFloat(e.target.value) })}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[700]}>Net yield as a percentage</Typography>
        <CustomInput
          type="number"
          placeholder="Yield"
          value={formData.yield !== undefined ? String(formData.yield) : ''}
          onChange={(e) => setFormData({ ...formData, yield: numberFloat(e.target.value) })}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[700]}>Nomad internal score (0-100)</Typography>
        <CustomInput
          type="number"
          placeholder="Score"
          value={formData.score !== undefined ? String(formData.score) : ''}
          onChange={(e) => setFormData({ ...formData, score: numberInt(e.target.value) })}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
        />
      </Box>
    </Box>
  );
}