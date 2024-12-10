import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Profil from './App';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPlusCircle, faUserPen, faUserGraduate } from '@fortawesome/free-solid-svg-icons'
import WebView from 'react-native-webview';
import Createdata from './Createdata';
import Datamahasiswa from './Listdata';
import Editdata from './Editdata';


function HomeScreen() {
  return (
      <Createdata/>
  );
}

function DataMahasiswaScreen() {
  return (
    <Datamahasiswa/>
  );
}

function EditScreen() {
  return (
    <Editdata/>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Tambah" component={HomeScreen} 
        options={{ 
          headerShown: false,
          tabBarIcon: ({color}) => 
         ( <FontAwesomeIcon icon={faPlusCircle} color={color} size={24}/> ),
        }}/>
        <Tab.Screen name="Data Mahasiswa" component={DataMahasiswaScreen} 
        options={{ 
          headerShown: false,
          tabBarIcon: ({color}) => 
         ( <FontAwesomeIcon icon={faUserGraduate} color={color} size={24}/> ),
        }}
        />
        <Tab.Screen name="Edit" component={EditScreen} 
        options={{ 
          headerShown: false,
          tabBarIcon: ({color}) => 
         ( <FontAwesomeIcon icon={faUserPen} color={color} size={24}/> ),
        }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}