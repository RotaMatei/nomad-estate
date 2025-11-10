"use client";

import React, { useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { grey } from '@mui/material/colors';
import { useTheme } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';
import { PropertyFormData } from './types';

interface ImageUploadSectionProps {
  formData: PropertyFormData;
  setFormData: React.Dispatch<React.SetStateAction<PropertyFormData>>;
}

export default function ImageUploadSection({ formData, setFormData }: ImageUploadSectionProps) {
  const theme = useTheme();
  const focusColor = theme.palette.primary.main;
  const [preview, setPreview] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter(file => file.type.startsWith('image/'));

    if (validFiles.length !== selectedFiles.length) {
      alert('Some files were not images and were skipped.');
    }

    const newFiles = [...files, ...validFiles];
    setFiles(newFiles);

    // Create preview URLs
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setPreview([...preview, ...newPreviews]);

    // Store file references in formData (as Base64 strings or file objects)
    // For now, we'll store the preview URLs
    const imageUrls = [...(formData.images as string[]) || [], ...newPreviews];
    setFormData({ ...formData, images: imageUrls });
  };

  const handleRemoveImage = (index: number) => {
    const newPreview = preview.filter((_, i) => i !== index);
    const newFiles = files.filter((_, i) => i !== index);
    const newImages = (formData.images as string[] || []).filter((_, i) => i !== index);

    // Revoke the object URL to free memory
    URL.revokeObjectURL(preview[index]);

    setPreview(newPreview);
    setFiles(newFiles);
    setFormData({ ...formData, images: newImages });
  };

  return (
    <Box
      component="fieldset"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        my: '1px',
        p: 2,
        borderRadius: 4,
        border: '1px solid',
        borderColor: '#c2c2c265',
      }}
    >
      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.main' }}>
        Property Images
      </Typography>

      {/* Upload Area */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
          borderRadius: 2,
          border: '2px dashed',
          borderColor: focusColor,
          bgcolor: 'rgba(25, 118, 210, 0.05)',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            bgcolor: 'rgba(25, 118, 210, 0.1)',
            borderColor: focusColor,
          },
        }}
        component="label"
      >
        <CloudUploadIcon sx={{ fontSize: 48, color: focusColor }} />
        <Typography variant="body2" sx={{ textAlign: 'center', color: grey[700], fontWeight: 500 }}>
          Drag and drop images here or click to select
        </Typography>
        <Typography variant="caption" sx={{ color: grey[500] }}>
          Supported formats: PNG, JPG
        </Typography>
        <input
          hidden
          accept=".png,.jpg,.jpeg"
          multiple
          type="file"
          onChange={handleFileChange}
        />
      </Box>

      {/* Image Count */}
      {preview.length > 0 && (
        <Typography variant="body2" sx={{ color: grey[700] }}>
          {preview.length} image{preview.length !== 1 ? 's' : ''} selected
        </Typography>
      )}

      {/* Preview Grid */}
      {preview.length > 0 && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(3, 1fr)', sm: 'repeat(5, 1fr)', md: 'repeat(6, 1fr)' },
            gap: 1,
          }}
        >
          {preview.map((url, index) => (
            <Box
              key={index}
              sx={{
                position: 'relative',
                paddingBottom: '100%',
                borderRadius: 1,
                overflow: 'hidden',
                bgcolor: grey[200],
                border: '1px solid',
                borderColor: grey[300],
              }}
            >
              <Box
                component="img"
                src={url}
                alt={`Preview ${index + 1}`}
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <IconButton
                size="small"
                onClick={() => handleRemoveImage(index)}
                sx={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  bgcolor: 'rgba(0, 0, 0, 0.6)',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.8)',
                  },
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}

      {/* Empty State */}
      {preview.length === 0 && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
            py: 2,
            color: grey[500],
          }}
        >
          <ImageIcon sx={{ fontSize: 32 }} />
          <Typography variant="caption">No images selected yet</Typography>
        </Box>
      )}
    </Box>
  );
}
