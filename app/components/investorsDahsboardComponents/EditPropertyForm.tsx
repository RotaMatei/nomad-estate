"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import { Box, Typography, Button, CircularProgress, Alert } from '@mui/material';
import BasicInfoSection from '../createPropertyComponents/DetailsSection';
import AddressSection from '../createPropertyComponents/AddressSection';
import FeaturesSection from '../createPropertyComponents/FeatureSection';
import ImageUploadSection from '../createPropertyComponents/ImageUploadSection';
import { PropertyFormData } from '../createPropertyComponents/types';
import { getPropertyDetails, updateProperty, PropertyDetails } from '@/app/lib/propertyApi';
import { getLoggedInId } from '@/app/lib/auth';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import type {
  PropertyTypeEnum,
  StatusEnum,
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
} from '../createPropertyComponents/Enums';

interface EditPropertyFormProps {
  propertyId: string;
  onCancel?: () => void;
  onSuccess?: () => void;
}

export default function EditPropertyForm({ propertyId, onCancel, onSuccess }: EditPropertyFormProps) {
  const [formData, setFormData] = useState<PropertyFormData>({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showGlare, setShowGlare] = useState(false);
  const wasReadyRef = useRef<boolean>(false);

  // Load property details on mount
  useEffect(() => {
    const loadPropertyData = async () => {
      try {
        setLoading(true);
        setError(null);
        const details = await getPropertyDetails(propertyId);
        
        if (!details) {
          setError('Failed to load property details');
          return;
        }

        // Map property details to form data
        const toNum = (v: unknown): number | undefined => {
          const n = typeof v === 'number' ? v : typeof v === 'string' ? Number(v) : NaN;
          return isFinite(n) ? n : undefined;
        };
        const mappedData: PropertyFormData = {
          agencyId: (details.agencyId || getLoggedInId()) as string,
          agentId: details.agentId as string | undefined,
          title: details.title as string | undefined,
          description: details.description as string | undefined,
          type: details.type as PropertyTypeEnum | undefined,
          status: details.status as StatusEnum | undefined,
          price: toNum(details.price),
          countryId: toNum(details.countryId),
          cityId: toNum(details.cityId),
          stateId: toNum(details.stateId),
          streetAddress: details.streetAddress as string | undefined,
          postalCode: details.postalCode as string | undefined,
          latitude: toNum(details.latitude),
          longitude: toNum(details.longitude),
          rooms: toNum(details.rooms),
          bedrooms: toNum(details.bedrooms),
          bathrooms: toNum(details.bathrooms),
          floorLevel: toNum(details.floorLevel),
          orientation: details.orientation as OrientationEnum | undefined,
          totalArea: toNum(details.totalArea),
          builtArea: toNum(details.builtArea),
          landArea: toNum(details.landArea),
          yield: toNum(details.yield),
          score: toNum(details.score),
          constructionDate: details.constructionDate as string | undefined,
          floors: toNum(details.floors),
          energyEfficiencyRating: details.energyEfficiencyRating as EnergyRatingEnum | undefined,
          parking: details.parking as ParkingEnum | ParkingEnum[] | undefined,
          balconyType: details.balconyType as BalconyTypeEnum | undefined,
          balconyTotalSize: toNum(details.balconyTotalSize),
          balconyNumber: toNum(details.balconyNumber),
          ownershipStatus: details.ownershipStatus as boolean | undefined,
          propertyTaxes: toNum(details.propertyTaxes),
          HOAFees: toNum(details.HOAFees),
          availabilityDateStart: details.availabilityDateStart as string | undefined,
          availabilityDateEnd: details.availabilityDateEnd as string | undefined,
          // Images from picture array
          images: ((details.picture || details.propertyPictures || []) as Array<{ imageData?: string }>)
            .map(p => p.imageData)
            .filter((url): url is string => typeof url === 'string' && url.length > 0),
          // Additional fields from details object
          heatingSystem: (details.heatingSystem || []) as HeatingSystemEnum | HeatingSystemEnum[] | undefined,
          coolingSystem: (details.coolingSystem || []) as CoolingSystemEnum | CoolingSystemEnum[] | undefined,
          kitchen: details.kitchen as KitchenEnum | KitchenEnum[] | undefined,
          security: (details.security || []) as SecurityEnum | SecurityEnum[] | undefined,
          utility: (details.utility || []) as UtilityEnum | UtilityEnum[] | undefined,
          smartHomeFeature: (details.smartHomeFeature || []) as SmartHomeFeatureEnum | SmartHomeFeatureEnum[] | undefined,
          otherFeature: (details.otherFeature || []) as OtherFeatureEnum | OtherFeatureEnum[] | undefined,
          investmentGoalTag: (details.investmentGoalTag || []) as InvestmentGoalTagEnum | InvestmentGoalTagEnum[] | undefined,
          locationBenefitTag: (details.locationBenefitTag || []) as LocationBenefitTagEnum | LocationBenefitTagEnum[] | undefined,
        };

        setFormData(mappedData);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load property details';
        setError(message);
        console.error('Error loading property:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPropertyData();
  }, [propertyId]);


  // Determine if all required fields are completed
  const isReadyToSubmit = useMemo(() => {
    const s = formData as Record<string, unknown>;
    const hasString = (k: string) => typeof s[k] === 'string' && String(s[k]).trim().length > 0;
    const hasNumber = (k: string) => typeof s[k] === 'number' && !isNaN(s[k] as number);
    const hasStringOrArray = (k: string) => {
      const v = s[k];
      if (typeof v === 'string') return v.trim().length > 0;
      if (Array.isArray(v)) return v.length > 0 && v.every(x => typeof x === 'string' && String(x).trim().length > 0);
      return false;
    };

    const stringReq = [
      'agencyId',
      'agentId',
      'title',
      'description',
      'type',
      'status',
      'streetAddress',
      'orientation',
      'postalCode',
    ];
    const numberReq = [
      'price',
      'countryId',
      'cityId',
      'latitude',
      'longitude',
      'rooms',
      'bedrooms',
      'bathrooms',
      'floorLevel',
      'totalArea',
    ];
    const uiOnlyRequired = [
      'yield',
    ];
    const multiSelectRequired = [
      'parking',
    ];

    const stringsOk = stringReq.every(hasString);
    const numbersOk = numberReq.every(hasNumber);
    const uiOk = uiOnlyRequired.every(hasNumber);
    const multiOk = multiSelectRequired.every(hasStringOrArray);
    return stringsOk && numbersOk && uiOk && multiOk;
  }, [formData]);

  // When the form becomes ready, flash a glare animation once
  useEffect(() => {
    const previouslyReady = wasReadyRef.current;
    if (!previouslyReady && isReadyToSubmit && !submitting) {
      setShowGlare(true);
      const t = setTimeout(() => setShowGlare(false), 900);
      return () => clearTimeout(t);
    }
    wasReadyRef.current = isReadyToSubmit;
  }, [isReadyToSubmit, submitting]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      const res = await updateProperty(propertyId, formData);
      if (typeof window !== 'undefined') {
        alert('Property updated successfully.');
      }
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update property';
      setError(message);
      if (typeof window !== 'undefined') {
        alert(message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={32} sx={{ mr: 2 }} />
        <Typography>Loading property details...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        {onCancel && (
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={onCancel}
            sx={{ borderRadius: 2 }}
          >
            Back to Listings
          </Button>
        )}
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mt: 4 }}>
        Edit Property
      </Typography>
      <BasicInfoSection formData={formData} setFormData={setFormData} />
      <AddressSection formData={formData} setFormData={setFormData} />
      <FeaturesSection formData={formData} setFormData={setFormData} />
      <ImageUploadSection formData={formData} setFormData={setFormData} />
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-start', mt: 2 }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={submitting || !isReadyToSubmit}
          sx={{
            position: 'relative',
            overflow: 'hidden',
            '@keyframes glare-sweep': {
              from: { transform: 'translateX(0%)' },
              to: { transform: 'translateX(260%)' },
            },
          }}
        >
          {submitting ? 'Updating…' : 'Update'}
          {showGlare && (
            <Box
              aria-hidden
              sx={{
                pointerEvents: 'none',
                position: 'absolute',
                top: 0,
                left: '-30%',
                height: '100%',
                width: '30%',
                background: 'linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)',
                filter: 'blur(1px)',
                animation: 'glare-sweep 0.9s ease-out forwards',
              }}
            />
          )}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outlined"
            color="primary"
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
      </Box>
    </Box>
  );
}
