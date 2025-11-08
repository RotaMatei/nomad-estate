import api from '@/app/lib/api';

function getSubjectIdFromToken(): string | null {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const [, payload] = token.split('.');
    const json = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return json?.sub ? String(json.sub) : null;
  } catch {
    return null;
  }
}

export interface TrendPoint { label: string; value: number }

interface RawTrend { month?: string; label?: string; period?: string; date?: string; yield?: number | string; value?: number | string; metric?: number | string }
export async function getMarketTrend(): Promise<TrendPoint[] | null> {
  const id = getSubjectIdFromToken();
  if (!id) return null;
  try {
    const res = await api.get(`/analytics/marketTrend/retrieve/${id}`);
    const arr: RawTrend[] = Array.isArray(res.data) ? res.data : [];
    return arr
      .map((d: RawTrend) => {
        const label = d.month || d.label || d.period || d.date;
        const rawVal = d.yield ?? d.value ?? d.metric;
        const num = typeof rawVal === 'string' ? Number(rawVal) : rawVal;
        if (!label || !isFinite(Number(num))) return null;
        return { label, value: Number(num) };
      })
      .filter((t): t is TrendPoint => !!t);
  } catch {
    return null;
  }
}

interface RawVolume { quarter?: string; label?: string; period?: string; date?: string; volume?: number | string; value?: number | string; metric?: number | string }
export async function getInvestmentVolume(): Promise<TrendPoint[] | null> {
  const id = getSubjectIdFromToken();
  if (!id) return null;
  try {
    const res = await api.get(`/analytics/investmentVolume/retrieve/${id}`);
    const arr: RawVolume[] = Array.isArray(res.data) ? res.data : [];
    return arr
      .map((d: RawVolume) => {
        const label = d.quarter || d.label || d.period || d.date;
        const rawVal = d.volume ?? d.value ?? d.metric;
        const num = typeof rawVal === 'string' ? Number(rawVal) : rawVal;
        if (!label || !isFinite(Number(num))) return null;
        return { label, value: Number(num) };
      })
      .filter((t): t is TrendPoint => !!t);
  } catch {
    return null;
  }
}

export interface TopMetricsData {
  globalMarkets?: number | string | null;
  avgROI?: number | string | null;
  vacationCities?: number | string | null;
  endROI?: number | string | null;
  avgAppreciation?: number | string | null;
  avgRentalYield?: number | string | null;
}

interface RawPerformance { avgROI?: number | string; roi?: number | string; vacationCities?: number | string; endROI?: number | string; avgAppreciation?: number | string; appreciation?: number | string; avgRentalYield?: number | string }
interface RawCtr { globalMarkets?: number | string; marketsCount?: number | string; count?: number | string }
interface RawTrendMetric { yield?: number | string; value?: number | string }
export async function getTopMetrics(): Promise<TopMetricsData | null> {
  const id = getSubjectIdFromToken();
  if (!id) return null;
  try {
    // Fetch multiple analytics in parallel
    const [perfRes, ctrRes, trendRes] = await Promise.all([
      api.get(`/analytics/performance/retrieve/${id}`).catch(() => ({ data: null })),
      api.get(`/analytics/ctr/retrieve/${id}`).catch(() => ({ data: null })),
      api.get(`/analytics/marketTrend/retrieve/${id}`).catch(() => ({ data: null })),
    ]);

    const perf: RawPerformance | null = perfRes.data ? (perfRes.data as RawPerformance) : null;
    const ctr: RawCtr | null = ctrRes.data ? (ctrRes.data as RawCtr) : null;
    const trend: RawTrendMetric[] = Array.isArray(trendRes.data) ? (trendRes.data as RawTrendMetric[]) : [];

    const avgYield = trend.length
      ? (trend.reduce((acc: number, it) => acc + Number(it.yield ?? it.value ?? 0), 0) / trend.length)
      : null;

    return {
      globalMarkets: ctr?.globalMarkets ?? ctr?.marketsCount ?? ctr?.count ?? null,
      avgROI: perf?.avgROI ?? perf?.roi ?? null,
      vacationCities: perf?.vacationCities ?? null,
      endROI: perf?.endROI ?? null,
      avgAppreciation: perf?.avgAppreciation ?? perf?.appreciation ?? null,
      avgRentalYield: perf?.avgRentalYield ?? (avgYield ? `${avgYield.toFixed(1)}%` : null),
    };
  } catch {
    return null;
  }
}
