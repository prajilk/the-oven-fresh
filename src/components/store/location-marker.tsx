import L from 'leaflet';
import { useEffect } from 'react';
import { Marker, Popup, useMapEvents } from 'react-leaflet';

const storeIcon = new L.Icon({
  iconUrl: '/leaflet/store.svg',
  iconSize: [40, 40],
  iconAnchor: [15, 30],
});

// Component to handle map clicks and location updates
function LocationMarker({ position }: { position: number[] | null }) {
  const map = useMapEvents({});

  useEffect(() => {
    if (position) {
      map.flyTo(position as [number, number], map.getZoom());
    }
  }, [position, map]);

  return position ? (
    <Marker icon={storeIcon} position={position as [number, number]}>
      <Popup>Store Location</Popup>
    </Marker>
  ) : null;
}

export default LocationMarker;
