import React, { useEffect, useState } from 'react';
import { PermissionsAndroid, Platform, View, Text, Image, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlusCircle, faUser, faPizzaSlice } from '@fortawesome/free-solid-svg-icons';
import Createdatapizza from './Createdatapizza';
import Datapizza from './Pizza';
import Profil from './App';
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();

// Fungsi untuk meminta izin lokasi
const requestLocationPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Lokasi Akses',
          message: 'Aplikasi ini membutuhkan akses lokasi Anda.',
          buttonNeutral: 'Tanyakan nanti',
          buttonNegative: 'Tolak',
          buttonPositive: 'Setuju',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Akses lokasi diberikan');
      } else {
        console.log('Akses lokasi ditolak');
      }
    } catch (err) {
      console.warn(err);
    }
  }
};

// Landing Page Component
function LandingPage({ onGetStarted }) {
  return (
    <ImageBackground
      source={{
        uri: 'https://static.vecteezy.com/system/resources/previews/012/683/483/non_2x/pizza-popular-world-map-infographics-vector.jpg',
      }}
      style={styles.landingContainer}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <View style={styles.card}>
        <Image
          source={{
            uri: 'https://media.istockphoto.com/id/519962818/id/vektor/restoran-pizza-kartun-ilustrasi-datar-vektor.jpg?s=612x612&w=is&k=20&c=O6cNcDWg5n-kUZ0ZMCVQXNrGffvO9n8Yv9yLlYqvDbw=',
          }}
          style={styles.logo}
        />
        <Text style={styles.landingTitle}>
          Pizza Hunter App
        </Text>
        <Text style={styles.landingSubtitle}>
        Add, view, and manage your favorite pizza locations with ease!
        </Text>
        <TouchableOpacity style={styles.getStartedButton} onPress={onGetStarted}>
          <Text style={styles.getStartedButtonText}>Explore Now!</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

// Komponen untuk Home Screen
function HomeScreen() {
  return <Createdatapizza />;
}

// Komponen untuk Data Pizza Screen
function DataPizzaScreen() {
  return <Datapizza />;
}

// Komponen untuk Profile Screen
function ProfileScreen() {
  return <Profil />;
}

// Tab Navigator
const Tab = createBottomTabNavigator();

// Komponen Utama Aplikasi
export default function CrudPizzaNav() {
  const [showLanding, setShowLanding] = useState(true);

  // Meminta izin lokasi saat aplikasi pertama kali dijalankan
  useEffect(() => {
    requestLocationPermission();
  }, []);

  if (showLanding) {
    return <LandingPage onGetStarted={() => setShowLanding(false)} />;
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
  screenOptions={({ route }) => ({
    tabBarIcon: ({ focused, color, size }) => {
      let iconName;

      if (route.name === 'Add Data Location') {
        iconName = faPlusCircle;
      } else if (route.name === 'List Pizza Location') {
        iconName = faPizzaSlice;
      } else if (route.name === 'Profile') {
        iconName = faUser;
      }

      return <FontAwesomeIcon icon={iconName} color={color} size={size} />;
    },
    tabBarActiveTintColor: '#b82a2a', // Warna ikon/tab saat aktif
    tabBarInactiveTintColor: 'gray', // Warna ikon/tab saat tidak aktif
    tabBarStyle: {
      backgroundColor: 'white', // Warna latar tab bar
    },
    tabBarLabelStyle: {
      fontSize: 12, // Ukuran font label
    },
  })}
>
  <Tab.Screen
    name="Add Data Location"
    component={HomeScreen}
    options={{ headerShown: false }}
  />
  <Tab.Screen
    name="List Pizza Location"
    component={DataPizzaScreen}
    options={{ headerShown: false }}
  />
  <Tab.Screen
    name="Profile"
    component={ProfileScreen}
    options={{ headerShown: false }}
  />
</Tab.Navigator>

    </NavigationContainer>
  );
}

// Styles untuk Landing Page
const styles = StyleSheet.create({
  landingContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Transparansi hitam untuk overlay
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    width: '85%',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
    borderRadius: 50,
  },
  landingTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  landingSubtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  getStartedButton: {
    backgroundColor: '#8a2121',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  getStartedButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
