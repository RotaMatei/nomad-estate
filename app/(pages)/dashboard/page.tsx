'use client';

import { Grid, Box, useTheme, IconButton, Typography, Avatar, Button, CircularProgress, Stack } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import { useRouter, useSearchParams } from 'next/navigation';
import TopMetrics from '../../components/investorsDahsboardComponents/TopMetrics';
import YieldGraph from '../../components/investorsDahsboardComponents/YieldGraph';
import VolumeGraph from '../../components/investorsDahsboardComponents/VolumeGraph';
import { StaggeredMenu, StaggeredMenuItem, StaggeredMenuSection } from '@/app/reactDevBits/StaggeredMenu/staggeredMenu';
import React from 'react';
import { getTokenData } from '@/app/lib/auth';
// Removed unused axios import (using api client instead)
import api from '@/app/lib/api';
import TopCities from '../../components/investorsDahsboardComponents/topCities';
import ListingCard from '../../components/investorsDahsboardComponents/ListingCard'; // retained for other sections
import PropertyCard from '../../components/investorsDahsboardComponents/PropertyCard';
import AgentsManager from '../../components/investorsDahsboardComponents/AgentsManager';
import { unsavePropertyForUser } from '@/app/lib/propertyApi';
import CreatePropertyForm from '../../components/investorsDahsboardComponents/CreatePropertyForm';
import EditPropertyForm from '../../components/investorsDahsboardComponents/EditPropertyForm';
import { getPortfolioForAgency, getPropertyDetails, getSavedForUser, getSavesForProperty, getPerformanceForProperty, getCtrForProperty, getActiveLeadsForProperty, getGlobalInsights, PortfolioProperty, deletePropertyById } from '@/app/lib/propertyApi';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


const generalItems: StaggeredMenuItem[] = [
  { label: 'Home', ariaLabel: 'Home', link: '/' },
  { label: 'About Us', ariaLabel: 'About Us', link: '/about' },
  { label: 'Property Search', ariaLabel: 'Property Search', link: '/properties' },
  { label: 'Dashboard', ariaLabel: 'Dashboard', link: '/dashboard' },
  { label: 'Plans', ariaLabel: 'Plans', link: '/plans' },
];

export default function InvestmentDashboard() {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState<boolean>(true);
  const [sidebarVisible, setSidebarVisible] = React.useState<boolean>(true);
  const [profileName, setProfileName] = React.useState<string>('');
  const [profileEmail, setProfileEmail] = React.useState<string>('');
  const [profileRole, setProfileRole] = React.useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('role');
      if (stored && typeof stored === 'string') return stored;
      try {
        const data = getTokenData();
        const role = (data && typeof (data as Record<string, unknown>)['role'] === 'string')
          ? String((data as Record<string, unknown>)['role'])
          : null;
        return role;
      } catch {
        // ignore
      }
    }
    return null;
  });
  const [roleReady, setRoleReady] = React.useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('role');
      if (stored) return true;
      try {
        const data = getTokenData();
        const role = (data && typeof (data as Record<string, unknown>)['role'] === 'string');
        return !!role;
      } catch {
        return false;
      }
    }
    return false;
  });
  const [profileAvatarUrl, setProfileAvatarUrl] = React.useState<string | null>(null);

  // Selected content within the DASHBOARD section (no full page reload)
  const [dashboardTab, setDashboardTab] = React.useState<string>('Market Insights');
  const [showCreateProperty, setShowCreateProperty] = React.useState<boolean>(false);
  const [editingPropertyId, setEditingPropertyId] = React.useState<string | null>(null);
  const [agencyPortfolio, setAgencyPortfolio] = React.useState<PortfolioProperty[]>([]);
  const [portfolioImages, setPortfolioImages] = React.useState<Record<string, string>>({});
  const [portfolioSavesCount, setPortfolioSavesCount] = React.useState<Record<string, number>>({});
  const [cityMap, setCityMap] = React.useState<Record<number, string>>({});
  const [countryMap, setCountryMap] = React.useState<Record<number, string>>({});
  const [averages, setAverages] = React.useState<Record<string, number>>({});
  const [avgSavesPortfolio, setAvgSavesPortfolio] = React.useState<number>(0);
  const [totalSavesPortfolio, setTotalSavesPortfolio] = React.useState<number>(0);
  const [totalViewsPortfolio, setTotalViewsPortfolio] = React.useState<number>(0);
  const [avgViewsPortfolio, setAvgViewsPortfolio] = React.useState<number>(0);
  const [avgCtrPortfolio, setAvgCtrPortfolio] = React.useState<number>(0);
  const [totalActiveLeadsPortfolio, setTotalActiveLeadsPortfolio] = React.useState<number>(0);
  const [avgInquiriesPortfolio, setAvgInquiriesPortfolio] = React.useState<number>(0);
  // Track the agency id used for portfolio fetches so we can refresh after creating a listing
  const [agencyIdForPortfolio, setAgencyIdForPortfolio] = React.useState<string | null>(null);
  // Likes section state (for regular users)
  const [likedProperties, setLikedProperties] = React.useState<PortfolioProperty[]>([]);
  const [likedImages, setLikedImages] = React.useState<Record<string, string>>({});
  const [likedSavesCount, setLikedSavesCount] = React.useState<Record<string, number>>({});
  // Global insights (Market Insights tab)
  const [globalInsights, setGlobalInsights] = React.useState<{ propertyCount: number; avgRentalYield: number; avgROI: number; avgCTR: number; activeLeads: number; avgInquiries: number } | null>(null);

  const searchParams = useSearchParams();
  const isAgent = /^(AGENT|AGENCY)$/i.test(String(profileRole || ''));
  const sidebarColorMain = isAgent ? theme.palette.primary.main : theme.palette.secondary.main;
  const sidebarColorDark = isAgent ? theme.palette.primary.dark : theme.palette.secondary.dark;

  // Compute dashboard items based on role
  const dashboardItems: StaggeredMenuItem[] = React.useMemo(() => {
    const items: StaggeredMenuItem[] = [
      { label: 'Market Insights', ariaLabel: 'Market Insights', link: '#' },
    ];
    if (isAgent) {
      items.push({ label: 'Listings', ariaLabel: 'Listings', link: '#' });
      items.push({ label: 'Agents', ariaLabel: 'Agents', link: '#' });
    } else {
      items.push({ label: 'Liked Properties & Inquiries', ariaLabel: 'Liked Properties & Inquiries', link: '#' });
    }
    return items;
  }, [isAgent]);

  // Sections use the computed dashboard items
  const sections: StaggeredMenuSection[] = React.useMemo(() => [
    { title: 'DASHBOARD', items: dashboardItems },
    { title: 'GENERAL', items: generalItems },
  ], [dashboardItems]);

  // Fast averages recompute for local state updates
  const computeAverages = React.useCallback((list: PortfolioProperty[]) => {
    type NumericKeys = 'price' | 'yield' | 'score' | 'bedrooms' | 'bathrooms' | 'rooms';
    const nums = (arr: PortfolioProperty[], key: NumericKeys) => arr
      .map((p) => p[key])
      .filter((n): n is number => typeof n === 'number' && !isNaN(n));
    const avg = (ns: number[]) => (ns.length ? ns.reduce((a, b) => a + b, 0) / ns.length : 0);
    return {
      price: avg(nums(list, 'price')),
      yield: avg(nums(list, 'yield')),
      score: avg(nums(list, 'score')),
      bedrooms: avg(nums(list, 'bedrooms')),
      bathrooms: avg(nums(list, 'bathrooms')),
      rooms: avg(nums(list, 'rooms')),
    } as Record<string, number>;
  }, []);

  // Helper to reload the agency portfolio and related derived state
  const reloadPortfolio = React.useCallback(async () => {
    if (!agencyIdForPortfolio) return;
    try {
      // eslint-disable-next-line no-console
      console.log('[InvestorsDashboard] Reloading portfolio for agencyId:', agencyIdForPortfolio);
      const list = await getPortfolioForAgency(agencyIdForPortfolio);
      setAgencyPortfolio(list);

      // Recompute averages
  type NumericKeys = 'price' | 'yield' | 'score' | 'bedrooms' | 'bathrooms' | 'rooms';
  const nums = (arr: PortfolioProperty[], key: NumericKeys) => arr.map((p) => p[key]).filter((n): n is number => typeof n === 'number' && !isNaN(n));
      const avg = (ns: number[]) => (ns.length ? ns.reduce((a, b) => a + b, 0) / ns.length : 0);
      const avgPrice = avg(nums(list, 'price'));
      const avgYield = avg(nums(list, 'yield'));
      const avgScore = avg(nums(list, 'score'));
      const avgBedrooms = avg(nums(list, 'bedrooms'));
      const avgBathrooms = avg(nums(list, 'bathrooms'));
      const avgRooms = avg(nums(list, 'rooms'));
      setAverages({ price: avgPrice, yield: avgYield, score: avgScore, bedrooms: avgBedrooms, bathrooms: avgBathrooms, rooms: avgRooms });

      // Prefetch images for display (limit to first 12)
      const first = list.slice(0, 12);
      const imageEntries: Record<string, string> = {};
      await Promise.all(
        first.map(async (p: PortfolioProperty) => {
          const det = await getPropertyDetails(String(p.id));
          const pics = (det?.picture || det?.propertyPictures || []) as Array<{ imageData?: string }>;
          const url = pics.find((ph) => typeof ph?.imageData === 'string' && (ph.imageData as string).length > 0)?.imageData as string | undefined;
          if (url) imageEntries[String(p.id)] = url;
        })
      );
      setPortfolioImages(imageEntries);

      // Update city/country maps with any new ids
  const uniqueCityIds = Array.from(new Set(list.map((p) => p.cityId).filter((v): v is number => typeof v === 'number')));
  const uniqueCountryIds = Array.from(new Set(list.map((p) => p.countryId).filter((v): v is number => typeof v === 'number')));
      const newCityMap: Record<number, string> = { ...cityMap };
      const newCountryMap: Record<number, string> = { ...countryMap };
      await Promise.all([
        ...uniqueCityIds
          .filter((id: number) => !newCityMap[id])
          .map(async (id: number) => {
            try {
              const r = await api.get(`/cities/retrieve/${id}`);
              if (r?.data?.name) newCityMap[id] = String(r.data.name);
            } catch {}
          }),
        ...uniqueCountryIds
          .filter((id: number) => !newCountryMap[id])
          .map(async (id: number) => {
            try {
              const r = await api.get(`/countries/retrieve/${id}`);
              if (r?.data?.name) newCountryMap[id] = String(r.data.name);
            } catch {}
          }),
      ]);
      setCityMap(newCityMap);
      setCountryMap(newCountryMap);
      // Background: recompute analytics-based portfolio metrics without blocking UI
      void (async () => {
        try {
          const savesEntries = await Promise.all(list.map(async (p: PortfolioProperty) => {
            const pid = String(p.id);
            const arr = await getSavesForProperty(pid);
            return [pid, Array.isArray(arr) ? arr.length : 0] as const;
          }));
          const countsSaved = savesEntries.map(([, cnt]) => cnt);
          setPortfolioSavesCount(Object.fromEntries(savesEntries));
          const totalSaves = countsSaved.reduce((a, b) => a + b, 0);
          setTotalSavesPortfolio(totalSaves);
          setAvgSavesPortfolio(list.length ? totalSaves / list.length : 0);

          const perf = await Promise.all(list.map(async (p: PortfolioProperty) => {
            const r = await getPerformanceForProperty(String(p.id));
            return r || { views: 0, inquiries: 0 };
          }));
          const totalViews = perf.reduce((sum, row) => sum + (typeof row.views === 'number' ? row.views : 0), 0);
          const avgViews = list.length ? totalViews / list.length : 0;
          setTotalViewsPortfolio(totalViews);
          setAvgViewsPortfolio(avgViews);
          const avgInq = list.length ? perf.reduce((s, r) => s + (typeof r.inquiries === 'number' ? r.inquiries : 0), 0) / list.length : 0;
          setAvgInquiriesPortfolio(avgInq);

          const ctrs = await Promise.all(list.map(async (p: PortfolioProperty) => {
            const c = await getCtrForProperty(String(p.id));
            return typeof c?.ctr === 'number' ? c.ctr : null;
          }));
          const ctrVals = ctrs.filter((v): v is number => typeof v === 'number' && !isNaN(v));
          setAvgCtrPortfolio(ctrVals.length ? ctrVals.reduce((a, b) => a + b, 0) / ctrVals.length : 0);

          const leads = await Promise.all(list.map(async (p: PortfolioProperty) => {
            const a = await getActiveLeadsForProperty(String(p.id));
            return typeof a?.lead === 'number' ? a.lead : 0;
          }));
          setTotalActiveLeadsPortfolio(leads.reduce((a, b) => a + b, 0));
        } catch {
          setTotalSavesPortfolio(0);
          setAvgSavesPortfolio(0);
          setTotalViewsPortfolio(0);
          setAvgViewsPortfolio(0);
          setAvgCtrPortfolio(0);
          setTotalActiveLeadsPortfolio(0);
          setAvgInquiriesPortfolio(0);
        }
      })();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('[InvestorsDashboard] Failed to reload portfolio', e);
    }
  }, [agencyIdForPortfolio, cityMap, countryMap]);

  // Begin edit helpers
  const handleStartEdit = React.useCallback((id: string) => {
    try {
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.set('edit', id);
        router.replace(url.pathname + '?' + url.searchParams.toString());
      }
    } catch {}
    setEditingPropertyId(id);
    setShowCreateProperty(false);
  }, [router]);

  const clearEditParam = React.useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.delete('edit');
        const qs = url.searchParams.toString();
        router.replace(url.pathname + (qs ? '?' + qs : ''));
      }
    } catch {}
    setEditingPropertyId(null);
  }, [router]);

  // Sync state with URL ?edit= param
  React.useEffect(() => {
    const editId = searchParams.get('edit');
    if (editId) {
      setEditingPropertyId(editId);
      setShowCreateProperty(false);
    } else if (editingPropertyId) {
      // If URL no longer has edit but state does, clear state
      setEditingPropertyId(null);
    }
  }, [searchParams]);

  // Delete handler for listings (must be declared after reloadPortfolio)
  const handleDeleteListing = React.useCallback(async (id?: string) => {
    if (!id) return;
    const confirmed = typeof window === 'undefined' ? true : window.confirm('Delete this property? This action cannot be undone.');
    if (!confirmed) return;
    try {
      await deletePropertyById(id);
      // Optimistically update UI: remove from local list, recompute averages, drop image
      setAgencyPortfolio((prev) => {
        const next = prev.filter((p) => String(p.id) !== id);
        setAverages(computeAverages(next));
        setPortfolioImages((imgs) => {
          if (!(id in imgs)) return imgs;
          const { [id]: _removed, ...rest } = imgs;
          return rest;
        });
        return next;
      });
      // Background refresh to ensure maps/images stay accurate without blocking UI
      void reloadPortfolio();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Failed to delete property', e);
    }
  }, [computeAverages, reloadPortfolio]);

  // Ensure selected tab stays valid if role changes filters
  React.useEffect(() => {
    const allowed = new Set(dashboardItems.map(i => i.label));
    if (!allowed.has(dashboardTab)) {
      setDashboardTab('Market Insights');
    }
  }, [dashboardItems, dashboardTab]);

  // Open menu button: white rounded rectangle with Menu icon in role-based color
  const headerMenuButton = (
    <Box sx={{ bgcolor: 'common.white', borderRadius: 1, boxShadow: '0 2px 6px rgba(0,0,0,0.15)', p: 0.5 }}>
      <IconButton aria-label="Open menu" onClick={() => {
        setIsSidebarOpen((v) => {
          const next = !v;
          if (next) setSidebarVisible(true);
          return next;
        });
      }} size="small">
        <MenuOutlinedIcon sx={{ color: sidebarColorMain }} fontSize="small" />
      </IconButton>
    </Box>
  );

  // Fetch current profile (user or agency) after mount if token exists
  React.useEffect(() => {
    // Fire global insights immediately for Market Insights view
    void (async () => {
      try {
        const gi = await getGlobalInsights();
        if (gi) setGlobalInsights(gi);
      } catch { /* ignore */ }
    })();

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) return;
    let cancelled = false;

    (async () => {
      interface JwtPayload { sub?: string; role?: string; [k: string]: unknown }
      let payload: JwtPayload | null = null;
      try {
        const parts = token.split('.');
        if (parts.length >= 2) {
          payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
        }
      } catch { /* ignore */ }

      let entityId: string | null = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
      if (!entityId && payload?.sub) {
        entityId = String(payload.sub);
        localStorage.setItem('userId', entityId);
      }
      if (!entityId) return;

      interface FetchedUser {
        firstName?: string; lastName?: string; email?: string; role?: string;
        avatarUrl?: string; avatar?: string; imageUrl?: string; image?: string;
        profilePictureUrl?: string; profilePicture?: string;
        // Some backends include agencyId for AGENT users
        agencyId?: string;
      }
      interface FetchedAgency { id?: string; email?: string; companyName?: string; profilePictureData?: string }

      const fetchUser = async (): Promise<FetchedUser | null> => {
        // Use api client without manual Authorization header to benefit from interceptor
        const resUser = await api.get<FetchedUser>(`/user/retrieve/${entityId}`);
        
        // Check if data is empty string or empty object
        if (!resUser.data || (typeof resUser.data === 'string' && resUser.data === '') || Object.keys(resUser.data || {}).length === 0) {
          throw new Error('Empty user data received');
        }
        
        const u: FetchedUser = (resUser.data || {}) as FetchedUser;
        const name = (u.firstName || '') + (u.lastName ? ` ${u.lastName}` : '');
        if (!cancelled) {
          if (name.trim()) {
            setProfileName(name.trim());
          }
          if (u.email) {
            setProfileEmail(u.email);
          }
          if (u.role) {
            setProfileRole(String(u.role));
          }
          const avatar = u.avatarUrl || u.avatar || u.imageUrl || u.image || u.profilePictureUrl || u.profilePicture;
          if (avatar && typeof avatar === 'string') {
            setProfileAvatarUrl(avatar);
          }
        }
        return u;
      };

      const fetchAgency = async (): Promise<FetchedAgency | null> => {
        // Use api client without manual Authorization header to benefit from interceptor
        const resAgency = await api.get<FetchedAgency>(`/agency/retrieve/${entityId}`);
        const a: FetchedAgency = (resAgency.data || {}) as FetchedAgency;
        if (!cancelled) {
          if (a.companyName) setProfileName(a.companyName);
          if (a.email) setProfileEmail(a.email);
          setProfileRole('AGENT');
          if (a.profilePictureData && typeof a.profilePictureData === 'string') {
            setProfileAvatarUrl(`data:image/png;base64,${a.profilePictureData}`);
          }
        }
        return a ?? null;
      };

      // Try user first (covers both regular users and agent users)
      let fetchedUser: FetchedUser | null = null;
      let fetchedAgency: FetchedAgency | null = null;
      try {
        fetchedUser = await fetchUser();
      } catch (usrErr) {
        // User fetch failed; fall back to agency fetch (for direct agency login)
        try {
          fetchedAgency = await fetchAgency();
        } catch (agErr) {
          console.warn('Both user and agency endpoints failed', { userError: usrErr, agencyError: agErr });
        }
      }
      // If user fetch succeeded but indicates AGENT role, we may still need agency info
      if (!fetchedAgency) {
        try {
          const roleFromUser = fetchedUser?.role || payload?.role || localStorage.getItem('role') || undefined;
          if (roleFromUser === 'AGENT') {
            // Attempt agency lookup using same id (backend may resolve agency by id when logged as agency)
            fetchedAgency = await fetchAgency().catch(() => null);
          }
        } catch { /* ignore */ }
      }

  // After determining role/agency, load portfolio deterministically if we have an agency context
      try {
        // Prefer explicit agency id from agency fetch, otherwise fall back to entityId
        const portfolioAgencyId = (fetchedAgency && (fetchedAgency.id || entityId))
          || (fetchedUser?.role === 'AGENT' && (fetchedUser.agencyId || localStorage.getItem('agencyId') || entityId))
          || null;
        if (portfolioAgencyId) {
          setAgencyIdForPortfolio(String(portfolioAgencyId));
          // eslint-disable-next-line no-console
          console.log('[InvestorsDashboard] Fetching portfolio for agencyId:', portfolioAgencyId);
          const list = await getPortfolioForAgency(portfolioAgencyId);
          // eslint-disable-next-line no-console
          console.log('[InvestorsDashboard] Portfolio retrieved. Count =', Array.isArray(list) ? list.length : 0);
          setAgencyPortfolio(list);

          // Compute averages on base property fields
          type NumericKeys2 = 'price' | 'yield' | 'score' | 'bedrooms' | 'bathrooms' | 'rooms';
          const nums = (arr: PortfolioProperty[], key: NumericKeys2) => arr.map((p) => p[key]).filter((n): n is number => typeof n === 'number' && !isNaN(n));
          const avg = (ns: number[]) => (ns.length ? ns.reduce((a, b) => a + b, 0) / ns.length : 0);
          const avgPrice = avg(nums(list, 'price'));
          const avgYield = avg(nums(list, 'yield'));
          const avgScore = avg(nums(list, 'score'));
          const avgBedrooms = avg(nums(list, 'bedrooms'));
          const avgBathrooms = avg(nums(list, 'bathrooms'));
          const avgRooms = avg(nums(list, 'rooms'));
          const avgs = { price: avgPrice, yield: avgYield, score: avgScore, bedrooms: avgBedrooms, bathrooms: avgBathrooms, rooms: avgRooms };
          setAverages(avgs);
          // eslint-disable-next-line no-console
          console.log('[InvestorsDashboard] Computed portfolio averages:', avgs);

          // Prefetch images for the first 12 properties for display
          const first = list.slice(0, 12);
          const imageEntries: Record<string, string> = {};
          await Promise.all(
            first.map(async (p: PortfolioProperty) => {
              const det = await getPropertyDetails(String(p.id));
              const pics = (det?.picture || det?.propertyPictures || []) as Array<{ imageData?: string }>;
              const url = pics.find((ph) => typeof ph?.imageData === 'string' && (ph.imageData as string).length > 0)?.imageData as string | undefined;
              if (url) imageEntries[String(p.id)] = url;
            })
          );
          setPortfolioImages(imageEntries);
          // eslint-disable-next-line no-console
          console.log('[InvestorsDashboard] Prefetched images for listings:', Object.keys(imageEntries).length, Object.values(imageEntries).slice(0, 3));

          // Resolve city/country names for location labels (best-effort)
          const uniqueCityIds = Array.from(new Set(list.map((p) => p.cityId).filter((v): v is number => typeof v === 'number')));
          const uniqueCountryIds = Array.from(new Set(list.map((p) => p.countryId).filter((v): v is number => typeof v === 'number')));
          const newCityMap: Record<number, string> = { ...cityMap };
          const newCountryMap: Record<number, string> = { ...countryMap };
          await Promise.all([
            ...uniqueCityIds
              .filter((id: number) => !newCityMap[id])
              .map(async (id: number) => {
                try {
                  const r = await api.get(`/cities/retrieve/${id}`);
                  if (r?.data?.name) newCityMap[id] = String(r.data.name);
                } catch {}
              }),
            ...uniqueCountryIds
              .filter((id: number) => !newCountryMap[id])
              .map(async (id: number) => {
                try {
                  const r = await api.get(`/countries/retrieve/${id}`);
                  if (r?.data?.name) newCountryMap[id] = String(r.data.name);
                } catch {}
              }),
          ]);
          setCityMap(newCityMap);
          setCountryMap(newCountryMap);
          // eslint-disable-next-line no-console
          console.log('[InvestorsDashboard] Resolved names:', { cities: Object.keys(newCityMap).length, countries: Object.keys(newCountryMap).length });
          // Background: compute analytics for agency portfolio (saves, views, CTR, leads)
          void (async () => {
            try {
              const savesEntries = await Promise.all(list.map(async (p) => {
                const pid = String(p.id);
                const arr = await getSavesForProperty(pid);
                return [pid, Array.isArray(arr) ? arr.length : 0] as const;
              }));
              const countsSaved = savesEntries.map(([, cnt]) => cnt);
              setPortfolioSavesCount(Object.fromEntries(savesEntries));
              const totalSaves = countsSaved.reduce((a, b) => a + b, 0);
              setTotalSavesPortfolio(totalSaves);
              setAvgSavesPortfolio(list.length ? totalSaves / list.length : 0);

              const perf = await Promise.all(list.map(async (p) => {
                const r = await getPerformanceForProperty(String(p.id));
                return r || { views: 0, inquiries: 0 };
              }));
              const totalViews = perf.reduce((sum, row) => sum + (typeof row.views === 'number' ? row.views : 0), 0);
              setTotalViewsPortfolio(totalViews);
              setAvgViewsPortfolio(list.length ? totalViews / list.length : 0);
              setAvgInquiriesPortfolio(list.length ? perf.reduce((s, r) => s + (typeof r.inquiries === 'number' ? r.inquiries : 0), 0) / list.length : 0);

              const ctrs = await Promise.all(list.map(async (p) => {
                const c = await getCtrForProperty(String(p.id));
                return typeof c?.ctr === 'number' ? c.ctr : null;
              }));
              const ctrVals = ctrs.filter((v): v is number => typeof v === 'number' && !isNaN(v));
              setAvgCtrPortfolio(ctrVals.length ? ctrVals.reduce((a, b) => a + b, 0) / ctrVals.length : 0);

              const leads = await Promise.all(list.map(async (p) => {
                const a = await getActiveLeadsForProperty(String(p.id));
                return typeof a?.lead === 'number' ? a.lead : 0;
              }));
              setTotalActiveLeadsPortfolio(leads.reduce((a, b) => a + b, 0));
            } catch {
              setTotalSavesPortfolio(0);
              setAvgSavesPortfolio(0);
              setTotalViewsPortfolio(0);
              setAvgViewsPortfolio(0);
              setAvgCtrPortfolio(0);
              setTotalActiveLeadsPortfolio(0);
              setAvgInquiriesPortfolio(0);
            }
          })();
        } else {
          // eslint-disable-next-line no-console
          console.log('[InvestorsDashboard] Skipped portfolio fetch — no agency context resolved');
        }
      } catch (e) {
        // ignore portfolio errors for now
      }

      // Likes section: For regular users, load saved properties and their save counts
      try {
        const roleFromUser = fetchedUser?.role || payload?.role || localStorage.getItem('role') || undefined;
        if (roleFromUser && roleFromUser !== 'AGENT') {
          // eslint-disable-next-line no-console
          console.log('[InvestorsDashboard] Fetching liked properties for userId:', entityId);
          const saved = await getSavedForUser(entityId);
          const propertyIds = Array.from(new Set(saved.map(s => String(s.propertyId)).filter(Boolean)));
          // eslint-disable-next-line no-console
          console.log('[InvestorsDashboard] Liked property IDs:', propertyIds);

          // Fetch details, images and save counts in parallel (limit to first 12 for UI)
          const firstIds = propertyIds.slice(0, 12);
          const details = await Promise.all(firstIds.map(async (pid) => {
            const det = await getPropertyDetails(pid);
            return { pid, det } as const;
          }));
          const savesCountsEntries = await Promise.all(firstIds.map(async (pid) => {
            const arr = await getSavesForProperty(pid);
            return [pid, Array.isArray(arr) ? arr.length : 0] as const;
          }));
          const imagesMap: Record<string, string> = {};
          const props: PortfolioProperty[] = [];
          for (const { pid, det } of details) {
            if (det) {
              const pics = (det?.picture || det?.propertyPictures || []) as Array<{ imageData?: string }>;
              const url = pics.find((ph) => typeof ph?.imageData === 'string' && (ph.imageData as string).length > 0)?.imageData as string | undefined;
              if (url) imagesMap[pid] = url;
              // Build minimal base property to render
              const base: PortfolioProperty = {
                id: det?.id ?? pid,
                title: det?.title ?? `Property ${pid.slice(0, 6)}`,
                price: det?.price ?? 0,
                cityId: det?.cityId ?? 0,
                countryId: det?.countryId ?? 0,
              };
              props.push(base);
            }
          }
          setLikedImages(imagesMap);
          setLikedProperties(props);
          setLikedSavesCount(Object.fromEntries(savesCountsEntries));
          // Resolve city/country names (reuse maps)
          const uniqueCityIds = Array.from(new Set(props.map((p) => p.cityId).filter((v): v is number => typeof v === 'number')));
          const uniqueCountryIds = Array.from(new Set(props.map((p) => p.countryId).filter((v): v is number => typeof v === 'number')));
          const newCityMap: Record<number, string> = { ...cityMap };
          const newCountryMap: Record<number, string> = { ...countryMap };
          await Promise.all([
            ...uniqueCityIds
              .filter((id: number) => !newCityMap[id])
              .map(async (id: number) => {
                try {
                  const r = await api.get(`/cities/retrieve/${id}`);
                  if (r?.data?.name) newCityMap[id] = String(r.data.name);
                } catch {}
              }),
            ...uniqueCountryIds
              .filter((id: number) => !newCountryMap[id])
              .map(async (id: number) => {
                try {
                  const r = await api.get(`/countries/retrieve/${id}`);
                  if (r?.data?.name) newCountryMap[id] = String(r.data.name);
                } catch {}
              }),
          ]);
          setCityMap(newCityMap);
          setCountryMap(newCountryMap);
          // eslint-disable-next-line no-console
          console.log('[InvestorsDashboard] Liked properties loaded:', { count: props.length });
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('[InvestorsDashboard] Failed to load liked properties', e);
      }
      // Regardless of outcome, mark role as resolved to avoid UI flicker
      if (!cancelled) setRoleReady(true);
    })();

    return () => { cancelled = true; };
  }, []);

  // If role becomes available from any source, mark ready
  React.useEffect(() => {
    if (typeof profileRole === 'string' && profileRole.length) {
      setRoleReady(true);
    }
  }, [profileRole]);

  if (!roleReady) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', bgcolor: 'background.default' }}>
        <CircularProgress size={28} sx={{ color: 'text.secondary' }} />
        <Typography sx={{ ml: 2, color: 'text.secondary', fontWeight: 500 }}>Loading dashboard…</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ fontFamily: 'Montserrat, sans-serif', height: '100vh', overflow: 'hidden' }}>
      {/* Open button fixed on page to open the sidebar */}
      <Box sx={{ position: 'fixed', left: 12, top: 14, zIndex: 1400, mt:1 }}>
        {!sidebarVisible && headerMenuButton}
      </Box>

      <Grid container sx={{ width: '100vw', height: '100%' }} columns={{ xs: 12, md: 12, lg: 20 }}>
        {/* Sidebar area */}
        <Grid
          size={{ xs: 12, md: sidebarVisible ? 4 : 0, lg: sidebarVisible ? 5 : 0 }}
          sx={{
            display: { xs: sidebarVisible ? 'block' : 'none', md: sidebarVisible ? 'block' : 'none' },
          }}
        >
          <Box
            sx={{
              height: '100vh',
              position: 'fixed',
              top: 0,
              left: 0,
              width: { xs: '100vw', md: '33.3333vw', lg: '22vw' },
              zIndex: 1200,
              overflow: 'hidden',
            }}
          >
            <StaggeredMenu
              position="left"
              colors={[sidebarColorMain, sidebarColorDark]}
              sections={sections}
              activeItem={{ sectionTitle: 'DASHBOARD', label: dashboardTab }}
              profileName={profileName || 'User'}
              profileEmail={profileEmail || ''}
              onProfileClick={() => router.push('/user')}
              onItemSelect={(item, meta) => {
                if (meta.sectionTitle === 'DASHBOARD') {
                  setDashboardTab(item.label);
                } else if (item.link && item.link.startsWith('/')) {
                  router.push(item.link);
                }
              }}
              displayItemNumbering={false}
              displaySocials={false}
              isFixed={false}
              showHeader={true}
              headerTitle="Nomad Estate"
              headerOnClick={() => router.push('/')}
              headerCtaLabel={isMdUp ? 'Chat with AI' : undefined}
                headerCtaHoverColor={isAgent ? theme.palette.primary.main : theme.palette.secondary.main}
              headerCtaOnClick={() => {
                try {
                  router.push('/sorry');
                } catch {}
              }}
              fitContainer
              panelStyle={{ width: '100%', height: '100vh' }}
              prelayersStyle={{ width: '100%', height: '100vh' }}
              itemStyle={{
                color: theme.palette.common.white,
                letterSpacing: 0,
                textTransform: 'none',
                fontWeight: 500,
                fontSize: isXs ? 16 : 14, 
              }}
              // The accent and colors
              accentColor={sidebarColorMain}
              menuButtonColor={theme.palette.text.primary}
              openMenuButtonColor={sidebarColorMain}
              open={isSidebarOpen}
              onOpenChange={(open) => {
                setIsSidebarOpen(open);
                if (open) setSidebarVisible(true);
              }}
              onAfterClose={() => setSidebarVisible(false)}
            />
          </Box>
        </Grid>
        {/* Main content area */}
        <Grid
          size={{ xs: 12, md: sidebarVisible ? 8 : 12, lg: sidebarVisible ? 15 : 20 }}
          sx={{ position: 'relative', height: '100%', maxHeight: '100%', overflowY: 'auto' }}
        >
          <Box sx={{ py: 3, pr: { xs: sidebarVisible ? 4 : 2, md: sidebarVisible ? 5 : 10 }, pl: sidebarVisible ? {xs:2, lg:0} : { xs: 2, md: 10 }, mx: 0 }}>
            {dashboardTab === 'Market Insights' ? (
              <>
                {/* Right-aligned section header with avatar/profile */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1.5, mb: 4, mt:1 }}>
                  <Typography variant="h6" sx={{ color: 'text.info' }}>
                    Market Insights
                  </Typography>
                  <IconButton aria-label="Open profile" onClick={() => router.push('/user')} sx={{ p: 0 }}>
                    <Avatar
                      src={profileAvatarUrl || undefined}
                      sx={{
                        width: 36,
                        height: 36,
                        bgcolor: isAgent ? theme.palette.primary.main : '#e5e7eb',
                        color: isAgent ? theme.palette.common.white : theme.palette.text.primary,
                        fontWeight: 600,
                      }}
                    >
                      {!profileAvatarUrl ? (profileName?.trim()?.charAt(0) || 'U').toUpperCase() : null}
                    </Avatar>
                  </IconButton>
                </Box>
                
                <TopCities colorScheme={isAgent ? 'primary' : 'secondary'} />
                <Grid container spacing={3} sx={{ mt: 2 }}>
                  <Grid size={{ xs: 12, lg: 15 }}>
                    <YieldGraph colorScheme={isAgent ? 'primary' : 'secondary'} />
                  </Grid>
                </Grid>
                <TopMetrics
                  colorScheme={isAgent ? 'primary' : 'secondary'}
                  metrics={(() => {
                    if (!globalInsights) return [];
                    const fmtPct = (n: number) => `${(n || 0).toFixed(1)}%`;
                    return [
                      { label: 'Total Properties', value: globalInsights.propertyCount },
                      { label: 'Avg. ROI', value: fmtPct(globalInsights.avgROI) },
                      { label: 'Avg. Rental Yield', value: fmtPct(globalInsights.avgRentalYield) },
                      { label: 'Avg. CTR', value: (globalInsights.avgCTR || 0).toFixed(1) },
                      { label: 'Active Leads', value: Math.round(globalInsights.activeLeads || 0) },
                      { label: 'Avg. Inquiries', value: (globalInsights.avgInquiries || 0).toFixed(1) },
                    ];
                  })()}
                />
                <Grid container spacing={3} sx={{ mt: 2 }}>
                  <Grid size={{ xs: 12, lg: 15 }}>
                    <VolumeGraph colorScheme={isAgent ? 'primary' : 'secondary'} />
                  </Grid>
                </Grid>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'baseline', gap: 1, mt: 4, flexWrap: 'nowrap' }}>
                  <Typography component="span" variant="subtitle1" sx={{ fontWeight: 300, color: theme.palette.grey[200], fontStyle: 'italic', fontSize:'12px', whiteSpace: 'nowrap' }}>
                    Real Time Data Provided By
                  </Typography>
                  <Typography component="span" variant="subtitle1" sx={{ fontWeight: 500, color: 'primary.main', whiteSpace: 'nowrap' }}>
                    Nomad Estate
                  </Typography>
                </Box>
                
              </>
            ) : dashboardTab === 'Listings' ? (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1.5, mb: 4, mt:1 }}>
                  <Typography variant="h6" sx={{ color: 'text.info' }}>
                    Listings
                  </Typography>
                  <IconButton aria-label="Open profile" onClick={() => router.push('/user')} sx={{ p: 0 }}>
                    <Avatar
                      src={profileAvatarUrl || undefined}
                      sx={{
                        width: 36,
                        height: 36,
                        bgcolor:'#e5e7eb',
                        color:theme.palette.text.primary,
                        fontWeight: 600,
                      }}
                    >
                      {!profileAvatarUrl ? (profileName?.trim()?.charAt(0) || 'U').toUpperCase() : null}
                    </Avatar>
                  </IconButton>
                </Box>
                <Typography variant="subtitle2" gutterBottom sx={{ color: isAgent ? theme.palette.primary.main : theme.palette.text.secondary, mb: 2 }}>
                  Average Portfolio Insights
                </Typography>
                {(() => {
                  const fmtPct = (n: number) => `${(n || 0).toFixed(1)}%`;
                  // First line: 6 items (md:2 each)
                  const row1 = [
                    { label: 'Portfolio Size', value: agencyPortfolio.length },
                    { label: 'Avg. ROI', value: fmtPct(averages.yield ?? 0) },
                    { label: 'Avg. Score', value: (averages.score ?? 0).toFixed(1) },
                    { label: 'Total Views', value: Math.round(totalViewsPortfolio) },
                    { label: 'Total Saves', value: Math.round(totalSavesPortfolio) },
                      { label: 'Avg. CTR', value: (avgCtrPortfolio || 0).toFixed(1) },
                  ];
                  // Second line: 4 items (md:3 each)
                  const row2 = [
                    { label: 'Avg. Views', value: (avgViewsPortfolio || 0).toFixed(1) },
                    { label: 'Avg. Saves', value: (avgSavesPortfolio || 0).toFixed(1) },
                    { label: 'Active Leads', value: Math.round(totalActiveLeadsPortfolio) },
                    { label: 'Avg. Inquiries', value: (avgInquiriesPortfolio || 0).toFixed(1) },
                  ];
                  return (
                    <>
                      <TopMetrics colorScheme={'primary'} metrics={row1} gridMd={2} />
                      <Grid container sx={{border: `1px solid`, borderColor:"#c2c2c265", p:2, mt:1, borderRadius:4, mb:4}}>
                        <Grid size={{xs:6, md:3}} sx={{borderRight: `1px solid`, borderColor:"#c2c2c265", pr:2, mt:0.5, display:'flex', justifyContent:'center'}}>
                          <Stack sx={{textAlign:'center'}}><Typography variant="h6" sx={{fontWeight:600, color: "primary.main"}}>{row2[0].value}</Typography>
                           <Typography variant="body2" sx={{ color: 'text.secondary' }}> {row2[0].label}</Typography>
                           
                           </Stack>
                        </Grid>
                        <Grid size={{xs:6, md:3}} sx={{borderRight: { md:`1px solid`}, borderColor:{md:"#c2c2c265"}, px:2, mt:0.5, display:'flex', justifyContent:'center'}}>
                          <Stack sx={{textAlign:'center'}}> <Typography variant="h6" sx={{fontWeight:600, color: "primary.main"}}>{row2[1].value}</Typography>
                           <Typography variant="body2" sx={{ color: 'text.secondary' }}> {row2[1].label}</Typography>
                          
                           </Stack>
                        </Grid>
                        <Grid size={{xs:6, md:3}} sx={{borderRight: `1px solid`, borderColor:"#c2c2c265", px:2, mt:0.5, display:'flex', justifyContent:'center'}}>
                          <Stack sx={{textAlign:'center'}}> <Typography variant="h6" sx={{fontWeight:600, color: "primary.main"}}>{row2[2].value}</Typography>
                           <Typography variant="body2" sx={{ color: 'text.secondary' }}> {row2[2].label}</Typography>
                          
                           </Stack>
                        </Grid>
                        <Grid size={{xs:6, md:3}} sx={{pl:2, mt:0.5, display:'flex', justifyContent:'center'}}>
                          <Stack sx={{textAlign:'center'}}><Typography variant="h6" sx={{fontWeight:600, color: "primary.main"}}>{row2[3].value}</Typography>
                           <Typography variant="body2" sx={{ color: 'text.secondary' }}> {row2[3].label}</Typography>
                           
                           </Stack>
                        </Grid>
                      </Grid>
                    </>
                  );
                })()}
                
                {editingPropertyId ? (
                  <Box sx={{ color: theme.palette.text.primary }}>
                    <Box sx={{ mb: 3 }}>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          clearEditParam();
                        }}
                        startIcon={<ArrowBackIcon />}
                        sx={{ borderRadius: 2 }}
                      >
                        Back to Listings
                      </Button>
                    </Box>
                    <EditPropertyForm
                      propertyId={editingPropertyId}
                      onCancel={() => {
                        clearEditParam();
                      }}
                      onSuccess={async () => {
                        clearEditParam();
                        await reloadPortfolio();
                      }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'baseline', gap: 1, mt: 4, flexWrap: 'nowrap' }}>
                      <Typography component="span" variant="subtitle1" sx={{ fontWeight: 300, color: theme.palette.grey[200], fontStyle: 'italic', fontSize: '12px', whiteSpace: 'nowrap' }}>
                        Global Investment Platform
                      </Typography>
                      <Typography component="span" variant="subtitle1" sx={{ fontWeight: 500, color: 'primary.main', whiteSpace: 'nowrap' }}>
                        Nomad Estate
                      </Typography>
                    </Box>
                  </Box>
                ) : !showCreateProperty ? (
                  <>
                    <Typography variant="subtitle2" gutterBottom sx={{ color: isAgent ? theme.palette.primary.main : theme.palette.text.secondary, mb: 2 }}>
                      Portfolio
                    </Typography>
                    {/* Listings Grid */}
                    <Grid container spacing={3}>
                      {/* Add New Listing Card */}
                      <Grid size={{ xs: 12, sm: 4, md: 3 }}>
                        <ListingCard
                          isAddCard
                          title="Add New Listing"
                          location=""
                          price=""
                          likes={0}
                          saves={0}
                          colorScheme={isAgent ? 'primary' : 'secondary'}
                          onAddClick={() => setShowCreateProperty(true)}
                        />
                      </Grid>

                      {/* Portfolio Listing Cards (real data) */}
                      {agencyPortfolio.map((p) => {
                        const id = String(p.id);
                        const city = cityMap[p.cityId as number] || `City #${p.cityId}`;
                        const country = countryMap[p.countryId as number] || '';
                        const location = country ? `${city}, ${country}` : city;
                        const price = typeof p.price === 'number' ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(p.price) : String(p.price ?? '');
                        const imageUrl = portfolioImages[id];
                        return (
                          <Grid key={id} size={{ xs: 12, sm: 4, md: 3 }}>
                            <ListingCard
                              id={id}
                              title={p.title || `Property ${id.slice(0, 6)}`}
                              location={location}
                              price={price}
                              likes={0}
                              saves={portfolioSavesCount[id] ?? 0}
                              imageUrl={imageUrl}
                              colorScheme={isAgent ? 'primary' : 'secondary'}
                              onEdit={handleStartEdit}
                              onDelete={handleDeleteListing}
                            />
                          </Grid>
                        );
                      })}
                    </Grid>
                  </>
                ) : (
                  <Box sx={{ color: theme.palette.text.primary }}>
                    <Box sx={{ mb: 3 }}>
                      <Button 
                        variant="outlined" 
                        onClick={() => setShowCreateProperty(false)}
                        startIcon={<ArrowBackIcon />}
                        sx={{borderRadius: 2}}
                      >
                        Back to Listings
                      </Button>
                    </Box>
                    <CreatePropertyForm 
                      onCancel={() => setShowCreateProperty(false)}
                      onSuccess={async () => {
                        setShowCreateProperty(false);
                        await reloadPortfolio();
                      }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'baseline', gap: 1, mt: 4, flexWrap: 'nowrap' }}>
                  <Typography component="span" variant="subtitle1" sx={{ fontWeight: 300, color: theme.palette.grey[200], fontStyle: 'italic', fontSize:'12px', whiteSpace: 'nowrap' }}>
                    Global Investment Platform
                  </Typography>
                  <Typography component="span" variant="subtitle1" sx={{ fontWeight: 500, color: 'primary.main', whiteSpace: 'nowrap' }}>
                    Nomad Estate
                  </Typography>
                </Box>
                  </Box>
                  
                )}
              </>
            ) : (
              dashboardTab === 'Agents' && isAgent ? (
                <>
                  <AgentsManager 
                    agencyId={agencyIdForPortfolio || ''} 
                    colorScheme={isAgent ? 'primary' : 'secondary'}
                    profileName={profileName}
                    profileAvatarUrl={profileAvatarUrl}
                    onProfileClick={() => router.push('/user')}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'baseline', gap: 1, mt: 4, flexWrap: 'nowrap' }}>
                    <Typography component="span" variant="subtitle1" sx={{ fontWeight: 300, color: theme.palette.grey[200], fontStyle: 'italic', fontSize:'12px', whiteSpace: 'nowrap' }}>
                      Global Investment Platform
                    </Typography>
                    <Typography component="span" variant="subtitle1" sx={{ fontWeight: 500, color: 'primary.main', whiteSpace: 'nowrap' }}>
                      Nomad Estate
                    </Typography>
                  </Box>
                </>
              ) : dashboardTab === 'Liked Properties & Inquiries' ? (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1.5, mb: 4, mt:1 }}>
                    <Typography variant="h6" sx={{ color: 'text.info' }}>
                      Liked Properties & Inquiries
                    </Typography>
                    <IconButton aria-label="Open profile" onClick={() => router.push('/user')} sx={{ p: 0 }}>
                      <Avatar
                        src={profileAvatarUrl || undefined}
                        sx={{
                          width: 36,
                          height: 36,
                          bgcolor:'#e5e7eb',
                          color:theme.palette.text.primary,
                          fontWeight: 600,
                        }}
                      >
                        {!profileAvatarUrl ? (profileName?.trim()?.charAt(0) || 'U').toUpperCase() : null}
                      </Avatar>
                    </IconButton>
                  </Box>
                  <Typography variant="subtitle2" gutterBottom sx={{ color: theme.palette.text.secondary, mb: 2 }}>
                    Your saved properties
                  </Typography>
                  <Grid container spacing={3}>
                    {likedProperties.length === 0 ? (
                      <Grid size={{ xs: 12 }}>
                        <Box sx={{ color: theme.palette.text.secondary, fontStyle: 'italic' }}>
                          You haven’t saved any properties yet.
                        </Box>
                      </Grid>
                    ) : (
                      likedProperties.map((p) => {
                        const id = String(p.id);
                        const city = cityMap[p.cityId as number] || `City #${p.cityId}`;
                        const country = countryMap[p.countryId as number] || '';
                        const location = country ? `${city}, ${country}` : city;
                        const price = typeof p.price === 'number' ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(p.price) : String(p.price ?? '');
                        const imageUrl = likedImages[id];
                        const bedrooms = typeof p.bedrooms === 'number' ? p.bedrooms : undefined;
                        const bathrooms = typeof p.bathrooms === 'number' ? p.bathrooms : undefined;
                        const totalArea = (p as unknown as { totalArea?: number }).totalArea;
                        const yieldPct = typeof p.yield === 'number' ? p.yield : undefined;
                        return (
                          <Grid key={id} size={{ xs: 12, sm: 6, md: 4 }}>
                            <PropertyCard
                              variant="liked"
                              propertyId={id}
                              title={p.title || `Property ${id.slice(0, 6)}`}
                              city={location}
                              price={price}
                              imageUrl={imageUrl}
                              bedrooms={bedrooms}
                              bathrooms={bathrooms}
                              totalArea={totalArea}
                              yieldPct={yieldPct}
                              colorScheme="secondary"
                              isSaved={true}
                              onViewDetails={(propId) => router.push(`/details/${propId}`)}
                              onUnsave={async (propId) => {
                                try {
                                  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
                                  if (!userId) return;
                                  const ok = await unsavePropertyForUser(userId, propId);
                                  if (ok) {
                                    setLikedProperties(prev => prev.filter(x => String(x.id) !== propId));
                                    setLikedImages(prev => { const next = { ...prev }; delete next[propId]; return next; });
                                    setLikedSavesCount(prev => { const next = { ...prev }; delete next[propId]; return next; });
                                  }
                                } catch {}
                              }}
                            />
                          </Grid>
                        );
                      })
                    )}
                  </Grid>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'baseline', gap: 1, mt: 4, flexWrap: 'nowrap' }}>
                    <Typography component="span" variant="subtitle1" sx={{ fontWeight: 300, color: theme.palette.grey[200], fontStyle: 'italic', fontSize:'12px', whiteSpace: 'nowrap' }}>
                      Global Investment Platform
                    </Typography>
                    <Typography component="span" variant="subtitle1" sx={{ fontWeight: 500, color: 'primary.main', whiteSpace: 'nowrap' }}>
                      Nomad Estate
                    </Typography>
                  </Box>
                </>
              ) : (
                <Box sx={{ color: theme.palette.text.primary, fontSize: 16, opacity: 0.9 }}>
                  Placeholder content for: {dashboardTab}
                </Box>
              )
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}