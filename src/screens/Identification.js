import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LogoHeader from '../components/logoHeader';

export default function Identification() {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  const handleVerification = async () => {
    if (emailIsValid(email)) {
      // Envoyer l'e-mail au serveur pour générer et envoyer le code de vérification
      await sendVerificationCode(email);
    } else {
      Alert.alert('Erreur', 'Veuillez entrer une adresse e-mail valide.');
    }
  };

  const handleValidation = () => {
    if (verificationCode === '1234') { // Exemple de code de vérification
      Alert.alert('Succès', 'E-mail vérifié avec succès');
      navigation.navigate('Inscription_');
    } else {
      Alert.alert('Erreur', 'Code de vérification incorrect.');
    }
  };

  const emailIsValid = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const sendVerificationCode = async (email) => {
    try {
      const response = await fetch('http://192.168.174.138:5000/inscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      console.log("Réponse du serveur:", result);

      if (result.success) {
        Alert.alert('Succès', 'Code de vérification envoyé à votre e-mail.');
        // Simuler la réception du code de vérification
        setVerificationCode(result.verificationCode || '1234'); // À remplacer par le vrai code reçu du serveur
      } else {
        Alert.alert('Erreur', result.message || 'Erreur lors de l\'envoi du code de vérification.');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'e-mail:', error);
      Alert.alert('Erreur', 'Une erreur est survenue. Veuillez réessayer.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <LogoHeader />
      </View>
      <TextInput
        style={styles.input}
        placeholder="Email Scolaire"
        onChangeText={setEmail}
        value={email}
      />
      <TouchableOpacity style={styles.button} onPress={handleVerification}>
        <Text style={styles.buttonText}>Vérifier</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Code reçu par mail"
        onChangeText={setVerificationCode}
        value={verificationCode}
      />
      <TouchableOpacity style={styles.button} onPress={handleValidation}>
        <Text style={styles.buttonText}>Valider</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 30,
  },
  header: {
    marginBottom: 20,
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
    textAlign: 'center',
  },
});
