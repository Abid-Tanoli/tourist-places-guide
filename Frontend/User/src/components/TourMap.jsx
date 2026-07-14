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

const TourMap = ({ route, tourRoute }) => {
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
      attribution: "\u00a9 OpenStreetMap contributors",
    }).addTo(map);

    const latlngs = route.map((s) => [Number(s.lat), Number(s.lng)]);

    latlngs.forEach((ll, i) => {
      const marker = L.marker(ll).addTo(map);

      // Build popup content with day/order info if tourRoute is available
      let popupContent = route[i].name || `Stop ${i + 1}`;
      if (tourRoute && tourRoute[i]) {
        const stop = tourRoute[i];
        const dayNum = stop.day || i + 1;
        const orderNum = stop.order || i + 1;
        popupContent = `<div style="font-family:Arial,sans-serif;"><strong>Day ${dayNum} \u2014 Stop ${orderNum}</strong><br/>${route[i].name || `Stop ${i + 1}`}`;
        if (stop.description) {
          popupContent += `<br/><em style="color:#666;font-size:12px;">${stop.description}</em>`;
        }
        popupContent += `</div>`;
      }

      marker.bindPopup(popupContent, { maxWidth: 250 });

      // Custom numbered icon
      const icon = L.divIcon({
        className: "custom-marker",
        html: `<div style="background:#1a5f5a;color:white;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:13px;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3);">${i + 1}</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });
      marker.setIcon(icon);
    });

    const poly = L.polyline(latlngs, { color: "#1a5f5a", weight: 4, opacity: 0.8, dashArray: "8 4" }).addTo(map);

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
  }, [route, tourRoute]);

  if (!route || route.length === 0) {
    return (
      <div className="flex items-center justify-center h-[250px] sm:h-[350px] md:h-[500px] bg-gray-50 rounded-lg text-gray-400">
        No route data available
      </div>
    );
  }

  return <div ref={mapContainerRef} className="w-full h-[250px] sm:h-[350px] md:h-[500px] rounded-lg shadow-md" />;
};

export default TourMap;
