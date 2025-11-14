import { PropertyTypeEnum, StatusEnum } from './Enums';
import { useTheme } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import { Box, Typography } from '@mui/material';
import CustomInput from '../../components/utils/input';
import CustomTextArea from '../../components/utils/textarea';
import CustomSelect from '../../components/utils/select';
import MultiSelectDropdown from '../../components/utils/multiSelectDropdown';
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

  const enumOptions = (values: readonly string[]) => {
    const pretty = (s: string) => s
      .replace(/_/g, ' ')
      .toLowerCase()
      .split(' ')
      .map(w => (w ? w[0].toUpperCase() + w.slice(1) : w))
      .join(' ');
    return values.map(v => ({ value: v, label: pretty(String(v)) }));
  };

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
        if (data && data.length > 0 && !formData.agentId && (!Array.isArray(formData.agentIds) || formData.agentIds.length === 0)) {
          const firstAgentId = data[0].userId;
          setFormData(prev => ({ ...prev, agentId: firstAgentId, agentIds: [firstAgentId] }));
        }
      } catch (e) {
        console.warn('Failed to fetch agents', e);
      }
    })();
    return () => { active = false; };
  }, [formData.agencyId, formData.agentId, formData.agentIds, setFormData]);

  // Price input with strict format: up to 10 digits, dot, up to 2 digits
  const [priceInput, setPriceInput] = useState<string>('');
  const [priceValid, setPriceValid] = useState<boolean>(true);
  const priceRegex = /^\d{1,10}(\.\d{0,2})?$/; // allow optional decimals up to 2

  // Initialize price display from formData (use comma decimals, always 2 digits)
  useEffect(() => {
    if (formData.price !== undefined) {
      const formatted = (Math.round((formData.price + Number.EPSILON) * 100) / 100)
        .toFixed(2)
        .replace(/0+$/,'')
        .replace(/\.$/,'');
      setPriceInput(formatted);
      setPriceValid(priceRegex.test(formatted));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePriceChange = (input: string) => {
    const raw = input.replace(/,/g, '.');
    // Allow only digits and a single dot
    if (/[^0-9.]/.test(raw)) return;
    if ((raw.match(/\./g)?.length || 0) > 1) return;
    const [intPart = '', fracPart = ''] = raw.split('.');
    if (intPart.length > 10) return;
    if (fracPart.length > 2) return;
    setPriceInput(raw);
    const isValid = priceRegex.test(raw);
    setPriceValid(isValid);
    if (isValid) {
      const numeric = parseFloat(raw);
      setFormData({ ...formData, price: numeric });
    } else {
      setFormData({ ...formData, price: undefined });
    }
  };

  // Yield input strict format: 1-3 digits, dot, exactly 2 digits
  const [yieldInput, setYieldInput] = useState<string>('');
  const [yieldValid, setYieldValid] = useState<boolean>(true);
  const yieldRegex = /^\d{1,3}(\.\d{0,2})?$/; // allow optional decimals up to 2

  useEffect(() => {
    if (formData.yield !== undefined) {
      const formatted = (Math.round((formData.yield + Number.EPSILON) * 100) / 100)
        .toFixed(2);
      setYieldInput(formatted);
      setYieldValid(yieldRegex.test(formatted));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleYieldChange = (input: string) => {
    const raw = input.replace(/,/g, '.');
    if (/[^0-9.]/.test(raw)) return; // restrict characters
    if ((raw.match(/\./g)?.length || 0) > 1) return; // single dot
    const [intPart = '', fracPart = ''] = raw.split('.');
    if (intPart.length > 3) return; // max 3 digits before dot
    if (fracPart.length > 2) return; // max 2 digits after dot while typing
    setYieldInput(raw);
    const isValid = yieldRegex.test(raw);
    setYieldValid(isValid);
    if (isValid) {
      const numeric = parseFloat(raw);
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
        <Typography variant="body2" color={grey[500]}>Agent(s) managing this listing *</Typography>
        {agents.length > 0 ? (
          <MultiSelectDropdown
            options={agents.map(agent => {
              const firstName = agent.user?.firstName || 'Unknown';
              const lastName = agent.user?.lastName || 'Agent';
              const userId = agent.userId;
              return { value: String(userId), label: `${firstName} ${lastName} (${agent.user?.email || userId})` };
            })}
            values={Array.isArray(formData.agentIds) ? formData.agentIds : (formData.agentId ? [formData.agentId] : [])}
            onChange={(values) => {
              setFormData({ ...formData, agentIds: values, agentId: values[0] || undefined });
            }}
            icon={<BusinessIcon sx={{ color: 'currentColor' }} />}
            focusColor={focusColor}
            bgColor={bgColor}
            textColor={textColor}
            placeholder="Select agent(s)"
          />
        ) : (
          <CustomInput
            placeholder="Agent ID"
            value={formData.agentId || ''}
            onChange={(e) => setFormData({ ...formData, agentId: e.target.value, agentIds: e.target.value ? [e.target.value] : [] })}
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
          onChange={(value) => setFormData({ ...formData, type: value as PropertyTypeEnum })}
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
          onChange={(value) => setFormData({ ...formData, status: value as StatusEnum })}
          options={enumOptions(Object.values(StatusEnum))}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[500]}>Asking price in euros *</Typography>
        <CustomInput
          placeholder="e.g. 10000200.00"
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
            Invalid price format. Use up to 10 digits, optional dot and up to 2 decimals (e.g. 1234567890.99).
          </Typography>
        )}
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[500]}>Net yield as a percentage *</Typography>
        <CustomInput
          placeholder="e.g. 12.50"
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
            Invalid yield format. Use 1-3 digits, optional dot and up to 2 decimals (e.g. 7 or 7.25).
          </Typography>
        )}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[500]}>Number of rooms *</Typography>
        <CustomInput
          placeholder="Rooms"
          value={formData.rooms !== undefined ? String(formData.rooms) : ''}
          onChange={(e) => {
            const raw = e.target.value;
            if (/^\d*$/.test(raw)) setFormData({ ...formData, rooms: numberInt(raw) });
          }}
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
          onChange={(e) => {
            const raw = e.target.value;
            if (/^\d*$/.test(raw)) setFormData({ ...formData, bedrooms: numberInt(raw) });
          }}
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
          onChange={(e) => {
            const raw = e.target.value;
            if (/^\d*$/.test(raw)) setFormData({ ...formData, bathrooms: numberInt(raw) });
          }}
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
          onChange={(e) => {
            const raw = e.target.value;
            if (/^\d*$/.test(raw)) setFormData({ ...formData, floorLevel: numberInt(raw) });
          }}
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
          onChange={(e) => {
            const raw = e.target.value;
            if (/^\d*$/.test(raw)) setFormData({ ...formData, floors: numberInt(raw) });
          }}
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
          onChange={(e) => {
            const raw = e.target.value;
            if (/^\d*(\.\d*)?$/.test(raw)) setFormData({ ...formData, builtArea: numberFloat(raw) });
          }}
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
          onChange={(e) => {
            const raw = e.target.value;
            if (/^\d*(\.\d*)?$/.test(raw)) setFormData({ ...formData, landArea: numberFloat(raw) });
          }}
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
          onChange={(e) => {
            const raw = e.target.value;
            if (/^\d*(\.\d*)?$/.test(raw)) setFormData({ ...formData, totalArea: numberFloat(raw) });
          }}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
          icon={<StraightenIcon sx={{ color: textColor }} />}
        />
      </Box>

    </Box>
  );
}