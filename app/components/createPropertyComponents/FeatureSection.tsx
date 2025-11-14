import {
  EnergyRatingEnum,
  OrientationEnum,
  ParkingEnum,
  BalconyTypeEnum,
  HeatingSystemEnum,
  CoolingSystemEnum,
  KitchenEnum,
  SecurityEnum,
  UtilityEnum,
  SmartHomeFeatureEnum,
  OtherFeatureEnum,
  InvestmentGoalTagEnum,
  LocationBenefitTagEnum,
} from './Enums';
import { useTheme } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import { Box, Typography } from '@mui/material';
import { useRef, useState, useEffect } from 'react';
import CustomSelect from '../../components/utils/select';
import CustomInput from '../../components/utils/input';
import MultiSelectDropdown from '../../components/utils/multiSelectDropdown';
import { PropertyFormData } from './types';
import StraightenIcon from '@mui/icons-material/Straighten';
import BalconyIcon from '@mui/icons-material/Balcony';
import EuroIcon from '@mui/icons-material/Euro';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
// New semantic icons
import EnergySavingsLeafOutlinedIcon from '@mui/icons-material/EnergySavingsLeafOutlined';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import WhatshotOutlinedIcon from '@mui/icons-material/WhatshotOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import KitchenIcon from '@mui/icons-material/Kitchen';

interface FeatureProps {
  formData: PropertyFormData;
  setFormData: React.Dispatch<React.SetStateAction<PropertyFormData>>;
}

export default function FeaturesSection({ formData, setFormData }: FeatureProps) {
  const theme = useTheme();
  const focusColor = theme.palette.primary.main;
  const bgColor = theme.palette.background.default;
  // Updated default input/display text color per request to grey[500] for all buttons/inputs
  const textColor = grey[500];

  const constructionDateRef = useRef<HTMLInputElement | null>(null);
  const availabilityStartRef = useRef<HTMLInputElement | null>(null);
  const availabilityEndRef = useRef<HTMLInputElement | null>(null);

  const enumOptions = (values: readonly string[]) => {
    const pretty = (s: string) => s
      .replace(/_/g, ' ')
      .toLowerCase()
      .split(' ')
      .map(w => (w ? w[0].toUpperCase() + w.slice(1) : w))
      .join(' ');
    return values.map(v => ({ value: v, label: pretty(String(v)) }));
  };
  const toInt = (v: string) => (v === '' ? undefined : parseInt(v, 10));
  const toFloat = (v: string) => (v === '' ? undefined : parseFloat(v));
  // Logical limits
  const LIMITS = {
    balconySizeMin: 0,
    balconySizeMax: 10_000,
    balconyCountMin: 0,
    balconyCountMax: 100,
    moneyMin: 0,
    moneyMax: 1_000_000,
  } as const;

  const openDatePicker = (ref: React.RefObject<HTMLInputElement | null>) => {
    const el = ref.current;
    if (!el) return;
    const picker = (el as HTMLInputElement & { showPicker?: () => void }).showPicker;
    if (typeof picker === 'function') {
      picker.call(el);
    } else {
      el.focus();
      el.click();
    }
  };

  // Property Taxes and HOA Fees format: up to 6 digits, optional dot and up to 3 decimals
  const [propertyTaxesInput, setPropertyTaxesInput] = useState<string>('');
  const [propertyTaxesValid, setPropertyTaxesValid] = useState<boolean>(true);
  const [hoaFeesInput, setHoaFeesInput] = useState<string>('');
  const [hoaFeesValid, setHoaFeesValid] = useState<boolean>(true);
  const taxesFeesRegex = /^\d{1,6}(\.\d{0,3})?$/; // allow optional decimals up to 3

  // Initialize from formData if present
  useEffect(() => {
    if (formData.propertyTaxes !== undefined) {
      const raw = (Math.round((formData.propertyTaxes + Number.EPSILON) * 1000) / 1000).toFixed(3);
      const formatted = raw.replace(/0+$/, '').replace(/\.$/, '');
      setPropertyTaxesInput(formatted);
      setPropertyTaxesValid(taxesFeesRegex.test(formatted));
    }
    if (formData.HOAFees !== undefined) {
      const raw = (Math.round((formData.HOAFees + Number.EPSILON) * 1000) / 1000).toFixed(3);
      const formatted = raw.replace(/0+$/, '').replace(/\.$/, '');
      setHoaFeesInput(formatted);
      setHoaFeesValid(taxesFeesRegex.test(formatted));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTaxesChange = (input: string) => {
    const raw = input.replace(/,/g, '.');
    // allow only digits and a single dot
    if (/[^0-9.]/.test(raw)) return;
    if ((raw.match(/\./g)?.length || 0) > 1) return;
    const [intPart = '', fracPart = ''] = raw.split('.');
    if (intPart.length > 6) return;
    if (fracPart.length > 3) return;
    let next = raw;
    const isValid = taxesFeesRegex.test(raw);
    setPropertyTaxesValid(isValid);
    if (isValid) {
      let numeric = parseFloat(raw);
      if (numeric < LIMITS.moneyMin) numeric = LIMITS.moneyMin;
      if (numeric > LIMITS.moneyMax) numeric = LIMITS.moneyMax;
      next = String(numeric);
      setFormData({ ...formData, propertyTaxes: numeric });
    } else {
      setFormData({ ...formData, propertyTaxes: undefined });
    }
    setPropertyTaxesInput(next);
  };

  const handleHoaChange = (input: string) => {
    const raw = input.replace(/,/g, '.');
    if (/[^0-9.]/.test(raw)) return;
    if ((raw.match(/\./g)?.length || 0) > 1) return;
    const [intPart = '', fracPart = ''] = raw.split('.');
    if (intPart.length > 6) return;
    if (fracPart.length > 3) return;
    let next = raw;
    const isValid = taxesFeesRegex.test(raw);
    setHoaFeesValid(isValid);
    if (isValid) {
      let numeric = parseFloat(raw);
      if (numeric < LIMITS.moneyMin) numeric = LIMITS.moneyMin;
      if (numeric > LIMITS.moneyMax) numeric = LIMITS.moneyMax;
      next = String(numeric);
      setFormData({ ...formData, HOAFees: numeric });
    } else {
      setFormData({ ...formData, HOAFees: undefined });
    }
    setHoaFeesInput(next);
  };

  return (
    <Box component="fieldset" sx={{ display: 'flex', flexDirection: 'column', gap: 3, my: '1px', p:2, borderRadius:4, border: '1px solid', borderColor: '#c2c2c265' }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, color:'primary.main' }}>Features</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[500]}>Energy efficiency classification *</Typography>
        <CustomSelect
          label="Energy Rating"
          value={formData.energyEfficiencyRating || ''}
          onChange={(value) => setFormData({ ...formData, energyEfficiencyRating: value as EnergyRatingEnum })}
          options={enumOptions(Object.values(EnergyRatingEnum))}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
          icon={<EnergySavingsLeafOutlinedIcon sx={{ color: 'currentColor' }} />}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[500]}>Cardinal orientation for natural light *</Typography>
        <CustomSelect
          label="Orientation"
          value={formData.orientation || ''}
          onChange={(value) => setFormData({ ...formData, orientation: value as OrientationEnum })}
          options={Object.values(OrientationEnum).map(v => ({ value: v, label: v }))}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
          icon={<ExploreOutlinedIcon sx={{ color: 'currentColor' }} />}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[500]}>Parking availability type *</Typography>
        <MultiSelectDropdown
          options={enumOptions(Object.values(ParkingEnum))}
          values={Array.isArray(formData.parking) ? formData.parking : (formData.parking ? [formData.parking] : [])}
          onChange={(values) => setFormData({ ...formData, parking: values.map(v => v as ParkingEnum) })}
          icon={<LocalParkingIcon sx={{ color: 'currentColor' }} />}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
          placeholder="Select parking options"
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[500]}>Type of balcony construction *</Typography>
        <CustomSelect
          label="Balcony Type"
          value={formData.balconyType || ''}
          onChange={(value) => setFormData({ ...formData, balconyType: value as BalconyTypeEnum })}
          options={enumOptions(Object.values(BalconyTypeEnum))}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
          icon={<BalconyIcon sx={{ color: 'currentColor' }} />}
        />
      </Box>
      {formData.balconyType !== 'NONE' && (
        <>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
            <Typography variant="body2" color={grey[500]}>Total combined balcony area (m²) *</Typography>
            <CustomInput
              placeholder="Balcony Total Size"
              value={formData.balconyTotalSize !== undefined ? String(formData.balconyTotalSize) : ''}
              onChange={(e) => {
                const raw = e.target.value;
                if (!/^\d*$/.test(raw)) return;
                const n = toInt(raw);
                if (n === undefined) { setFormData({ ...formData, balconyTotalSize: undefined }); return; }
                const clamped = Math.max(LIMITS.balconySizeMin, Math.min(LIMITS.balconySizeMax, n));
                setFormData({ ...formData, balconyTotalSize: clamped });
              }}
              focusColor={focusColor}
              bgColor={bgColor}
              icon={<StraightenIcon sx={{ color: textColor }} />}
              textColor={textColor}
            />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
            <Typography variant="body2" color={grey[500]}>Number of distinct balconies *</Typography>
            <CustomInput
              placeholder="Balcony Number"
              value={formData.balconyNumber !== undefined ? String(formData.balconyNumber) : ''}
              onChange={(e) => {
                const raw = e.target.value;
                if (!/^\d*$/.test(raw)) return;
                const n = toInt(raw);
                if (n === undefined) { setFormData({ ...formData, balconyNumber: undefined }); return; }
                const clamped = Math.max(LIMITS.balconyCountMin, Math.min(LIMITS.balconyCountMax, n));
                setFormData({ ...formData, balconyNumber: clamped });
              }}
              focusColor={focusColor}
              bgColor={bgColor}
              icon={<BalconyIcon sx={{ color: textColor }} />}
              textColor={textColor}
            />
          </Box>
        </>
      )}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[500]}>Primary heating system</Typography>
        <MultiSelectDropdown
          options={enumOptions(Object.values(HeatingSystemEnum))}
          values={Array.isArray(formData.heatingSystem) ? formData.heatingSystem : (formData.heatingSystem ? [formData.heatingSystem] : [])}
          onChange={(values) => setFormData({ ...formData, heatingSystem: values.map(v => v as HeatingSystemEnum) })}
          icon={<WhatshotOutlinedIcon sx={{ color: 'currentColor' }} />}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
          placeholder="Select heating systems"
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[500]}>Primary cooling system</Typography>
        <MultiSelectDropdown
          options={enumOptions(Object.values(CoolingSystemEnum))}
          values={Array.isArray(formData.coolingSystem) ? formData.coolingSystem : (formData.coolingSystem ? [formData.coolingSystem] : [])}
          onChange={(values) => setFormData({ ...formData, coolingSystem: values.map(v => v as CoolingSystemEnum) })}
          icon={<AcUnitIcon sx={{ color: 'currentColor' }} />}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
          placeholder="Select cooling systems"
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[500]}>Kitchen furnishing level</Typography>
        <MultiSelectDropdown
          options={enumOptions(Object.values(KitchenEnum))}
          values={Array.isArray(formData.kitchen) ? formData.kitchen : (formData.kitchen ? [formData.kitchen] : [])}
          onChange={(values) => setFormData({ ...formData, kitchen: values.map(v => v as KitchenEnum) })}
          icon={<KitchenIcon sx={{ color: 'currentColor' }} />}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
          placeholder="Select kitchen options"
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[500]}>Security installations</Typography>
        <MultiSelectDropdown
          options={enumOptions(Object.values(SecurityEnum))}
          values={Array.isArray(formData.security) ? formData.security : (formData.security ? [formData.security] : [])}
          onChange={(values) => setFormData({ ...formData, security: values.map(v => v as SecurityEnum) })}
          icon={<SecurityOutlinedIcon sx={{ color: 'currentColor' }} />}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
          placeholder="Select security options"
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[500]}>Primary utility highlight</Typography>
        <MultiSelectDropdown
          options={enumOptions(Object.values(UtilityEnum))}
          values={Array.isArray(formData.utility) ? formData.utility : (formData.utility ? [formData.utility] : [])}
          onChange={(values) => setFormData({ ...formData, utility: values.map(v => v as UtilityEnum) })}
          icon={<BoltOutlinedIcon sx={{ color: 'currentColor' }} />}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
          placeholder="Select utilities"
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[500]}>Smart home capability present</Typography>
        <MultiSelectDropdown
          options={enumOptions(Object.values(SmartHomeFeatureEnum))}
          values={Array.isArray(formData.smartHomeFeature) ? formData.smartHomeFeature : (formData.smartHomeFeature ? [formData.smartHomeFeature] : [])}
          onChange={(values) => setFormData({ ...formData, smartHomeFeature: values.map(v => v as SmartHomeFeatureEnum) })}
          icon={<SmartToyOutlinedIcon sx={{ color: 'currentColor' }} />}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
          placeholder="Select smart home features"
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[500]}>Additional notable feature</Typography>
        <MultiSelectDropdown
          options={enumOptions(Object.values(OtherFeatureEnum))}
          values={Array.isArray(formData.otherFeature) ? formData.otherFeature : (formData.otherFeature ? [formData.otherFeature] : [])}
          onChange={(values) => setFormData({ ...formData, otherFeature: values.map(v => v as OtherFeatureEnum) })}
          icon={<StarBorderOutlinedIcon sx={{ color: 'currentColor' }} />}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
          placeholder="Select additional features"
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[500]}>Investment goal targeting tag</Typography>
        <MultiSelectDropdown
          options={enumOptions(Object.values(InvestmentGoalTagEnum))}
          values={Array.isArray(formData.investmentGoalTag) ? formData.investmentGoalTag : (formData.investmentGoalTag ? [formData.investmentGoalTag] : [])}
          onChange={(values) => setFormData({ ...formData, investmentGoalTag: values.map(v => v as InvestmentGoalTagEnum) })}
          icon={<TrendingUpIcon sx={{ color: 'currentColor' }} />}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
          placeholder="Select investment goals"
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[500]}>Location advantage tag</Typography>
        <MultiSelectDropdown
          options={enumOptions(Object.values(LocationBenefitTagEnum))}
          values={Array.isArray(formData.locationBenefitTag) ? formData.locationBenefitTag : (formData.locationBenefitTag ? [formData.locationBenefitTag] : [])}
          onChange={(values) => setFormData({ ...formData, locationBenefitTag: values.map(v => v as LocationBenefitTagEnum) })}
          icon={<LocationOnOutlinedIcon sx={{ color: 'currentColor' }} />}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
          placeholder="Select location benefits"
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[500]}>Property ownership and status</Typography>
        <CustomSelect
          label="Ownership Status"
          value={formData.ownershipStatus ? 'owned' : ''}
          onChange={(value) => setFormData({ ...formData, ownershipStatus: value === 'owned' })}
          options={[{ value: 'owned', label: 'Owned' }, { value: 'leased', label: 'Leased' }]}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[500]}>Annual property tax cost (€) *</Typography>
        <CustomInput
          placeholder="e.g. 123456.789 or 123456"
          value={propertyTaxesInput}
          onChange={(e) => handleTaxesChange(e.target.value)}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
          invalid={!propertyTaxesValid && propertyTaxesInput.length > 0}
          icon={<EuroIcon sx={{ color: textColor }} />}
        />
        {!propertyTaxesValid && propertyTaxesInput.length > 0 && (
          <Typography variant="caption" sx={{ color: theme.palette.error.main, mt: 0.5 }}>
            Invalid format. Use up to 6 digits, optionally a dot and up to 3 digits (e.g. 123456.789 or 123456).
          </Typography>
        )}
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[500]}>Monthly HOA fee (€) *</Typography>
        <CustomInput
          placeholder="e.g. 123456.789 or 123456"
          value={hoaFeesInput}
          onChange={(e) => handleHoaChange(e.target.value)}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
          invalid={!hoaFeesValid && hoaFeesInput.length > 0}
          icon={<EuroIcon sx={{ color: textColor }} />}
        />
        {!hoaFeesValid && hoaFeesInput.length > 0 && (
          <Typography variant="caption" sx={{ color: theme.palette.error.main, mt: 0.5 }}>
            Invalid format. Use up to 6 digits, optionally a dot and up to 3 digits (e.g. 123456.789 or 123456).
          </Typography>
        )}
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[500]}>Construction completion date *</Typography>
        <Box sx={{ position: 'relative' }}>
          <EventOutlinedIcon
            sx={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              color: textColor,
              pointerEvents: 'auto',
              cursor: 'pointer',
              zIndex: 1,
            }}
            onClick={() => openDatePicker(constructionDateRef)}
          />
          <input
            ref={constructionDateRef}
            type="date"
            value={formData.constructionDate || ''}
            onChange={(e) => setFormData({ ...formData, constructionDate: e.target.value })}
            style={{
              width: '100%',
              padding: '8px 12px 8px 44px',
              borderRadius: '12px',
              border: 'none',
              outline: 'none',
              fontSize: '16px',
              fontFamily: 'Montserrat, sans-serif',
              backgroundColor: bgColor,
              color: textColor,
              boxShadow: `0 3px 0 ${grey[300]}`,
              cursor: 'pointer',
              transition: 'box-shadow 0.2s ease',
            }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow = `0 3px 0 ${focusColor}`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = `0 3px 0 ${grey[300]}`;
            }}
          />
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[500]}>Start date for availability *</Typography>
        <Box sx={{ position: 'relative' }}>
          <EventOutlinedIcon
            sx={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              color: textColor,
              pointerEvents: 'auto',
              cursor: 'pointer',
              zIndex: 1,
            }}
            onClick={() => openDatePicker(availabilityStartRef)}
          />
          <input
            ref={availabilityStartRef}
            type="date"
            value={formData.availabilityDateStart || ''}
            onChange={(e) => setFormData({ ...formData, availabilityDateStart: e.target.value })}
            style={{
              width: '100%',
              padding: '8px 12px 8px 44px',
              borderRadius: '12px',
              border: 'none',
              outline: 'none',
              fontSize: '16px',
              fontFamily: 'Montserrat, sans-serif',
              backgroundColor: bgColor,
              color: textColor,
              boxShadow: `0 3px 0 ${grey[300]}`,
              cursor: 'pointer',
              transition: 'box-shadow 0.2s ease',
            }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow = `0 3px 0 ${focusColor}`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = `0 3px 0 ${grey[300]}`;
            }}
          />
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[500]}>End date for availability</Typography>
        <Box sx={{ position: 'relative' }}>
          <EventOutlinedIcon
            sx={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              color: textColor,
              pointerEvents: 'auto',
              cursor: 'pointer',
              zIndex: 1,
            }}
            onClick={() => openDatePicker(availabilityEndRef)}
          />
          <input
            ref={availabilityEndRef}
            type="date"
            value={formData.availabilityDateEnd || ''}
            onChange={(e) => setFormData({ ...formData, availabilityDateEnd: e.target.value })}
            style={{
              width: '100%',
              padding: '8px 12px 8px 44px',
              borderRadius: '12px',
              border: 'none',
              outline: 'none',
              fontSize: '16px',
              fontFamily: 'Montserrat, sans-serif',
              backgroundColor: bgColor,
              color: textColor,
              boxShadow: `0 3px 0 ${grey[300]}`,
              cursor: 'pointer',
              transition: 'box-shadow 0.2s ease',
            }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow = `0 3px 0 ${focusColor}`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = `0 3px 0 ${grey[300]}`;
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}