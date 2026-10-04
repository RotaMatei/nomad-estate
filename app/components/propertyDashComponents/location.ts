export interface Location {
  id: number;
  name: string;
  lat: number;
  lng: number;
  /**
   * ISO country code used to color the country polygons on map/globe.
   * Typically ISO_A2 (e.g. "RO", "US"), but we keep it flexible since backend may vary.
   */
  countryCode?: string;
  countryId?: number;
}

export interface MapProps {
  locations: Location[];
  zoom: number;
  highlightCountryCodes?: string[];
  /**
   * When set, the Leaflet map should center/fit to this country polygon.
   * Typically derived from matching countries in the current search.
   */
  focusCountryCode?: string | null;
  onSelect?: (id: number) => void;
}