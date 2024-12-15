import React, { useState, useEffect } from 'react';
import { FlatList, Text, View, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMapMarkerAlt, faStar } from '@fortawesome/free-solid-svg-icons';
import { useFocusEffect } from '@react-navigation/native';
import PizzaMap from './PizzaMap';
import DataPizza from './data/pizza.json';

const Pizza = () => {
  const [pizzaData, setPizzaData] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const initializeData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('pizzaData');
      const parsedStoredData = storedData ? JSON.parse(storedData) : [];
      const combinedData = [...DataPizza, ...parsedStoredData];
      const uniqueData = Array.from(
        new Map(combinedData.map((item) => [item.nama_lokasi, item])).values()
      );
      setPizzaData(uniqueData);
    } catch (error) {
      console.error('Error initializing data:', error);
    }
  };

  const deletePizzaData = (namaLokasi) => {
    Alert.alert('Konfirmasi Hapus', 'Data ini akan dihapus, kamu yakin kan?', [
      { text: 'Nay', style: 'cancel' },
      {
        text: 'Yay',
        onPress: async () => {
          try {
            const filteredData = pizzaData.filter((item) => item.nama_lokasi !== namaLokasi);
            setPizzaData(filteredData);
            await AsyncStorage.setItem('pizzaData', JSON.stringify(filteredData));
          } catch (error) {
            console.error('Error deleting data:', error);
          }
        },
      },
    ]);
  };

  // Listener untuk refresh ketika layar mendapatkan fokus
  useFocusEffect(
    React.useCallback(() => {
      initializeData();
    }, [])
  );

  useEffect(() => {
    initializeData();
  }, []);

  return (
    <>
      {showMap && selectedLocation ? (
        <PizzaMap selectedLocation={selectedLocation} onBack={() => setShowMap(false)} />
      ) : (
        <FlatList
          data={pizzaData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <TouchableOpacity
                onPress={() => {
                  setSelectedLocation({
                    latitude: item.latitude,
                    longitude: item.longitude,
                    nama_lokasi: item.nama_lokasi,
                  });
                  setShowMap(true);
                }}
              >
                <View style={styles.iconContainer}>
                  <FontAwesomeIcon
                    icon={faMapMarkerAlt}
                    size={40}
                    color={item.rate === '4,8/5' ? 'red' : item.rate === '4,7/5' ? 'green' : 'yellow'}
                  />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.name}>{item.nama_lokasi}</Text>
                  <View style={styles.infoContainer}>
                    <FontAwesomeIcon icon={faStar} size={14} color="gold" />
                    <Text style={styles.rate}>{item.rate}</Text>
                  </View>
                  <Text style={styles.operationalHours}>Jam Operasional: {item.jam_operasional}</Text>
                  <Text style={styles.address}>{item.alamat}</Text>
                  <Text style={styles.coordinates}>
                    Koordinat: ({item.latitude.toFixed(6)}, {item.longitude.toFixed(6)})
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => deletePizzaData(item.nama_lokasi)}>
                <Text style={styles.deleteButtonText}>DELETE</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'column',
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    marginHorizontal: 20,
    marginVertical: 7,
  },
  iconContainer: { width: 60, justifyContent: 'center', alignItems: 'center' },
  textContainer: { flex: 1, marginLeft: 10 },
  name: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  infoContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  rate: { fontSize: 14, marginLeft: 5 },
  operationalHours: { fontSize: 12, color: '#555', marginBottom: 5 },
  address: { fontSize: 12, color: '#555', marginBottom: 5 },
  coordinates: { fontSize: 12, color: '#555', fontStyle: 'italic' },
  deleteButton: { marginTop: 6, backgroundColor: 'red', padding: 6, borderRadius: 3, alignItems: 'center' },
  deleteButtonText: { color: 'white', fontWeight: 'bold', fontSize: 10 },
});

export default Pizza;
