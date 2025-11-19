"use client";
import React from 'react';
import { Box, Chip, CircularProgress, TextField } from '@mui/material';

export type TagItem = { id: string | number; label: string };

type Fetcher = (query: string) => Promise<TagItem[]>;

interface TagSearchInputProps {
  label?: string;
  placeholder?: string;
  value: TagItem[];
  onChange: (next: TagItem[]) => void;
  fetchSuggestions: Fetcher;
  debounceMs?: number;
}

const debounce = <T extends unknown[]>(fn: (...args: T) => void, ms: number) => {
  let t: ReturnType<typeof setTimeout> | null = null;
  return (...args: T) => {
    if (t) clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
};

export default function TagSearchInput({
  label,
  placeholder,
  value,
  onChange,
  fetchSuggestions,
  debounceMs = 300,
}: TagSearchInputProps) {
  const [query, setQuery] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState<TagItem[]>([]);

  const runSearch = React.useMemo(
    () =>
      debounce(async (q: string) => {
        const text = q.trim();
        if (!text) {
          setSuggestions([]);
          setOpen(false);
          return;
        }
        setLoading(true);
        try {
          const items = await fetchSuggestions(text);
          // Filter out already-selected
          const selectedIds = new Set(value.map((v) => String(v.id)));
          setSuggestions(items.filter((it) => !selectedIds.has(String(it.id))));
          setOpen(items.length > 0);
        } catch {
          setSuggestions([]);
          setOpen(false);
        } finally {
          setLoading(false);
        }
      }, debounceMs),
    [fetchSuggestions, debounceMs, value]
  );

  React.useEffect(() => { runSearch(query); }, [query, runSearch]);

  const addTag = (item: TagItem) => {
    if (!item) return;
    const exists = value.some((v) => String(v.id) === String(item.id));
    if (exists) return;
    onChange([...value, item]);
    setQuery("");
    setSuggestions([]);
    setOpen(false);
  };

  const removeTag = (id: string | number) => {
    onChange(value.filter((v) => String(v.id) !== String(id)));
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1,
          px: 1.5,
          py: 1,
          bgcolor: '#fff',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        {label ? (
          <Box sx={{ fontSize: 12, color: 'text.secondary', fontWeight: 600, mr: 1 }}>{label}</Box>
        ) : null}
        {value.map((tag) => (
          <Chip
            key={String(tag.id)}
            label={tag.label}
            size="small"
            onDelete={() => removeTag(tag.id)}
            sx={{ borderRadius: 2 }}
          />
        ))}
        <TextField
          variant="standard"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (suggestions.length) setOpen(true); }}
          placeholder={placeholder}
          InputProps={{ disableUnderline: true }}
          sx={{ flex: 1, minWidth: 140 }}
        />
        {loading && <CircularProgress size={16} sx={{ ml: 1 }} />}
      </Box>
      {open && suggestions.length > 0 && (
        <Box
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 10,
            bgcolor: '#fff',
            border: '1px solid',
            borderColor: 'divider',
            borderTop: 'none',
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
            maxHeight: 260,
            overflowY: 'auto',
            boxShadow: '0 6px 16px rgba(0,0,0,0.08)'
          }}
          onMouseDown={(e) => e.preventDefault()}
        >
          {suggestions.map((s) => (
            <Box
              key={String(s.id)}
              onClick={() => addTag(s)}
              sx={{
                px: 1.5,
                py: 1,
                cursor: 'pointer',
                '&:hover': { bgcolor: 'action.hover' },
                fontSize: 14,
              }}
            >
              {s.label}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
