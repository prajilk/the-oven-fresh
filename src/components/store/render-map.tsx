'use client';

import L, { type LatLngExpression } from 'leaflet';
import { Marker, Polyline, TileLayer, useMapEvents } from 'react-leaflet';
import LocationMarker from './location-marker';
import 'leaflet/dist/leaflet.css';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

type MapProps = {
  position: number[] | null;
  points: LatLngExpression[];
  setPoints: React.Dispatch<React.SetStateAction<LatLngExpression[]>>;
  onLineSet?: (line: {
    start: [number, number];
    end: [number, number];
  }) => void;
};

// Fix default icon paths for Leaflet when using Next.js
// @ts-expect-error: Type 'IconOptions' is not assignable to type 'IconOptions & { iconRetinaUrl: string; iconUrl: string; shadowUrl: string; }'.
// biome-ignore lint/performance/noDelete: <Ignore>
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
});

const _Map = ({ position, points, setPoints, onLineSet }: MapProps) => {
  // @ts-expect-error: Type 'MapContainer' is not assignable to type 'ComponentType<MapContainerProps<any, any>>'.
  const handleMapClick = (e) => {
    if (position === null) {
      return;
    }
    const newPoint: LatLngExpression = [e.latlng.lat, e.latlng.lng];

    if (points.length < 1) {
      setPoints([newPoint]);
    } else if (points.length === 1) {
      const updated = [...points, newPoint];
      setPoints(updated);
      if (onLineSet) {
        onLineSet({
          start: updated[0] as [number, number],
          end: updated[1] as [number, number],
        });
      }
    } else {
      // Reset on third click
      setPoints([newPoint]);
    }
  };

  return (
    <>
      <MapClickHandler onClick={handleMapClick} />
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker position={position} />
      {points.map((pos) => (
        <Marker key={pos.toString()} position={pos} />
      ))}
      {points.length === 2 && <Polyline color="blue" positions={points} />}
    </>
  );
};

const RenderMap = ({ position, points, setPoints, onLineSet }: MapProps) => {
  const [MapViewer, setMapViewer] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    import('react-leaflet').then((mod) => {
      setMapViewer(() => mod.MapContainer);
    });
  }, []);
  return MapViewer ? (
    // @ts-expect-error: MapViewer is not defined
    <MapViewer
      boxZoom={position !== null}
      center={(position as [number, number]) || [43.7764, -79.2318]}
      doubleClickZoom={position !== null}
      dragging={position !== null}
      keyboard={position !== null}
      scrollWheelZoom={position !== null}
      style={{
        height: '100%',
        width: '100%',
      }}
      touchZoom={position !== null}
      zoom={13}
      zoomControl={position !== null}
    >
      <_Map
        onLineSet={onLineSet}
        points={points}
        position={position}
        setPoints={setPoints}
      />
    </MapViewer>
  ) : (
    <div className="flex h-full items-center justify-center">
      <p>Loading Map...</p>
    </div>
  );
};

export default dynamic(() => Promise.resolve(RenderMap), {
  ssr: false,
});

function MapClickHandler({
  onClick,
}: {
  onClick: (e: L.LeafletMouseEvent) => void;
}) {
  useMapEvents({
    click(e) {
      onClick(e);
    },
  });
  return null;
}
