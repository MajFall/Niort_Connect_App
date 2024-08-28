import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../styles/accueilStyles';

export default function FirstPage() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Conteneur pour aligner le logo et le texte horizontalement */}
      <View style={styles.logoContainer}>
        {/* Logo en haut à gauche */}
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
        />
        
        {/* Texte "Niort Connect" à côté du logo avec le 'o' en bleu */}
        <Text style={styles.niortConnectText}>
          <Text>Ni</Text>
          <Text style={styles.blueText}>o</Text>
          <Text>rt Connect</Text>
        </Text>
      </View>
      
      {/* Conteneur pour centrer le texte */}
      <View style={styles.centeredTextContainer}>
        {/* Phrase de bienvenue */}
        <Text style={styles.welcomeText}>Bienvenue chers étudiants</Text>
        
        {/* Texte sur Niort */}
        <Text style={styles.descriptionText}>
          Explorez, partagez et découvrez tout ce que Niort a à vous offrir. 🚀
        </Text>
      </View>

      {/* Boutons pour inscription et connexion */}
      <TouchableOpacity
        style={[styles.emailButton, {alignSelf: 'center'}]}
        onPress={() => navigation.navigate('Inscription')}
      >
        <Text style={styles.emailButtonText}>Inscription</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.emailButton, {alignSelf: 'center'}]}
        onPress={() => navigation.navigate('Connexion')}
      >
        <Text style={styles.emailButtonText}>Connexion</Text>
      </TouchableOpacity>

      {/* Photo en bas qui prend tout l'espace restant */}
      <Image
        source={require('../../assets/images/accueil.jpg')}
        style={styles.bottomImage}
      />
    </View>
  );
}

