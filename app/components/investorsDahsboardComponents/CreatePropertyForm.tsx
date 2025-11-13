"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import { Box, Typography, Button } from '@mui/material';
import BasicInfoSection from '../createPropertyComponents/DetailsSection';
import AddressSection from '../createPropertyComponents/AddressSection';
import FeaturesSection from '../createPropertyComponents/FeatureSection';
import ImageUploadSection from '../createPropertyComponents/ImageUploadSection';
import { PropertyFormData } from '../createPropertyComponents/types';
import { createProperty } from '@/app/lib/propertyApi';
import { getLoggedInId } from '@/app/lib/auth';

interface CreatePropertyFormProps {
  onCancel?: () => void;
  onSuccess?: () => void;
}

export default function CreatePropertyForm({ onCancel, onSuccess }: CreatePropertyFormProps) {
  const [formData, setFormData] = useState<PropertyFormData>({});
  const [submitting, setSubmitting] = useState(false);
  const [showGlare, setShowGlare] = useState(false);
  const wasReadyRef = useRef<boolean>(false);

  // Auto-fill agency ID from token
  useEffect(() => {
    const agencyId = getLoggedInId();
    if (agencyId) {
      setFormData(prev => ({
        ...prev,
        agencyId: agencyId,
      }));
    }
  }, []);

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
      // UI marks postal code required
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
    // Fields displayed with * in the UI but not strictly required by backend
    const uiOnlyRequired = [
      'yield', // DetailsSection marks yield as required
    ];
    const multiSelectRequired = [
      'parking', // FeatureSection label shows *
    ];

    const stringsOk = stringReq.every(hasString);
    const numbersOk = numberReq.every(hasNumber);
    const uiOk = uiOnlyRequired.every(hasNumber);
    const multiOk = multiSelectRequired.every(hasStringOrArray);
    return stringsOk && numbersOk && uiOk && multiOk;
  }, [formData]);

  // When the form becomes ready (disabled -> enabled), flash a glare animation once
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
      const res = await createProperty(formData);
      if (typeof window !== 'undefined') {
        alert('Property created successfully.');
      }
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create property';
      if (typeof window !== 'undefined') {
        alert(message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mt:4 }}>
        Create New Property
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
          {submitting ? 'Submitting…' : 'Submit'}
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
