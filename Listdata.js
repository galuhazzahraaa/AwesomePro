import { View, Text, StyleSheet, TouchableOpacity, FlatList, Button, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faGraduationCap, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const Listdata = () => {
  const jsonUrl = 'http://10.0.2.2:3000/mahasiswa';
  const [isLoading, setLoading] = useState(true);
  const [dataUser, setDataUser] = useState([]);
  const [refresh, setRefresh] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Function to fetch data
  const fetchData = (isRefreshing = false) => {
    if (isRefreshing) setRefresh(true);
    else setLoading(true);

    fetch(jsonUrl)
      .then((response) => response.json())
      .then((json) => {
        console.log('Fetched Data:', json); // Debugging
        setDataUser(json);
      })
      .catch((error) => console.error('Error fetching data:', error))
      .finally(() => {
        if (isRefreshing) setRefresh(false);
        else setLoading(false);
      });
  };

  // Function to delete data
  const deleteData = (id) => {
    fetch(`${jsonUrl}/${id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to delete data');
        alert('Data terhapus');
        fetchData(); // Refresh data after deletion
      })
      .catch((error) => console.error('Error deleting data:', error));
  };

  return (
    <SafeAreaView>
      {isLoading ? (
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <Text style={styles.cardtitle}>Loading...</Text>
        </View>
      ) : (
        <FlatList
          style={{ marginBottom: 0 }}
          data={dataUser}
          onRefresh={() => fetchData(true)} // Use refresh function
          refreshing={refresh}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()} // Ensure unique key
          renderItem={({ item }) => (
            <View>
              <TouchableOpacity>
                <View style={[styles.card, { backgroundColor: item.color || '#B0C4DE' }]}>
                  <View style={styles.avatar}>
                    <FontAwesomeIcon icon={faGraduationCap} size={50} color={item.color || '#000'} />
                  </View>
                  <View>
                    <Text style={styles.cardtitle}>
                      {item.first_name} {item.last_name}
                    </Text>
                    <Text>{item.kelas}</Text>
                    <Text>{item.gender}</Text>
                  </View>
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
                    <FontAwesomeIcon icon={faChevronRight} size={20} />
                  </View>
                </View>
              </TouchableOpacity>
              <View style={styles.form}>
                <Button
                  title="Hapus"
                  onPress={() =>
                    Alert.alert('Hapus data', 'Yakin akan menghapus data ini?', [
                      { text: 'Tidak', onPress: () => console.log('Tidak jadi menghapus') },
                      { text: 'Ya', onPress: () => deleteData(item.id) },
                    ])
                  }
                  color={'#6495ED'}
                />
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default Listdata;

const styles = StyleSheet.create({
  title: {
    paddingVertical: 12,
    backgroundColor: '#333',
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  avatar: {
    borderRadius: 100,
    width: 80,
  },
  cardtitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  card: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    marginHorizontal: 20,
    marginVertical: 7,
  },
  form: {
    paddingHorizontal: 20,
    paddingTop: 5,
    paddingBottom: 20,
  },
});
