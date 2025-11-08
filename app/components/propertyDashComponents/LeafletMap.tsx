import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { MapProps } from "./location";

const LeafletMap = ({ locations, zoom }: MapProps) => {
  const center: [number, number] = [
    locations[0]?.lat ?? 0,
    locations[0]?.lng ?? 0,
  ];

  return (
    <MapContainer center={center} zoom={zoom} style={{ height: "100%", width: "100%" }}>
      <TileLayer 
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://carto.com/">CartoDB</a>' />
      {locations.map(loc => (
        <Marker key={loc.id} position={[loc.lat, loc.lng] as [number, number]} />
      ))}
    </MapContainer>
  );
};

export default LeafletMap;