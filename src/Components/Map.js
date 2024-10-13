import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import L from "leaflet"; // Ensure Leaflet is imported here
import "leaflet/dist/leaflet.css";
import "./MapPage.css";

// Default coordinates for Jaipur
const defaultCoords = [26.9124, 75.7873];

// Sample parking locations
const parkingLocations = [
  { name: "JKLU", coords: [26.836245709323638, 75.64977771170767] },
  { name: "Khetan Hospital", coords: [26.958984761155595, 75.77107213767] },
  {
    name: "Candlewick Public School",
    coords: [26.958587499300968, 75.77633549005996],
  },
  { name: "NK Public School", coords: [27.069682558830543, 75.74919429182185] },
];

const SearchBar = ({ setSelectedLocation, setMapCenter }) => {
  const [searchInput, setSearchInput] = useState("");
  const [filteredLocations, setFilteredLocations] = useState([]);

  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchInput(value);

    const filtered = parkingLocations.filter((location) =>
      location.name.toLowerCase().includes(value)
    );
    setFilteredLocations(filtered);
  };

  const handleLocationSelect = (location) => {
    console.log("Selected Location: ", location); // Debugging statement
    setSelectedLocation(location);
    setSearchInput(location.name); // Set the input to the selected location name
    setFilteredLocations([]); // Clear suggestions after selection
    setMapCenter(location.coords); // Update the map center to the selected location's coordinates
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search for parking..."
        value={searchInput}
        onChange={handleSearchChange}
      />
      {filteredLocations.length > 0 && (
        <ul className="suggestions">
          {filteredLocations.map((location, index) => (
            <li key={index} onClick={() => handleLocationSelect(location)}>
              {location.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const MapPage = () => {
  const [selectedLocation, setSelectedLocation] = useState(parkingLocations[0]);
  const [mapCenter, setMapCenter] = useState(defaultCoords); // Set default coordinates for Jaipur
  const navigate = useNavigate();
  const mapRef = useRef(); // Create a ref to hold the map instance

  // Effect to update map center whenever mapCenter changes
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(mapCenter, 12); // Update the map view with new coordinates
    }
  }, [mapCenter]);

  const handleMarkerClick = (locationName) => {
    navigate("/slot", { state: { locationName } });
  };

  return (
    <div className="map-page">
      <SearchBar setSelectedLocation={setSelectedLocation} setMapCenter={setMapCenter} />
      <MapContainer
        center={mapCenter}
        zoom={12}
        scrollWheelZoom={true}
        style={{ height: "100vh", width: "100vw" }}
        ref={mapRef} // Assign the ref to the MapContainer
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {parkingLocations.map((location, index) => (
          <Marker
            key={index}
            position={location.coords}
            icon={L.divIcon({
              className: "custom-marker",
              html: '<div style="transform: translate(-50%, -100%);"><svg width="36" height="36" viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C9.79086 0 8 1.79086 8 4C8 6.06406 9.30009 8.36978 12 11.0367C14.6999 8.36978 16 6.06406 16 4C16 1.79086 14.2091 0 12 0ZM12 15C10.4087 15 9 16.4087 9 18C9 19.5913 10.4087 21 12 21C13.5913 21 15 19.5913 15 18C15 16.4087 13.5913 15 12 15Z" fill="#3340DA"/><path d="M12 24C7.13401 24 0 25.3431 0 30C0 32.7614 3.13401 36 12 36C20.866 36 24 32.7614 24 30C24 25.3431 16.866 24 12 24ZM12 33C8.75482 33 6 31.1416 6 30C6 28.8584 8.75482 27 12 27C15.2452 27 18 28.8584 18 30C18 31.1416 15.2452 33 12 33Z" fill="#3340DA"/></svg></div>',
              popupAnchor: [-11, -60],
            })}
          >
            <Popup>
              <div>
                <h3>{location.name}</h3>
                <button onClick={() => handleMarkerClick(location.name)}>
                  Select Lot
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapPage;
