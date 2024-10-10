import React, { useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { SearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import './MapPage.css';

// Search Component to integrate into MapContainer
const SearchBar = ({ setZoomLocation }) => {
  const map = useMap();

  const provider = new OpenStreetMapProvider();
  const searchControl = new SearchControl({
    provider,
    style: 'bar',
    autoComplete: true, 
    autoCompleteDelay: 250,
    keepResult: true,
  });

  // Initialize search control and add to the map
  React.useEffect(() => {
    map.addControl(searchControl);

    // Event listener for when a location is selected
    map.on('geosearch/showlocation', (result) => {
      const { x, y } = result.location;
      setZoomLocation([y, x]);
      map.flyTo([y, x], 12); // Zoom level set for closer inspection
    });

    return () => map.removeControl(searchControl);
  }, [map, searchControl, setZoomLocation]);

  return null;
};

// Main Page Component with Map and SearchBar
const MapPage = () => {
  // Set the default location to Jaipur (26.9124° N, 75.7873° E) with a zoom level of 12
  const [zoomLocation, setZoomLocation] = useState([26.9124, 75.7873]);

  return (
    <div className="map-page">
      {/* Map Container centered on Jaipur */}
      <MapContainer 
        center={zoomLocation} 
        zoom={12}  // Default zoom level for Jaipur
        scrollWheelZoom={true} 
        style={{ height: '100vh', width: '100vw' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* Search Bar for finding locations */}
        <SearchBar setZoomLocation={setZoomLocation} />
      </MapContainer>
    </div>
  );
};

export default MapPage;
