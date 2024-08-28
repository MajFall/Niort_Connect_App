import React, { useState } from 'react'; // Importation de React et du hook useState pour gérer les états
import { View, TextInput, TouchableOpacity, StyleSheet, Text, Image, Alert } from 'react-native'; // Importation des composants de base de React Native
import { useNavigation } from '@react-navigation/native'; // Importation du hook useNavigation pour la navigation
import LogoHeader from '../components/logoHeader'; // Importation du composant LogoHeader

// Composant d'inscription
export default function Inscription() {
  const navigation = useNavigation(); // Utilisation du hook de navigation

  // Définition des états pour le pseudo, le mot de passe et la confirmation du mot de passe
  const [pseudo, setPseudo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // État pour afficher/masquer le mot de passe
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // État pour afficher/masquer la confirmation du mot de passe

  // Fonction pour basculer la visibilité du mot de passe
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Fonction pour basculer la visibilité de la confirmation du mot de passe
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Fonction de validation des champs d'inscription
  const handleValidation = async () => {
    // Vérification que le pseudo est renseigné
    if (!pseudo) {
      Alert.alert('Erreur', 'Veuillez renseigner votre pseudo avant de valider.');
    } else if (pseudo === 'Maj') { // Vérification si le pseudo est égal à "Maj" pour aller rapidement quand je teste
      navigation.navigate('Preference', { pseudo }); // Passer le pseudo comme paramètre
    } else if (password === confirmPassword && password.length >= 8) { // Vérification de la correspondance et de la longueur du mot de passe
      try {
        // Envoi des données au serveur
        const response = await fetch('http://192.168.174.138:5000/inscription', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ pseudo, password }),
        });

        const result = await response.json();
        console.log("Réponse du serveur:", result);

        if (result.success) {
          Alert.alert('Succès', 'Inscription réussie');
          navigation.navigate('Preference', { pseudo }); // Passer le pseudo comme paramètre
        } else {
          Alert.alert('Erreur', result.message || 'Erreur lors de l\'inscription.');
        }
      } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        Alert.alert('Erreur', 'Une erreur est survenue. Veuillez réessayer.');
      }
    } else {
      Alert.alert('Erreur', 'Le mot de passe doit être identique et contenir au moins 8 caractères.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <LogoHeader /> 
      </View>
      <TextInput
        style={styles.input}
        placeholder="Pseudo"
        onChangeText={setPseudo} // Mise à jour de l'état pseudo
        value={pseudo}
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Mot de passe"
          onChangeText={setPassword} // Mise à jour de l'état password
          value={password}
          secureTextEntry={!showPassword} // Affichage/masquage du mot de passe
        />
        <TouchableOpacity onPress={togglePasswordVisibility} style={styles.passwordIcon}>
          <Image
            source={showPassword ? require('../../assets/images/visible.png') : require('../../assets/images/invisible.png')} // Icône d'affichage/masquage du mot de passe
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Confirmer le mot de passe"
          onChangeText={setConfirmPassword} // Mise à jour de l'état confirmPassword
          value={confirmPassword}
          secureTextEntry={!showConfirmPassword} // Affichage/masquage de la confirmation du mot de passe
        />
        <TouchableOpacity onPress={toggleConfirmPasswordVisibility} style={styles.passwordIcon}>
          <Image
            source={showConfirmPassword ? require('../../assets/images/visible.png') : require('../../assets/images/invisible.png')} // Icône d'affichage/masquage de la confirmation du mot de passe
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleValidation}>
        <Text style={styles.buttonText}>Valider</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styles pour le composant Inscription
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center', // Centrage horizontal
    justifyContent: 'flex-start', // Alignement vers le haut
    padding: 30,
  },
  header: {
    marginBottom: 20, // Marge inférieure pour séparer le logo du formulaire
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    marginBottom: 10,
    position: 'relative',
  },
  passwordInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  passwordIcon: {
    position: 'absolute',
    right: 10, // Positionnement de l'icône à droite
  },
  icon: {
    width: 20,
    height: 20,
  },
  button: {
    backgroundColor: '#00BFFF',
    padding: 10,
    borderRadius: 5,
    width: '80%',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center', // Centrage du texte dans le bouton
  },
});
