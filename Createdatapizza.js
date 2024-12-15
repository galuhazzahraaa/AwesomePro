import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  ScrollView,
  TextInput,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const Createdatapizza = ({ onRefresh }) => {
  const [nama_lokasi, setNamaLokasi] = useState('');
  const [rate, setRate] = useState('');
  const [jam_operasional, setJamOperasional] = useState('');
  const [alamat, setAlamat] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [showMap, setShowMap] = useState(false);

  const mapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        #map { height: 100%; width: 100%; margin: 0; padding: 0; }
        html, body { margin: 0; height: 100%; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map').setView([-7.801375, 110.364622], 14);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        var marker;
        map.on('click', function(e) {
          if (marker) map.removeLayer(marker);
          marker = L.marker(e.latlng).addTo(map);
          window.ReactNativeWebView.postMessage(
            JSON.stringify({ latitude: e.latlng.lat, longitude: e.latlng.lng })
          );
        });
      </script>
    </body>
    </html>
  `;

  const saveData = async () => {
    if (!nama_lokasi || !rate || !jam_operasional || !alamat || !latitude || !longitude) {
      Alert.alert('Error', 'Semua field harus diisi!');
      return;
    }

    const newData = {
      nama_lokasi,
      rate,
      jam_operasional,
      alamat,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    };

    try {
      const existingData = await AsyncStorage.getItem('pizzaData');
      const currentData = existingData ? JSON.parse(existingData) : [];
      currentData.push(newData);

      await AsyncStorage.setItem('pizzaData', JSON.stringify(currentData));

      Alert.alert('Berhasil', 'Data berhasil disimpan!');

      if (onRefresh) {
        onRefresh();
      }

      // Reset form input setelah berhasil menyimpan data
      setNamaLokasi('');
      setRate('');
      setJamOperasional('');
      setAlamat('');
      setLatitude('');
      setLongitude('');
    } catch (error) {
      console.error('Error saving data:', error);
      Alert.alert('Error', 'Gagal menyimpan data');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {showMap ? (
        <View style={{ flex: 1 }}>
          <TouchableOpacity style={styles.backButton} onPress={() => setShowMap(false)}>
            <FontAwesomeIcon icon={faArrowLeft} size={20} color="#007bff" />
          </TouchableOpacity>
          <WebView
            source={{ html: mapHtml }}
            onMessage={(event) => {
              const coords = JSON.parse(event.nativeEvent.data);
              setLatitude(coords.latitude.toString());
              setLongitude(coords.longitude.toString());
              setShowMap(false);
            }}
            style={{ flex: 1 }}
          />
        </View>
      ) : (
        <View>
          <Text style={styles.title}>Add Pizza Location Data</Text>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <TextInput style={styles.input} placeholder="Pizza Location" value={nama_lokasi} onChangeText={setNamaLokasi} />
            <TextInput style={styles.input} placeholder="Rate" value={rate} onChangeText={setRate} />
            <TextInput style={styles.input} placeholder="Operational Hours" value={jam_operasional} onChangeText={setJamOperasional} />
            <TextInput style={styles.input} placeholder="Address" value={alamat} onChangeText={setAlamat} />
            <TouchableOpacity style={styles.mapButton} onPress={() => setShowMap(true)}>
              <Text style={styles.mapButtonText}>Select Location on Map</Text>
            </TouchableOpacity>
            <TextInput style={styles.input} placeholder="Latitude" value={latitude} editable={false} />
            <TextInput style={styles.input} placeholder="Longitude" value={longitude} editable={false} />
            <View style={styles.simpanButtonContainer}>
              <TouchableOpacity style={styles.simpanButton} onPress={saveData}>
                <Text style={styles.simpanButtonText}>Save</Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    paddingVertical: 15,
    backgroundColor: '#b82a2a',
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scrollContainer: {
    marginTop: 20,
    marginBottom: 50,
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#777',
    borderRadius: 8,
    padding: 9,
    width: '80%',
    marginVertical: 5,
    backgroundColor: 'white',
  },
  mapButton: {
    backgroundColor: '#b82a2a',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
    width: '65%',
  },
  mapButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#fff',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  simpanButton: {
    backgroundColor: '#b82a2a', // Warna merah
    paddingVertical: 12, // Tinggi padding, ditambah agar lebih besar
    paddingHorizontal: 12, // Lebar padding horizontal
    borderRadius: 8, // Lengkungan sudut
    alignItems: 'center', // Tengah horizontal
    justifyContent: 'center', // Tengah vertikal
    width: '60%', // Lebar tombol (bisa 80% atau 100% sesuai kebutuhan)
    alignSelf: 'center', // Tengah dalam kontainer induk
    elevation: 3, // Efek bayangan
  },
  simpanButtonText: {
    color: 'white', // Warna teks
    fontSize: 14, // Ukuran font lebih besar
    fontWeight: 'bold', // Tebal
  },
  
});

export default Createdatapizza;
