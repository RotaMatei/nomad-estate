import { useState, useCallback, useEffect } from 'react';
import { PortfolioProperty, getPortfolioForAgency } from '@/app/lib/propertyApi';

export interface PortfolioState {
  portfolio: PortfolioProperty[];
  images: Record<string, string>;
  savesCount: Record<string, number>;
  cityMap: Record<number, string>;
  countryMap: Record<number, string>;
  loading: boolean;
  error: string | null;
}

export interface PortfolioMetrics {
  avgSaves: number;
  totalSaves: number;
  totalViews: number;
  avgViews: number;
  avgCtr: number;
  totalActiveLeads: number;
  avgInquiries: number;
}

/**
 * Hook for managing agency portfolio data
 */
export function usePortfolio(agencyId: string | null) {
  const [state, setState] = useState<PortfolioState>({
    portfolio: [],
    images: {},
    savesCount: {},
    cityMap: {},
    countryMap: {},
    loading: false,
    error: null,
  });

  const [metrics, setMetrics] = useState<PortfolioMetrics>({
    avgSaves: 0,
    totalSaves: 0,
    totalViews: 0,
    avgViews: 0,
    avgCtr: 0,
    totalActiveLeads: 0,
    avgInquiries: 0,
  });

  const reloadPortfolio = useCallback(async () => {
    if (!agencyId) {
      setState((prev) => ({ ...prev, portfolio: [], loading: false }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const list = await getPortfolioForAgency(agencyId);
      if (!Array.isArray(list)) {
        setState((prev) => ({ ...prev, portfolio: [], loading: false }));
        return;
      }

      // Extract images, city/country maps
      const newImages: Record<string, string> = {};
      const newCityMap: Record<number, string> = {};
      const newCountryMap: Record<number, string> = {};

      list.forEach((p: PortfolioProperty) => {
        const pid = String(p.id);
        if (p.picture?.[0]?.imageData) {
          newImages[pid] = String(p.picture[0].imageData);
        }
        if (typeof p.cityId === 'number' && p.city?.name) {
          newCityMap[p.cityId] = String(p.city.name);
        }
        if (typeof p.countryId === 'number' && p.country?.name) {
          newCountryMap[p.countryId] = String(p.country.name);
        }
      });

      setState({
        portfolio: list,
        images: newImages,
        savesCount: {},
        cityMap: newCityMap,
        countryMap: newCountryMap,
        loading: false,
        error: null,
      });

      // Load metrics asynchronously (non-blocking)
      // This would be called separately with usePortfolioMetrics hook
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load portfolio';
      setState((prev) => ({
        ...prev,
        portfolio: [],
        loading: false,
        error: message,
      }));
    }
  }, [agencyId]);

  useEffect(() => {
    reloadPortfolio();
  }, [reloadPortfolio]);

  return {
    ...state,
    metrics,
    reloadPortfolio,
    setMetrics,
  };
}
