import React, { useEffect, useState } from 'react';
import { WebView } from 'react-native-webview';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PizzaMap = ({ selectedLocation, onBack }) => {
  const [locations, setLocations] = useState([]);

  // Ambil data terkini dari AsyncStorage
  const fetchData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('pizzaData');
      if (storedData) {
        setLocations(JSON.parse(storedData));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const leafletMapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        #map { height: 100vh; width: 100vw; }
        html, body { height: 100%; margin: 0; padding: 0; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        document.addEventListener("DOMContentLoaded", function() {
          var map = L.map('map', {
            center: [${selectedLocation.latitude}, ${selectedLocation.longitude}],
            zoom: 15,
            zoomControl: false
          });

          L.control.zoom({ position: 'topright' }).addTo(map);

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
            maxZoom: 19
          }).addTo(map);

          var redIconUrl = 'https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-red.png';
          var greenIconUrl = 'https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-green.png';
          var yellowIconUrl = 'https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-yellow.png';

          function createIcon(iconUrl) {
            return L.icon({
              iconUrl: iconUrl,
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41]
            });
          }

          function getCircleColor(rating) {
            if (rating === "4,6/5") return "yellow";
            if (rating === "4,7/5") return "green";
            if (rating === "4,8/5") return "red";
            return "gray";
          }

          function getMarkerIcon(rating) {
            if (rating === "4,8/5") return createIcon(redIconUrl);
            if (rating === "4,7/5") return createIcon(greenIconUrl);
            if (rating === "4,6/5") return createIcon(yellowIconUrl);
            return createIcon(greenIconUrl);
          }

          var locations = ${JSON.stringify(locations)};

          locations.forEach(function(location) {
            var circle = L.circle([location.latitude, location.longitude], {
              color: getCircleColor(location.rate),
              fillColor: getCircleColor(location.rate),
              fillOpacity: 0.4,
              radius: 50
            }).addTo(map);

            var marker = L.marker([location.latitude, location.longitude], {
              icon: getMarkerIcon(location.rate)
            }).addTo(map);

            marker.bindPopup("<b>" + location.nama_lokasi + "</b>");

            if (location.nama_lokasi === "${selectedLocation.nama_lokasi}") {
              marker.openPopup();
            }
          });
        });
      </script>
    </body>
    </html>
  `;

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <FontAwesomeIcon icon={faArrowLeft} size={20} color="blue" />
      </TouchableOpacity>

      <WebView
        originWhitelist={['*']}
        source={{ html: leafletMapHtml }}
        style={{ flex: 1 }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowFileAccess={true}
        allowUniversalAccessFromFileURLs={true}
        onError={(e) => console.error('WebView Error:', e.nativeEvent)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: 12,
    left: 8,
    zIndex: 10,
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PizzaMap;
