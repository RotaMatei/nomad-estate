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
import CustomSelect from '../../components/utils/select';
import CustomInput from '../../components/utils/input';
import DateInput from '../../components/utils/dateInput';
import CheckboxGroup from '../../components/utils/checkboxGroup';
import { PropertyFormData } from './types';
import StraightenIcon from '@mui/icons-material/Straighten';
import BalconyIcon from '@mui/icons-material/Balcony';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import SecurityIcon from '@mui/icons-material/Security';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import EuroIcon from '@mui/icons-material/Euro';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

interface FeatureProps {
  formData: PropertyFormData;
  setFormData: React.Dispatch<React.SetStateAction<PropertyFormData>>;
}

export default function FeaturesSection({ formData, setFormData }: FeatureProps) {
  const theme = useTheme();
  const focusColor = theme.palette.primary.main;
  const bgColor = theme.palette.background.default;
  const textColor = grey[700];

  const enumOptions = (values: readonly string[]) => values.map(v => ({ value: v, label: v }));
  const toInt = (v: string) => (v === '' ? undefined : parseInt(v, 10));
  const toFloat = (v: string) => (v === '' ? undefined : parseFloat(v));

  return (
    <Box component="fieldset" sx={{ display: 'flex', flexDirection: 'column', gap: 3, my: '1px', p:2, borderRadius:4, border: '1px solid', borderColor: '#c2c2c265' }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, color:'primary.main' }}>Features</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[700]}>Energy efficiency classification</Typography>
        <CustomSelect
          label="Energy Rating"
          value={formData.energyEfficiencyRating || ''}
          onChange={(value) => setFormData({ ...formData, energyEfficiencyRating: String(value) })}
          options={enumOptions(Object.values(EnergyRatingEnum))}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[700]}>Cardinal orientation for natural light</Typography>
        <CustomSelect
          label="Orientation"
          value={formData.orientation || ''}
          onChange={(value) => setFormData({ ...formData, orientation: String(value) })}
          options={enumOptions(Object.values(OrientationEnum))}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[700]}>Parking availability type</Typography>
        <CustomSelect
          label="Parking"
          value={formData.parking || ''}
          onChange={(value) => setFormData({ ...formData, parking: String(value) })}
          options={enumOptions(Object.values(ParkingEnum))}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[700]}>Type of balcony construction</Typography>
        <CustomSelect
          label="Balcony Type"
          value={formData.balconyType || ''}
          onChange={(value) => setFormData({ ...formData, balconyType: String(value) })}
          options={enumOptions(Object.values(BalconyTypeEnum))}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[700]}>Total combined balcony area (m²)</Typography>
        <CustomInput
          type="number"
          placeholder="Balcony Total Size"
          value={formData.balconyTotalSize !== undefined ? String(formData.balconyTotalSize) : ''}
          onChange={(e) => setFormData({ ...formData, balconyTotalSize: toInt(e.target.value) })}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
          icon={<StraightenIcon sx={{ color: grey[500] }} />}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[700]}>Number of distinct balconies</Typography>
        <CustomInput
          type="number"
          placeholder="Balcony Number"
          value={formData.balconyNumber !== undefined ? String(formData.balconyNumber) : ''}
          onChange={(e) => setFormData({ ...formData, balconyNumber: toInt(e.target.value) })}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
          icon={<BalconyIcon sx={{ color: grey[500] }} />}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[700]}>Primary heating system</Typography>
        <CustomSelect
          label="Heating System"
          value={formData.heatingSystem || ''}
          onChange={(value) => setFormData({ ...formData, heatingSystem: String(value) })}
          options={enumOptions(Object.values(HeatingSystemEnum))}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[700]}>Primary cooling system</Typography>
        <CustomSelect
          label="Cooling System"
          value={formData.coolingSystem || ''}
          onChange={(value) => setFormData({ ...formData, coolingSystem: String(value) })}
          options={enumOptions(Object.values(CoolingSystemEnum))}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[700]}>Kitchen furnishing level</Typography>
        <CustomSelect
          label="Kitchen"
          value={formData.kitchen || ''}
          onChange={(value) => setFormData({ ...formData, kitchen: String(value) })}
          options={enumOptions(Object.values(KitchenEnum))}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[700]}>Security installations</Typography>
        <CustomSelect
          label="Security"
          value={formData.security || ''}
          onChange={(value) => setFormData({ ...formData, security: String(value) })}
          options={enumOptions(Object.values(SecurityEnum))}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[700]}>Primary utility highlight</Typography>
        <CustomSelect
          label="Utility"
          value={formData.utility || ''}
          onChange={(value) => setFormData({ ...formData, utility: String(value) })}
          options={enumOptions(Object.values(UtilityEnum))}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[700]}>Smart home capability present</Typography>
        <CustomSelect
          label="Smart Home Feature"
          value={formData.smartHomeFeature || ''}
          onChange={(value) => setFormData({ ...formData, smartHomeFeature: String(value) })}
          options={enumOptions(Object.values(SmartHomeFeatureEnum))}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[700]}>Additional notable feature</Typography>
        <CustomSelect
          label="Other Feature"
          value={formData.otherFeature || ''}
          onChange={(value) => setFormData({ ...formData, otherFeature: String(value) })}
          options={enumOptions(Object.values(OtherFeatureEnum))}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[700]}>Investment goal targeting tag</Typography>
        <CustomSelect
          label="Investment Goal"
          value={formData.investmentGoalTag || ''}
          onChange={(value) => setFormData({ ...formData, investmentGoalTag: String(value) })}
          options={enumOptions(Object.values(InvestmentGoalTagEnum))}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[700]}>Location advantage tag</Typography>
        <CustomSelect
          label="Location Benefit"
          value={formData.locationBenefitTag || ''}
          onChange={(value) => setFormData({ ...formData, locationBenefitTag: String(value) })}
          options={enumOptions(Object.values(LocationBenefitTagEnum))}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[700]}>Property ownership and status</Typography>
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
        <Typography variant="body2" color={grey[700]}>Annual property tax cost (€)</Typography>
        <CustomInput
          type="number"
          placeholder="Property Taxes"
          value={formData.propertyTaxes !== undefined ? String(formData.propertyTaxes) : ''}
          onChange={(e) => setFormData({ ...formData, propertyTaxes: toFloat(e.target.value) })}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
          icon={<EuroIcon sx={{ color: grey[500] }} />}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[700]}>Monthly HOA fee (€)</Typography>
        <CustomInput
          type="number"
          placeholder="HOA Fees"
          value={formData.HOAFees !== undefined ? String(formData.HOAFees) : ''}
          onChange={(e) => setFormData({ ...formData, HOAFees: toFloat(e.target.value) })}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
          icon={<EuroIcon sx={{ color: grey[500] }} />}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[700]}>Construction completion date</Typography>
        <DateInput
          label="Construction Date"
          value={formData.constructionDate || ''}
          onChange={(e) => setFormData({ ...formData, constructionDate: e.target.value })}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
          placeholder="YYYY-MM-DD"
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[700]}>Start date for availability</Typography>
        <DateInput
          label="Availability Start"
          value={formData.availabilityDateStart || ''}
          onChange={(e) => setFormData({ ...formData, availabilityDateStart: e.target.value })}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
          placeholder="YYYY-MM-DD"
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[700]}>End date for availability</Typography>
        <DateInput
          label="Availability End"
          value={formData.availabilityDateEnd || ''}
          onChange={(e) => setFormData({ ...formData, availabilityDateEnd: e.target.value })}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
          placeholder="YYYY-MM-DD"
        />
      </Box>
    </Box>
  );
}