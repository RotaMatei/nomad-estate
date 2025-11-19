"use client";

import React from 'react';
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
  existing?: Array<{ id: string; url: string }>;
  onExistingChange?: (next: Array<{ id: string; url: string }>) => void;
  propertyId?: string;
}

export default function ImageUploadSection({ formData, setFormData, existing, onExistingChange }: ImageUploadSectionProps) {
  const theme = useTheme();
  const focusColor = theme.palette.primary.main;

  const [existingPics, setExistingPics] = React.useState<Array<{ id: string; url: string }>>(existing ?? []);
  const [preview, setPreview] = React.useState<string[]>([]);
  const [files, setFiles] = React.useState<File[]>([]);
  const [uploading, setUploading] = React.useState(false);

  React.useEffect(() => {
    if (Array.isArray(existing)) setExistingPics(existing);
  }, [existing]);

  // Upload a single file to ImgBB and return its URL (or null on failure)
  const uploadToImgBB = async (file: File): Promise<string | null> => {
    const fd = new FormData();
    fd.append('key', 'e4c4353b195c854235fd7c9f2464337c');
    fd.append('image', file);
    try {
      const res = await fetch('https://api.imgbb.com/1/upload', { method: 'POST', body: fd });
      const data = await res.json();
      return data?.data?.url || null;
    } catch (e) {
      console.error('Upload error:', e);
      return null;
    }
  };
  const processSelectedFiles = async (selectedFiles: File[]) => {
    const validFiles = selectedFiles.filter(f => f.type.startsWith('image/'));
    if (validFiles.length !== selectedFiles.length) alert('Some files were not images and were skipped.');

    setUploading(true);

    const uploadOnce = async (file: File) => {
      const first = await uploadToImgBB(file);
      if (first) return first;
      // quick retry once
      return await uploadToImgBB(file);
    };

    const results = await Promise.allSettled(validFiles.map(uploadOnce));
    setUploading(false);

    const succeeded: { url: string; file: File }[] = [];
    results.forEach((r, i) => {
      if (r.status === 'fulfilled' && typeof r.value === 'string' && r.value) {
        succeeded.push({ url: r.value, file: validFiles[i] });
      }
    });

    if (succeeded.length === 0) return;

    setPreview(prev => [...prev, ...succeeded.map(s => s.url)]);
    setFiles(prev => [...prev, ...succeeded.map(s => s.file)]);
    setFormData(prev => ({ ...prev, images: [...(prev.images as string[] || []), ...succeeded.map(s => s.url)] }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    await processSelectedFiles(selectedFiles);
    // Reset input to ensure selecting same files again still triggers change
    try { e.target.value = ''; } catch {}
  };

  const handleRemoveImage = (index: number) => {
    const newPreview = preview.filter((_, i) => i !== index);
    const newFiles = files.filter((_, i) => i !== index);
    const newImages = (formData.images as string[] || []).filter((_, i) => i !== index);
    setPreview(newPreview);
    setFiles(newFiles);
    setFormData({ ...formData, images: newImages });
  };

  const handleDeleteExisting = async (idx: number) => {
    const pic = existingPics[idx];
    if (!pic) return;
    try {
      const { deletePictureById } = await import('@/app/lib/propertyApi');
      const ok = await deletePictureById(pic.id);
      if (ok) {
        const next = existingPics.filter((_, i) => i !== idx);
        setExistingPics(next);
        onExistingChange && onExistingChange(next);
      } else {
        alert('Failed to delete image');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Simple HTML5 drag & drop reordering (separate for existing and new)
  const handleDragStart = (type: 'existing' | 'new', index: number) => (e: React.DragEvent) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ type, index }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (type: 'existing' | 'new', targetIndex: number) => (e: React.DragEvent) => {
    e.preventDefault();
    try {
      const payload = JSON.parse(e.dataTransfer.getData('application/json')) as { type: 'existing' | 'new'; index: number };
      if (!payload || payload.type !== type) return;
      const from = payload.index;
      if (from === targetIndex) return;
      if (type === 'existing') {
        const next = existingPics.slice();
        const [moved] = next.splice(from, 1);
        next.splice(targetIndex, 0, moved);
        setExistingPics(next);
        onExistingChange && onExistingChange(next);
      } else {
        const nextPrev = preview.slice();
        const [moved] = nextPrev.splice(from, 1);
        nextPrev.splice(targetIndex, 0, moved);
        setPreview(nextPrev);
        // Keep formData.images in the same order as preview for new uploads
        const imgs = (formData.images as string[] || []).slice();
        const [movedImg] = imgs.splice(from, 1);
        imgs.splice(targetIndex, 0, movedImg);
        setFormData({ ...formData, images: imgs });
      }
    } catch {}
  };

  return (
    <Box component="fieldset" sx={{
      p: 2,
      borderRadius: 4,
      border: '1px solid',
      borderColor: grey[300],
      display: 'flex',
      flexDirection: 'column',
      gap: 3,
    }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.main' }}>
        Property Images
      </Typography>

      <Box component="label" onDragOver={(e) => { e.preventDefault(); }} onDrop={async (e) => {
        e.preventDefault();
        const dropped = Array.from(e.dataTransfer.files || []);
        if (dropped.length) await processSelectedFiles(dropped);
      }} sx={{
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
        '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.1)', borderColor: focusColor },
      }}>
        <CloudUploadIcon sx={{ fontSize: 48, color: focusColor }} />
        <Typography variant="body2" sx={{ textAlign: 'center', color: grey[700], fontWeight: 500 }}>
          Drag and drop images here or click to select
        </Typography>
        <Typography variant="caption" sx={{ color: grey[500] }}>
          Supported formats: PNG, JPG
        </Typography>
        <input hidden accept=".png,.jpg,.jpeg" multiple type="file" onChange={handleFileChange} />
      </Box>

      {uploading && (
        <Typography variant="body2" sx={{ color: grey[600] }}>
          Uploading images, please wait…
        </Typography>
      )}

      {(existingPics.length + preview.length) > 0 && (
        <Typography variant="body2" sx={{ color: grey[700] }}>
          {existingPics.length} existing · {preview.length} new
        </Typography>
      )}

      {(existingPics.length > 0 || preview.length > 0) && (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(3, 1fr)', sm: 'repeat(5, 1fr)', md: 'repeat(6, 1fr)' }, gap: 1 }}>
          {existingPics.map((p, i) => (
            <Box
              key={`ex-${p.id}-${i}`}
              draggable
              onDragStart={handleDragStart('existing', i)}
              onDragOver={handleDragOver}
              onDrop={handleDrop('existing', i)}
              sx={{ position: 'relative', paddingBottom: '100%', borderRadius: 1, overflow: 'hidden', bgcolor: grey[200], border: '1px solid', borderColor: grey[300], cursor: 'grab' }}
            >
              <Box component="img" src={p.url} alt={`Image ${i + 1}`} sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              <IconButton size="small" onClick={() => handleDeleteExisting(i)} sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'rgba(0,0,0,0.6)', color: 'white', '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' } }}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}

          {preview.map((url, index) => (
            <Box
              key={`nv-${index}`}
              draggable
              onDragStart={handleDragStart('new', index)}
              onDragOver={handleDragOver}
              onDrop={handleDrop('new', index)}
              sx={{ position: 'relative', paddingBottom: '100%', borderRadius: 1, overflow: 'hidden', bgcolor: grey[200], border: '1px solid', borderColor: grey[300], cursor: 'grab' }}
            >
              <Box component="img" src={url} alt={`Preview ${index + 1}`} sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              <IconButton size="small" onClick={() => handleRemoveImage(index)} sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'rgba(0,0,0,0.6)', color: 'white', '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' } }}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}

      {(existingPics.length === 0 && preview.length === 0 && !uploading) && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, py: 2, color: grey[500] }}>
          <ImageIcon sx={{ fontSize: 32 }} />
          <Typography variant="caption">No images selected yet</Typography>
        </Box>
      )}
    </Box>
  );
}