import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import LogoHeader from '../components/logoHeader';

export default function Profil() {
  const [pseudo, setPseudo] = useState(''); // État pour stocker le pseudo de l'utilisateur
  const [editingPseudo, setEditingPseudo] = useState(false); // État pour gérer l'édition du pseudo
  const [newPseudo, setNewPseudo] = useState(''); // État pour stocker le nouveau pseudo
  const [editingPassword, setEditingPassword] = useState(false); // État pour gérer l'édition du mot de passe
  const [oldPassword, setOldPassword] = useState(''); // État pour stocker l'ancien mot de passe
  const [newPassword, setNewPassword] = useState(''); // État pour stocker le nouveau mot de passe
  const navigation = useNavigation(); // Hook de navigation
  const isFocused = useIsFocused(); // Hook pour vérifier si l'écran est actuellement focalisé

  useEffect(() => {
    // Fonction pour récupérer le pseudo depuis AsyncStorage
    const getPseudo = async () => {
      try {
        const storedPseudo = await AsyncStorage.getItem('@pseudo');
        if (storedPseudo !== null) {
          setPseudo(storedPseudo);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du pseudo depuis AsyncStorage:', error);
      }
    };

    getPseudo(); // Appel de la fonction de récupération du pseudo lorsque l'écran est focalisé
  }, [isFocused]);

  const handleDeconnexion = async () => {
    try {
      // Suppression du pseudo depuis AsyncStorage
      await AsyncStorage.removeItem('@pseudo');
      // Redirection vers la page de connexion
      navigation.navigate('Connexion');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const handleSaveNewPseudo = async () => {
    try {
      // Sauvegarde du nouveau pseudo dans AsyncStorage
      await AsyncStorage.setItem('@pseudo', newPseudo);
      // Mise à jour du pseudo affiché
      setPseudo(newPseudo);
      // Réinitialisation du champ de saisie
      setNewPseudo('');
      // Désactivation du mode édition
      setEditingPseudo(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du nouveau pseudo:', error);
    }
  };

  const handleChangePassword = async () => {
    // Vérification que les champs ne sont pas vides
    if (!newPassword || !confirmPassword) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }

    // Vérification que le nouveau mot de passe est confirmé
    if (newPassword !== confirmPassword) {
      Alert.alert('Erreur', 'Les nouveaux mots de passe ne correspondent pas.');
      return;
    }

    // Vérification que le nouveau mot de passe respecte les critères
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    if (!passwordRegex.test(newPassword)) {
      Alert.alert(
        'Erreur',
        'Le nouveau mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule, un chiffre et faire au moins 6 caractères de long.'
      );
      return;
    }

    // Changement du mot de passe
    try {
      // Sauvegarde du nouveau mot de passe dans AsyncStorage
      await AsyncStorage.setItem('@password', newPassword);
      // Réinitialisation des champs de saisie
      setOldPassword('');
      setNewPassword('');
      // Message de succès
      Alert.alert('Succès', 'Mot de passe changé avec succès');
    } catch (error) {
      console.error('Erreur lors du changement du mot de passe:', error);
    }
  };

  const handlePreferences = () => {
    // Redirection vers la page de préférences
    navigation.navigate('Preference');
  };

  return (
    <View style={styles.container}>
      {/* En-tête personnalisé avec le logo et le bouton de déconnexion */}
      <View style={styles.headerContainer}>
        <LogoHeader />
        <TouchableOpacity onPress={handleDeconnexion}>
          <Text style={styles.headerButton}>Déconnexion</Text>
        </TouchableOpacity>
      </View>
      {/* Informations utilisateur */}
      <View style={styles.userInfo}>
        <Ionicons name="person" size={24} color="black" style={styles.userIcon} />
        <Text style={styles.pseudo}>{pseudo}</Text>
      </View>
      {/* Modifier le pseudo */}
      {editingPseudo ? (
        <View style={styles.editContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nouveau pseudo"
            onChangeText={setNewPseudo}
            value={newPseudo}
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveNewPseudo}>
            <Text style={styles.buttonText}>Sauvegarder</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.editButton} onPress={() => setEditingPseudo(true)}>
          <Text style={styles.buttonText}>Modifier le pseudo</Text>
        </TouchableOpacity>
      )}
      {/* Modifier le mot de passe */}
      {editingPassword ? (
        <View style={styles.editContainer}>
          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            onChangeText={setOldPassword}
            value={oldPassword}
            secureTextEntry={true}
          />
          <TextInput
            style={styles.input}
            placeholder="Nouveau mot de passe"
            onChangeText={setNewPassword}
            value={newPassword}
            secureTextEntry={true}
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleChangePassword}>
            <Text style={styles.buttonText}>Sauvegarder</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.editButton} onPress={() => setEditingPassword(true)}>
          <Text style={styles.buttonText}>Modifier le mot de passe</Text>
        </TouchableOpacity>
      )}
      {/* Bouton pour modifier les préférences */}
      <TouchableOpacity style={styles.editButton} onPress={handlePreferences}>
        <Text style={styles.buttonText}>Modifier les préférences</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5fcff',
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
  },
  headerButton: {
    fontSize: 16,
    color: '#00BFFF',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  userIcon: {
    marginRight: 5,
  },
  pseudo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  editButton: {
    backgroundColor: '#00BFFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  editContainer: {
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#00BFFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
