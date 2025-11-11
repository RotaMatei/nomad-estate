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
import BuildIcon from '@mui/icons-material/Build';
import StraightenIcon from '@mui/icons-material/Straighten';
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
  const textColor = grey[500];
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

  // Price input with strict format: up to 10 digits, comma, up to 2 digits
  const [priceInput, setPriceInput] = useState<string>('');
  const [priceValid, setPriceValid] = useState<boolean>(true);
  const priceRegex = /^\d{1,10},\d{1,2}$/; // final valid format

  // Initialize price display from formData (use comma decimals, always 2 digits)
  useEffect(() => {
    if (formData.price !== undefined) {
      const formatted = (Math.round((formData.price + Number.EPSILON) * 100) / 100)
        .toFixed(2)
        .replace('.', ',');
      setPriceInput(formatted);
      setPriceValid(priceRegex.test(formatted));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePriceChange = (raw: string) => {
    // Allow only digits and a single comma
    if (/[^0-9,]/.test(raw)) return;
    if ((raw.match(/,/g)?.length || 0) > 1) return;
    const [intPart = '', fracPart = ''] = raw.split(',');
    if (intPart.length > 10) return;
    if (fracPart.length > 2) return;
    setPriceInput(raw);
    const isValid = priceRegex.test(raw);
    setPriceValid(isValid);
    if (isValid) {
      const numeric = parseFloat(raw.replace(',', '.'));
      setFormData({ ...formData, price: numeric });
    } else {
      setFormData({ ...formData, price: undefined });
    }
  };

  // Yield input strict format: 1-3 digits, comma, exactly 2 digits
  const [yieldInput, setYieldInput] = useState<string>('');
  const [yieldValid, setYieldValid] = useState<boolean>(true);
  const yieldRegex = /^\d{1,3},\d{2}$/; // exact two decimals

  useEffect(() => {
    if (formData.yield !== undefined) {
      const formatted = (Math.round((formData.yield + Number.EPSILON) * 100) / 100)
        .toFixed(2)
        .replace('.', ',');
      setYieldInput(formatted);
      setYieldValid(yieldRegex.test(formatted));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleYieldChange = (raw: string) => {
    if (/[^0-9,]/.test(raw)) return; // restrict characters
    if ((raw.match(/,/g)?.length || 0) > 1) return; // single comma
    const [intPart = '', fracPart = ''] = raw.split(',');
    if (intPart.length > 3) return; // max 3 digits before comma
    if (fracPart.length > 2) return; // max 2 digits after comma while typing
    setYieldInput(raw);
    const isValid = yieldRegex.test(raw);
    setYieldValid(isValid);
    if (isValid) {
      const numeric = parseFloat(raw.replace(',', '.'));
      setFormData({ ...formData, yield: numeric });
    } else {
      setFormData({ ...formData, yield: undefined });
    }
  };

  return (
    <Box component="fieldset" sx={{ display: 'flex', flexDirection: 'column', gap: 3, my: '1px', p:2, borderRadius:4, border: '1px solid', borderColor: '#c2c2c265' }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, color:'primary.main' }}> General Details</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[500]}>Agency identifier (auto-filled from your account)</Typography>
        <CustomInput
          placeholder="Agency ID"
          value={formData.agencyId || ''}
          onChange={(e) => setFormData({ ...formData, agencyId: e.target.value })}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
          icon={<BusinessIcon sx={{ color: textColor }} />}
          disabled={true}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[500]}>Agent managing this listing *</Typography>
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
            icon={<BusinessIcon sx={{ color: textColor }} />}
          />
        )}
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[500]}>Listing title shown publicly *</Typography>
        <CustomInput
          placeholder="Title"
          value={formData.title || ''}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
          icon={<TitleIcon sx={{ color: textColor }} />}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[500]}>Detailed description to highlight key features *</Typography>
        <CustomTextArea
          placeholder="Description"
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
          minRows={3}
          maxRows={6}
          icon={<DescriptionIcon sx={{ color: textColor }} />}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[500]}>Property type classification *</Typography>
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
        <Typography variant="body2" color={grey[500]}>Availability status for buyers *</Typography>
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
        <Typography variant="body2" color={grey[500]}>Asking price in euros *</Typography>
        <CustomInput
          placeholder="e.g. 10000200,00"
          value={priceInput}
          onChange={(e) => handlePriceChange(e.target.value)}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
          invalid={!priceValid && priceInput.length > 0}
          icon={<EuroIcon sx={{ color: textColor }} />}
        />
        {!priceValid && priceInput.length > 0 && (
          <Typography variant="caption" sx={{ color: theme.palette.error.main, mt: 0.5 }}>
            Invalid price format. Use up to 10 digits, a comma, and up to 2 digits (e.g. 1234567890,99).
          </Typography>
        )}
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[500]}>Net yield as a percentage *</Typography>
        <CustomInput
          placeholder="e.g. 12,50"
          value={yieldInput}
          onChange={(e) => handleYieldChange(e.target.value)}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
          invalid={!yieldValid && yieldInput.length > 0}
          icon={<TrendingUpIcon sx={{ color: textColor }} />}
        />
        {!yieldValid && yieldInput.length > 0 && (
          <Typography variant="caption" sx={{ color: theme.palette.error.main, mt: 0.5 }}>
            Invalid yield format. Use 1-3 digits, a comma, then exactly 2 digits (e.g. 7,25 or 125,90).
          </Typography>
        )}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[500]}>Number of rooms *</Typography>
        <CustomInput
          placeholder="Rooms"
          value={formData.rooms !== undefined ? String(formData.rooms) : ''}
          onChange={(e) => setFormData({ ...formData, rooms: numberInt(e.target.value) })}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
          icon={<DoorSlidingIcon sx={{ color: textColor }} />}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[500]}>Number of bedrooms *</Typography>
        <CustomInput
          placeholder="Bedrooms"
          value={formData.bedrooms !== undefined ? String(formData.bedrooms) : ''}
          onChange={(e) => setFormData({ ...formData, bedrooms: numberInt(e.target.value) })}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
          icon={<BedroomParentIcon sx={{ color: textColor }} />}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[500]}>Number of bathrooms *</Typography>
        <CustomInput
          placeholder="Bathrooms"
          value={formData.bathrooms !== undefined ? String(formData.bathrooms) : ''}
          onChange={(e) => setFormData({ ...formData, bathrooms: numberInt(e.target.value) })}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
          icon={<BathroomIcon sx={{ color: textColor }} />}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[500]}>Floor level of the property *</Typography>
        <CustomInput
          placeholder="Floor Level"
          value={formData.floorLevel !== undefined ? String(formData.floorLevel) : ''}
          onChange={(e) => setFormData({ ...formData, floorLevel: numberInt(e.target.value) })}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
          icon={<ApartmentIcon sx={{ color: textColor }} />}
        />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[500]}>Total number of floors in building</Typography>
        <CustomInput
          placeholder="Floors"
          value={formData.floors !== undefined ? String(formData.floors) : ''}
          onChange={(e) => setFormData({ ...formData, floors: numberInt(e.target.value) })}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
          icon={<BuildIcon sx={{ color: textColor }} />}
        />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[500]}>Built area in square meters</Typography>
        <CustomInput
          placeholder="Built Area"
          value={formData.builtArea !== undefined ? String(formData.builtArea) : ''}
          onChange={(e) => setFormData({ ...formData, builtArea: numberFloat(e.target.value) })}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
          icon={<StraightenIcon sx={{ color: textColor }} />}
        />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[500]}>Land area in square meters</Typography>
        <CustomInput
          placeholder="Land Area"
          value={formData.landArea !== undefined ? String(formData.landArea) : ''}
          onChange={(e) => setFormData({ ...formData, landArea: numberFloat(e.target.value) })}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
          icon={<StraightenIcon sx={{ color: textColor }} />}
        />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[500]}>Total area in square meters *</Typography>
        <CustomInput
          placeholder="Total Area"
          value={formData.totalArea !== undefined ? String(formData.totalArea) : ''}
          onChange={(e) => setFormData({ ...formData, totalArea: numberFloat(e.target.value) })}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
          icon={<StraightenIcon sx={{ color: textColor }} />}
        />
      </Box>

    </Box>
  );
}