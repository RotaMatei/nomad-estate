"use client";

import React, { useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { grey } from '@mui/material/colors';
import { useTheme } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';
import { PropertyFormData } from './types';
// Note: direct backend posting removed; image URLs are persisted after property creation.

interface ImageUploadSectionProps {
  formData: PropertyFormData;
  setFormData: React.Dispatch<React.SetStateAction<PropertyFormData>>;
}

// Removed direct picture POSTing; URLs will be saved after property creation.

export default function ImageUploadSection({ formData, setFormData }: ImageUploadSectionProps) {
  const theme = useTheme();
  const focusColor = theme.palette.primary.main;
  const [preview, setPreview] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const uploadToImgBB = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("key", "e4c4353b195c854235fd7c9f2464337c");
    formData.append("image", file);

    try {
      const res = await fetch("https://api.imgbb.com/1/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      return data?.data?.url || null;
    } catch (err) {
      console.error("Upload error:", err);
      return null;
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter(file => file.type.startsWith('image/'));

    if (validFiles.length !== selectedFiles.length) {
      alert('Some files were not images and were skipped.');
    }

    setUploading(true);
    const uploadedUrls: string[] = [];

    for (const file of validFiles) {
      const url = await uploadToImgBB(file);
      if (url) {
        uploadedUrls.push(url);
        console.log("Uploaded image URL:", url);
        // No immediate API call; propertyApi.createProperty will handle persistence.
      }
    }

    setUploading(false);
    setPreview(prev => [...prev, ...uploadedUrls]);
    setFiles(prev => [...prev, ...validFiles]);
    setFormData(prev => ({
      ...prev,
      images: [...(prev.images as string[] || []), ...uploadedUrls],
    }));
  };

  const handleRemoveImage = (index: number) => {
    const newPreview = preview.filter((_, i) => i !== index);
    const newFiles = files.filter((_, i) => i !== index);
    const newImages = (formData.images as string[] || []).filter((_, i) => i !== index);

    setPreview(newPreview);
    setFiles(newFiles);
    setFormData({ ...formData, images: newImages });
  };

  return (
    <Box component="fieldset" sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: 3,
      my: '1px',
      p: 2,
      borderRadius: 4,
      border: '1px solid',
      borderColor: '#c2c2c265',
    }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.main' }}>
        Property Images
      </Typography>

      {/* Upload Area */}
      <Box component="label" sx={{
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
      }}>
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

      {/* Uploading Indicator */}
      {uploading && (
        <Typography variant="body2" sx={{ color: grey[600] }}>
          Uploading images, please wait…
        </Typography>
      )}

      {/* Image Count */}
      {preview.length > 0 && (
        <Typography variant="body2" sx={{ color: grey[700] }}>
          {preview.length} image{preview.length !== 1 ? 's' : ''} uploaded
        </Typography>
      )}

      {/* Preview Grid */}
      {preview.length > 0 && (
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(3, 1fr)', sm: 'repeat(5, 1fr)', md: 'repeat(6, 1fr)' },
          gap: 1,
        }}>
          {preview.map((url, index) => (
            <Box key={index} sx={{
              position: 'relative',
              paddingBottom: '100%',
              borderRadius: 1,
              overflow: 'hidden',
              bgcolor: grey[200],
              border: '1px solid',
              borderColor: grey[300],
            }}>
              <Box component="img" src={url} alt={`Preview ${index + 1}`} sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }} />
              <IconButton size="small" onClick={() => handleRemoveImage(index)} sx={{
                position: 'absolute',
                top: 4,
                right: 4,
                bgcolor: 'rgba(0, 0, 0, 0.6)',
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.8)',
                },
              }}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}

      {/* Empty State */}
      {preview.length === 0 && !uploading && (
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
          py: 2,
          color: grey[500],
        }}>
          <ImageIcon sx={{ fontSize: 32 }} />
          <Typography variant="caption">No images selected yet</Typography>
        </Box>
      )}
    </Box>
  );
}