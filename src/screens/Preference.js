import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import LogoHeader from '../components/logoHeader';
import { useNavigation } from '@react-navigation/native';

export default function Preference() {
  // État local pour stocker les préférences de l'utilisateur
  const [preferences, setPreferences] = useState({
    Restauration: false,
    Logement: false,
    Étude: false,
    Divertissement: false,
    Santé: false,
    Shopping: false,
  });

  // Fonction pour basculer l'état d'une préférence spécifique
  const togglePreference = (preference) => {
    setPreferences({ ...preferences, [preference]: !preferences[preference] });
  };

  // Initialisation de la navigation
  const navigation = useNavigation();

  // Fonction pour sauvegarder les préférences et afficher une alerte
  const savePreferences = () => {
    Alert.alert('Préférences enregistrées', 'Vos préférences ont été enregistrées avec succès.', [
      { text: 'OK', onPress: () => navigation.navigate('Accueil') }
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.logoContainer}>
          <LogoHeader />  
        </View>
      </View>
      {/* Boucle à travers les préférences pour les afficher */}
      {Object.keys(preferences).map((preference, index) => (
        <TouchableOpacity key={index} style={styles.preferenceItem} onPress={() => togglePreference(preference)}>
          <Text style={styles.preferenceText}>{preference}</Text>
          {/* Affiche une icône de coche si la préférence est sélectionnée */}
          <View style={[styles.selectionCircle, !preferences[preference] && styles.selectionCircleInactive]}>
            {preferences[preference] && <MaterialIcons name="check" size={24} color="#fff" />}
          </View>
        </TouchableOpacity>
      ))}
      {/* Bouton pour sauvegarder les préférences */}
      <TouchableOpacity style={styles.saveButton} onPress={savePreferences}>
        <Text style={styles.saveButtonText}>Enregistrer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  headerContainer: {
    marginBottom: 20,
  },
  logoContainer: {
    alignItems: 'flex-start',
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#eee',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  preferenceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  // Style du cercle de sélection autour de l'icône de vérification
  selectionCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#00BFFF', // Couleur du cercle de sélection
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectionCircleInactive: {
    backgroundColor: 'white', // Couleur du cercle inactif
  },
  saveButton: {
    backgroundColor: '#00BFFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '50%',
    alignSelf: 'center',
    marginTop: 40, // Ajustement de la marge supérieure pour descendre le bouton
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
