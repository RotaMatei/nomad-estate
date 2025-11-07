export interface Location {
  id: number;
  name: string;
  lat: number;
  lng: number;
}

export interface MapProps {
  locations: Location[];
  zoom: number;
  onSelect?: (id: number) => void;
}