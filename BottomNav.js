import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Profil from './App';
import Mahasiswa from './Mahasiswa';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser, faUserGraduate } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-solid-svg-icons';
import { WebView } from 'react-native-webview';


function HomeScreen() {
  return (
    <Profil />
  );
}

function SettingsScreen() {
  return (
    <Mahasiswa />
  );
}

function WebScreen() {
  return (
    <WebView
      source={{ uri: 'https://github.com/galuhazzahraaa' }}
      style={{ flex: 1 }} // Optional: Makes WebView take up the full screen
    />
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#FFFFFF', // Warna ikon dan teks tab aktif (putih)
          tabBarInactiveTintColor: '#C7C7CC', // Warna ikon dan teks tab tidak aktif (abu-abu terang)
          tabBarStyle: {
            backgroundColor: '#2E2E2E', // Latar belakang Bottom Tab menjadi #2E2E2E
            borderTopWidth: 0, // Menghilangkan garis batas atas tab
          },
        }}
      >
        <Tab.Screen
          name="Profil"
          component={HomeScreen}
          options={{
            headerShown: true,
            headerStyle: {
              backgroundColor: '#2E2E2E', // Latar belakang header atas yang sama dengan Bottom Tab
            },
            headerTintColor: '#FFFFFF', // Warna teks header
            tabBarIcon: ({ color }) => (
              <FontAwesomeIcon icon={faUser} color={color} size={20} />
            ),
          }}
        />
        <Tab.Screen
          name="Data Mahasiswa"
          component={SettingsScreen}
          options={{
            headerStyle: {
              backgroundColor: '#2E2E2E', // Latar belakang header atas yang sama dengan Bottom Tab
            },
            headerTintColor: '#FFFFFF', // Warna teks header
            tabBarIcon: ({ color }) => (
              <FontAwesomeIcon icon={faUserGraduate} color={color} size={20} />
            ),
          }}
        />
        <Tab.Screen
          name="Github"
          component={WebScreen}
          options={{
            headerStyle: {
              backgroundColor: '#2E2E2E', // Latar belakang header atas yang sama dengan Bottom Tab
            },
            headerTintColor: '#FFFFFF', // Warna teks header
            tabBarIcon: ({ color }) => (
              <FontAwesomeIcon icon={faGithub} color={color} size={20} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}