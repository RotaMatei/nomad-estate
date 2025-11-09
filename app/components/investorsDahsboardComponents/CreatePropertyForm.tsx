"use client";

import { useState, useEffect } from 'react';
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

  // Auto-fill agency ID from token
  useEffect(() => {
    const agencyId = getLoggedInId();
    if (agencyId) {
      setFormData(prev => ({
        ...prev,
        agencyId: agencyId,
      }));
      console.log('Auto-filled agencyId from token:', agencyId);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await createProperty(formData);
      console.log('Property created:', res);
      if (typeof window !== 'undefined') {
        alert('Property created successfully.');
      }
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: unknown) {
      console.error(err);
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
          disabled={submitting}
        >
          {submitting ? 'Submitting…' : 'Submit'}
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
