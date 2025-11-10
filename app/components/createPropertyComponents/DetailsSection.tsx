import { PropertyTypeEnum, StatusEnum } from './Enums';
import { useTheme } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import { Box, Typography } from '@mui/material';
import CustomInput from '../../components/utils/input';
import CustomTextArea from '../../components/utils/textarea';
import CustomSelect from '../../components/utils/select';
import { PropertyFormData } from './types';
import BusinessIcon from '@mui/icons-material/Business';
import TitleIcon from '@mui/icons-material/Title';
import DescriptionIcon from '@mui/icons-material/Description';
import EuroIcon from '@mui/icons-material/Euro';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import DoorSlidingIcon from '@mui/icons-material/DoorSliding';
import BedroomParentIcon from '@mui/icons-material/BedroomParent';
import BathroomIcon from '@mui/icons-material/Bathroom';
import ApartmentIcon from '@mui/icons-material/Apartment';
// Restored required icon imports used in JSX
import { useEffect, useState } from 'react';
import { getAgentsForAgency } from '@/app/lib/propertyApi';

interface DetailsProps {
  formData: PropertyFormData;
  setFormData: React.Dispatch<React.SetStateAction<PropertyFormData>>;
}

export default function DetailsSection({ formData, setFormData }: DetailsProps) {
  const theme = useTheme();
  const focusColor = theme.palette.primary.main;
  const bgColor = theme.palette.background.default;
  const textColor = grey[700];
  const [agents, setAgents] = useState<
    Array<{
      userId: string;
      user?: { firstName?: string; lastName?: string; email?: string } | null;
    }>
  >([]);

  const numberFloat = (v: string) => (v === '' ? undefined : parseFloat(v));
  const numberInt = (v: string) => (v === '' ? undefined : parseInt(v, 10));

  const enumOptions = (values: readonly string[]) => values.map(v => ({ value: v, label: v }));

  // Fetch agents when agencyId changes
  useEffect(() => {
    if (!formData.agencyId) return;
    let active = true;
    (async () => {
      try {
        const data = await getAgentsForAgency(formData.agencyId!);
        if (!active) return;
        console.log('Fetched agents:', JSON.stringify(data, null, 2));
        setAgents(data || []);
        if (data && data.length > 0 && !formData.agentId) {
          const firstAgentId = data[0].userId;
          setFormData(prev => ({ ...prev, agentId: firstAgentId }));
        }
      } catch (e) {
        console.warn('Failed to fetch agents', e);
      }
    })();
    return () => { active = false; };
  }, [formData.agencyId, formData.agentId, setFormData]);

  return (
    <Box component="fieldset" sx={{ display: 'flex', flexDirection: 'column', gap: 3, my: '1px', p:2, borderRadius:4, border: '1px solid', borderColor: '#c2c2c265' }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, color:'primary.main' }}> General Details</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[700]}>Agency identifier (auto-filled from your account)</Typography>
        <CustomInput
          placeholder="Agency ID"
          value={formData.agencyId || ''}
          onChange={(e) => setFormData({ ...formData, agencyId: e.target.value })}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
          icon={<BusinessIcon sx={{ color: grey[500] }} />}
          disabled={true}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[700]}>Agent managing this listing</Typography>
        {agents.length > 0 ? (
          <CustomSelect
            label="Select Agent"
            value={formData.agentId || ''}
            onChange={(value) => {
              setFormData({ ...formData, agentId: String(value) });
            }}
            options={agents.map(agent => {
              const firstName = agent.user?.firstName || 'Unknown';
              const lastName = agent.user?.lastName || 'Agent';
              const userId = agent.userId;
              return {
                value: userId,
                label: `${firstName} ${lastName} (${agent.user?.email || userId})`
              };
            })}
            focusColor={focusColor}
            bgColor={bgColor}
            textColor={textColor}
          />
        ) : (
          <CustomInput
            placeholder="Agent ID"
            value={formData.agentId || ''}
            onChange={(e) => setFormData({ ...formData, agentId: e.target.value })}
            focusColor={focusColor}
            bgColor={bgColor}
            textColor={textColor}
            icon={<BusinessIcon sx={{ color: grey[500] }} />}
          />
        )}
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
          icon={<TitleIcon sx={{ color: grey[500] }} />}
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
          icon={<DescriptionIcon sx={{ color: grey[500] }} />}
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
          icon={<EuroIcon sx={{ color: grey[500] }} />}
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
          icon={<TrendingUpIcon sx={{ color: grey[500] }} />}
        />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[700]}>Number of rooms</Typography>
        <CustomInput
          type="number"
          placeholder="Rooms"
          value={formData.rooms !== undefined ? String(formData.rooms) : ''}
          onChange={(e) => setFormData({ ...formData, rooms: numberInt(e.target.value) })}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
          icon={<DoorSlidingIcon sx={{ color: grey[500] }} />}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[700]}>Number of bedrooms</Typography>
        <CustomInput
          type="number"
          placeholder="Bedrooms"
          value={formData.bedrooms !== undefined ? String(formData.bedrooms) : ''}
          onChange={(e) => setFormData({ ...formData, bedrooms: numberInt(e.target.value) })}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
          icon={<BedroomParentIcon sx={{ color: grey[500] }} />}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[700]}>Number of bathrooms</Typography>
        <CustomInput
          type="number"
          placeholder="Bathrooms"
          value={formData.bathrooms !== undefined ? String(formData.bathrooms) : ''}
          onChange={(e) => setFormData({ ...formData, bathrooms: numberInt(e.target.value) })}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
          icon={<BathroomIcon sx={{ color: grey[500] }} />}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[700]}>Floor level of the property</Typography>
        <CustomInput
          type="number"
          placeholder="Floor Level"
          value={formData.floorLevel !== undefined ? String(formData.floorLevel) : ''}
          onChange={(e) => setFormData({ ...formData, floorLevel: numberInt(e.target.value) })}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
          icon={<ApartmentIcon sx={{ color: grey[500] }} />}
        />
      </Box>

    </Box>
  );
}