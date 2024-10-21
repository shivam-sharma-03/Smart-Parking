import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder";
import "./MapPage.css";

// Default coordinates for Jaipur
const defaultCoords = [26.9124, 75.7873];

// Sample parking locations with coordinates
const parkingLocations = [
  { name: "JKLU", coords: [26.836245709323638, 75.64977771170767] },
  { name: "Khetan Hospital", coords: [26.958984761155595, 75.77107213767] },
  {
    name: "Candlewick Public School",
    coords: [26.958587499300968, 75.77633549005996],
  },
  { name: "NK Public School", coords: [27.069682558830543, 75.74919429182185] },
];

// Function to calculate distance using Haversine formula
const calculateDistance = (coords1, coords2) => {
  const [lat1, lon1] = coords1;
  const [lat2, lon2] = coords2;
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance;
};

// Function to geocode a location name to get coordinates
const geocodeLocation = async (locationName) => {
  const url = `https://nominatim.openstreetmap.org/search?q=${locationName}&format=json&limit=1`;
  const response = await fetch(url);
  const data = await response.json();
  if (data.length > 0) {
    return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
  }
  return null;
};

const SearchBar = ({ setMapCenter, setNearbyParking }) => {
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // To show loading during geocoding

  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchInput(value);

    // Filter parking locations by name if it matches search input
    const filtered = parkingLocations.filter((location) =>
      location.name.toLowerCase().includes(value)
    );
    setSuggestions(filtered);

    // Show all parking locations if input is empty
    if (value.trim() === "") {
      setNearbyParking(parkingLocations);
    }
  };

  const handleLocationSelect = async (location) => {
    setSearchInput(location.name); // Set input to the selected location name
    setSuggestions([]); // Clear suggestions
    setMapCenter(location.coords); // Update the map center

    // Find nearby parking locations within 5 km
    const nearby = parkingLocations.filter((loc) => {
      const distance = calculateDistance(location.coords, loc.coords);
      return distance <= 5; // 5 km radius
    });

    setNearbyParking(nearby); // Update the nearby parking locations
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (searchInput.trim() === "") {
      setNearbyParking(parkingLocations); // Reset to all parking if search is empty
      return;
    }

    setIsLoading(true); // Show loading while geocoding

    // Geocode the general location if no exact parking location is matched
    const geocodedCoords = await geocodeLocation(searchInput);
    if (geocodedCoords) {
      setMapCenter(geocodedCoords); // Center map on geocoded location

      // Find nearby parking locations within 5 km of the geocoded location
      const nearby = parkingLocations.filter((loc) => {
        const distance = calculateDistance(geocodedCoords, loc.coords);
        return distance <= 5; // 5 km radius
      });

      setNearbyParking(nearby); // Update nearby parking locations
    } else {
      setNearbyParking([]); // No nearby parking found for the location
    }

    setIsLoading(false); // Hide loading after geocoding
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="Search for location or parking..."
          value={searchInput}
          onChange={handleSearchChange}
        />
        <button type="submit">Search</button>
      </form>

      {isLoading && <p>Loading...</p>}

      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((location, index) => (
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
  const [mapCenter, setMapCenter] = useState(defaultCoords); // Default center
  const [nearbyParking, setNearbyParking] = useState(parkingLocations); // Initialize with all parking lots
  const mapRef = useRef();
  const navigate = useNavigate();

  // Update map center when mapCenter state changes
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
      <SearchBar setMapCenter={setMapCenter} setNearbyParking={setNearbyParking} />
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
        {nearbyParking.map((location, index) => (
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
