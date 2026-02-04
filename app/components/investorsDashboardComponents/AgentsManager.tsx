"use client";
import React from 'react';
import { Box, Typography, TextField, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, IconButton, CircularProgress, Avatar, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/PersonAddAlt1';
import DeleteIcon from '@mui/icons-material/PersonRemoveAlt1';
import SearchIcon from '@mui/icons-material/Search';
import { getAgentsForAgency, addAgentToAgency, removeAgentFromAgency, searchUsers, AgentRecord, BasicUserSearchResult } from '@/app/lib/agentApi';
import TagSearchInput, { type TagItem } from '@/app/components/utils/TagSearchInput';
import { searchCities, searchCountries } from '@/app/lib/locationApi';

interface AgentsManagerProps {
  agencyId: string;
  colorScheme: 'primary' | 'secondary';
  profileName?: string;
  profileAvatarUrl?: string | null;
  onProfileClick?: () => void;
}

const debounce = <T extends unknown[]>(fn: (...args: T) => void, ms: number) => {
  let t: ReturnType<typeof setTimeout> | null = null;
  return (...args: T) => {
    if (t) clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
};

export default function AgentsManager({ agencyId, colorScheme, profileName, profileAvatarUrl, onProfileClick }: AgentsManagerProps) {
  const [agents, setAgents] = React.useState<AgentRecord[]>([]);
  const [query, setQuery] = React.useState('');
  const [searching, setSearching] = React.useState(false);
  const [results, setResults] = React.useState<BasicUserSearchResult[]>([]);
  const [loadingAgents, setLoadingAgents] = React.useState(true);
  const [processing, setProcessing] = React.useState<string | null>(null); // userId currently processed
  const [countryTags, setCountryTags] = React.useState<TagItem[]>([]);
  const [cityTags, setCityTags] = React.useState<TagItem[]>([]);

  const loadAgents = React.useCallback(async () => {
    setLoadingAgents(true);
    const list = await getAgentsForAgency(agencyId);
    setAgents(list);
    setLoadingAgents(false);
  }, [agencyId]);

  React.useEffect(() => { loadAgents(); }, [loadAgents]);

  const runSearch = React.useCallback(debounce(async (q: string) => {
    if (!q || q.trim().length < 2) {
      setResults([]);
      return;
    }
    setSearching(true);
    const list = await searchUsers(q.trim(), cityTags.map(c=>c.label), countryTags.map(c=>c.label));
    setResults(list);
    setSearching(false);
  }, 400), [cityTags, countryTags]);

  React.useEffect(() => { runSearch(query); }, [query, runSearch]);

  const handleAdd = async (userId: string) => {
    setProcessing(userId);
    const ok = await addAgentToAgency(userId, agencyId);
    if (ok) {
      await loadAgents();
      // Clear search input & results after successful add
      setQuery('');
      setResults([]);
    }
    setProcessing(null);
  };

  const handleRemove = async (userId: string) => {
    setProcessing(userId);
    const ok = await removeAgentFromAgency(userId, agencyId);
    if (ok) {
      await loadAgents();
    }
    setProcessing(null);
  };

  const isUserAgent = (userId: string) => agents.some(a => a.userId === userId);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1.5, mb: 4, mt:1 }}>
        <Typography variant="h6" sx={{ color: 'text.info' }}>Agents</Typography>
        <IconButton aria-label="Open profile" onClick={() => onProfileClick && onProfileClick()} sx={{ p: 0 }}>
          <Avatar
            src={profileAvatarUrl || undefined}
            sx={{
              width: 36,
              height: 36,
              bgcolor:'#e5e7eb',
              color:'text.primary',
              fontWeight: 600,
            }}
          >
            {!profileAvatarUrl ? (profileName?.trim()?.charAt(0) || 'U').toUpperCase() : null}
          </Avatar>
        </IconButton>
      </Box>
      <Typography variant="subtitle2" gutterBottom sx={{ color: `${colorScheme}.main`, mb: 2 }}>Add Agents</Typography>
      {/* Location tags for refining agent search */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1.5, mb: 2 }}>
        <TagSearchInput
          label="Countries"
          placeholder="Type to search countries..."
          value={countryTags}
          onChange={setCountryTags}
          fetchSuggestions={searchCountries}
        />
        <TagSearchInput
          label="Cities"
          placeholder="Type to search cities..."
          value={cityTags}
          onChange={setCityTags}
          fetchSuggestions={searchCities}
        />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <TextField
            size="small"
            variant="outlined"
            placeholder="Search users by name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            sx={{
              maxWidth: 340,
              '& .MuiOutlinedInput-root': {
                bgcolor: 'transparent',
                borderRadius: 4,
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'divider',
              },
            }}
          />
            {searching && <CircularProgress size={20} />}
      </Box>

      {/* Results as selectable tag chips */}
      {query.trim().length >= 2 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>Search Results</Typography>
          {results.length === 0 ? (
            <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>No users found.</Typography>
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1.5,
              }}
            >
              {results.map(r => {
                const fullName = `${r.firstName || ''} ${r.lastName || ''}`.trim() || '—';
                const disabled = processing === r.id;
                const already = isUserAgent(r.id);
                return (
                  <Button
                    key={r.id}
                    variant={already ? 'outlined' : 'contained'}
                    color={already ? 'inherit' : colorScheme}
                    disabled={disabled || already}
                    onClick={() => !already && handleAdd(r.id)}
                    startIcon={<AddIcon sx={{ fontSize: 18 }} />}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 600,
                      letterSpacing: 0.3,
                      borderRadius: 3,
                      px: 2.2,
                      py: 1.1,
                      display: 'inline-flex',
                      alignItems: 'center',
                      boxShadow: already ? 'none' : '0 2px 6px rgba(0,0,0,0.15)',
                      fontSize: 14,
                      lineHeight: 1.2,
                      '&:hover': {
                        boxShadow: already ? 'none' : '0 3px 8px rgba(0,0,0,0.22)',
                      },
                      bgcolor: already ? 'background.paper' : undefined,
                      color: already ? 'text.secondary' : undefined,
                    }}
                  >
                    {fullName || 'Unknown'}
                  </Button>
                );
              })}
            </Box>
          )}
        </Box>
      )}

      <Typography variant="subtitle2" gutterBottom sx={{ mb: 1,color:'primary.main' }}>Current Agents</Typography>
      {loadingAgents ? (
        <CircularProgress size={24} />
      ) : agents.length === 0 ? (
        <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>No agents yet for this agency.</Typography>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 4, bgcolor:'common.white' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: 'common.white' }}>
                <TableCell>Name</TableCell>
                <TableCell>Agent ID</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell align="right">Remove</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {agents.map(a => {
                const u = a.user || {};
                const fullName = `${u.firstName || ''} ${u.lastName || ''}`.trim() || '—';
                const disabled = processing === a.userId;
                return (
                  <TableRow key={a.id} hover>
                    <TableCell>{fullName}</TableCell>
                    <TableCell>{a.id}</TableCell>
                    <TableCell>{u.email || '—'}</TableCell>
                    <TableCell>{u.phoneNumber || '—'}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        aria-label="Remove agent"
                        disabled={disabled}
                        onClick={() => handleRemove(a.userId)}
                        size="small"
                      >
                        <DeleteIcon fontSize="small" color={disabled ? 'disabled' : 'error'} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
