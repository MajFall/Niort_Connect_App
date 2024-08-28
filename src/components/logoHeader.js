import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

export default function LogoHeader() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/logo.png')}
        style={styles.logo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 0, // Espace supplémentaire en haut
  },
  logo: {
    width: 100,
    height: 100,
  },
});
