import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import { useEffect, useMemo, useState } from "react";
import L from "leaflet";
import useOrderRoute from "../../../hooks/useOrderRoute";
import "./TrackMap.scss";

/* Reduce route points aggressively */
const simplifyRoute = (coords, step = 12) => {
const simplified = [];
for (let i = 0; i < coords.length; i += step) {
simplified.push(coords[i]);
}
if (coords.length) simplified.push(coords[coords.length - 1]);
return simplified;
};

/* Fit route inside map */
const FitRouteBounds = ({ positions }) => {
const map = useMap();

useEffect(() => {
if (!positions.length) return;


const timer = setTimeout(() => {
  map.fitBounds(positions, { padding: [30, 30], maxZoom: 14 });
  map.invalidateSize();
}, 200);

return () => clearTimeout(timer);


}, [positions, map]);

return null;
};

const TrackMap = ({ orderId }) => {

const { route, loading, error } = useOrderRoute(orderId);

const polylinePositions = useMemo(() => {
if (!route) return [];
const coords = route.geometry.map(([lng, lat]) => [lat, lng]);
return simplifyRoute(coords, 12);
}, [route]);

const [barberIndex, setBarberIndex] = useState(0);

useEffect(() => {
if (!polylinePositions.length) return;


const interval = setInterval(() => {
  setBarberIndex(prev =>
    prev >= polylinePositions.length - 1 ? prev : prev + 1
  );
}, 700);

return () => clearInterval(interval);


}, [polylinePositions]);

const barberPosition = polylinePositions[barberIndex];
const customerPosition =
polylinePositions[polylinePositions.length - 1];

const barberIcon = useMemo(() =>
new L.Icon({
iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
iconSize: [32, 32]
}), []
);

const customerIcon = useMemo(() =>
new L.Icon({
iconUrl: "https://cdn-icons-png.flaticon.com/512/535/535239.png",
iconSize: [32, 32]
}), []
);

/* Purnea district bounds */
const purneaBounds = [
[25.35, 86.90],
[25.95, 87.70]
];

if (loading) return <p>Loading map...</p>;
if (error) return <p>{error}</p>;
if (!route) return null;

return ( <div className="track-map-container">
<MapContainer
zoom={12}
minZoom={11}
maxZoom={15}
maxBounds={purneaBounds}
maxBoundsViscosity={1.0}
style={{ height: "100%", width: "100%" }}
>

    <FitRouteBounds positions={polylinePositions} />

    <TileLayer
      attribution="&copy; OpenStreetMap contributors"
      url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      subdomains="abcd"
      updateWhenIdle={true}
      updateWhenZooming={false}
      keepBuffer={2}
    />

    {barberPosition && (
      <Marker position={barberPosition} icon={barberIcon} />
    )}

    {customerPosition && (
      <Marker position={customerPosition} icon={customerIcon} />
    )}

    {polylinePositions.length > 0 && (
      <Polyline
        positions={polylinePositions}
        pathOptions={{
          color: "#2563eb",
          weight: 5
        }}
      />
    )}

  </MapContainer>
</div>

);
};

export default TrackMap;
