import React, { useState } from 'react'; // Importation de React et du hook useState
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'; // Importation des composants de React Native
import { useNavigation } from '@react-navigation/native'; // Importation du hook useNavigation pour la navigation
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importation d'AsyncStorage pour le stockage asynchrone

// Composant de connexion
export default function Connexion() {
  // Utilisation du hook de navigation
  const navigation = useNavigation();

  // Définition des états pour le pseudo et le mot de passe
  const [pseudo, setPseudo] = useState('');
  const [password, setpassword] = useState('');

  // Fonction de gestion de la connexion
  const handleConnexion = async () => {
    // Vérification que les champs ne sont pas vides
    if (!pseudo || !password) {
      console.log("Veuillez remplir tous les champs.");
      return;
    }

    // Vérification que les champs ne contiennent pas uniquement des espaces
    if (!pseudo.trim() || !password.trim()) {
      console.log("Veuillez remplir tous les champs.");
      return;
    }

    // Préparation des données à envoyer
    const data = {
      pseudo,
      password,
    };

    // Envoi des données au serveur (ou affichage local pour l'instant)
    try {
      // Remplacer 'http://localhost:(000/login' par l'URL du serveur plus tard
      const response = await fetch('http://192.168.1.77:5000', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log("Réponse du serveur:", result);

      // Pour l'instant, nous affichons simplement les données
      console.log("Données envoyées:", data);

      // Stockage du pseudo dans AsyncStorage
      await AsyncStorage.setItem('@pseudo', pseudo);
      console.log('Pseudo sauvegardé avec succès !');

      // Redirection vers la page Accueil.js avec le pseudo comme paramètre
      navigation.navigate('Accueil', { pseudo });

    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Champ de saisie pour le pseudo */}
      <TextInput
        style={styles.input}
        placeholder="Pseudo"
        onChangeText={setPseudo}
        value={pseudo}
      />
      {/* Champ de saisie pour le mot de passe */}
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        onChangeText={setpassword}
        value={password}
        secureTextEntry={true} // Masquage du mot de passe
      />
      {/* Bouton de connexion */}
      <TouchableOpacity style={styles.button} onPress={handleConnexion}>
        <Text style={styles.buttonText}>Se connecter</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styles pour le composant Connexion
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Centrage vertical
    alignItems: 'center', // Centrage horizontal
    paddingHorizontal: 20,
  },
  input: {
    height: 40,
    width: '100%',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  button: {
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
