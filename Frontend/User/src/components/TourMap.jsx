import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIconRetina from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIconRetina,
  shadowUrl: markerShadow,
});

const TourMap = ({ route }) => {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);

  useEffect(() => {
    if (!route || route.length === 0 || !mapContainerRef.current) return;

    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const map = L.map(mapContainerRef.current, { zoomControl: true }).setView([route[0].lat, route[0].lng], 6);
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    const latlngs = route.map((s) => [s.lat, s.lng].map(Number));
    latlngs.forEach((ll, i) => {
      const marker = L.marker(ll).addTo(map);
      marker.bindPopup(route[i].name || `Stop ${i + 1}`);
    });

    const poly = L.polyline(latlngs, { color: "#2563eb", weight: 4 }).addTo(map);
    if (latlngs.length === 1) {
      map.setView(latlngs[0], 9);
    } else {
      map.fitBounds(poly.getBounds(), { padding: [40, 40] });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [route]);

  return <div ref={mapContainerRef} style={{ height: "500px" }} className="w-full rounded-lg shadow-md" />;
};

export default TourMap;
