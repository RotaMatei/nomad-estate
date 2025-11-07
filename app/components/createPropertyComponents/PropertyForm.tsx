"use client";

import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import BasicInfoSection from './DetailsSection';
import AddressSection from './AddressSection';
import FeaturesSection from './FeatureSection';
import CustomButton from '../../components/utils/button';
import { PropertyFormData } from './types';
import { createProperty } from '../../lib/propertyApi';

export default function PropertyForm() {
  const [formData, setFormData] = useState<PropertyFormData>({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await createProperty(formData);
      console.log('Property created:', res);
      if (typeof window !== 'undefined') {
        alert('Property created successfully.');
      }
      // TODO: navigate to details page if route exists
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
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3, px: 2 }}>
      <Typography variant="h5" align="center" sx={{ fontWeight: 700 }}>
        Create Property
      </Typography>
      <BasicInfoSection formData={formData} setFormData={setFormData} />
      <AddressSection formData={formData} setFormData={setFormData} />
      <FeaturesSection formData={formData} setFormData={setFormData} />
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <CustomButton type="submit" color="primary" label={submitting ? 'Submitting…' : 'Submit'} disabled={submitting} />
      </Box>
    </Box>
  );
}