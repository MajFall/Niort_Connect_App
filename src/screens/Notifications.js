// Importation des modules nécessaires depuis React et React Native
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import LogoHeader from '../components/logoHeader';

// Configuration du gestionnaire de notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// Fonction d'enregistrement pour les notifications push
const registerForPushNotificationsAsync = async () => {
  // Vérifie si le périphérique est physique
  if (Constants.isDevice) {
    // Obtient le statut actuel de la permission de notification
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;
    // Si la permission n'est pas encore accordée, la demande est faite
    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    // Si la permission est toujours refusée, affiche une alerte et arrête le processus
    if (finalStatus !== 'granted') {
      Alert.alert('Erreur', 'Failed to get push token for push notification!');
      return;
    }
    // Obtient le token pour les notifications push
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
    // Envoie le token à un serveur distant pour l'enregistrer
    await fetch('http://192.168.1.153:5000/register-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });
  } else {
    // Affiche une alerte si l'appareil n'est pas physique
    Alert.alert('Erreur', 'Must use physical device for Push Notifications');
  }

  // Configuration des canaux de notification pour Android
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
};

// Fonction pour envoyer une notification de commentaire
export const sendCommentNotification = (postAuthor, comment) => {
  const notificationTitle = 'Nouveau commentaire';
  const notificationBody = `Vous avez reçu un nouveau commentaire sur votre post: "${comment}" de la part de ${postAuthor}.`;
  // Programme l'envoi d'une notification avec un délai de 1 seconde
  Notifications.scheduleNotificationAsync({
    content: {
      title: notificationTitle,
      body: notificationBody,
    },
    trigger: { seconds: 1 },
  });
};

// Fonction pour envoyer une notification de like
export const sendLikeNotification = async (postAuthor) => {
  try {
    // Envoie une requête POST pour signaler un like
    const response = await fetch("http://192.168.1.152:5000/notifications/like", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postAuthor }),
    });
    // Vérifie la réponse du serveur
    if (!response.ok) {
      const errorResponse = await response.json();
      console.error('Erreur lors de l\'envoi de la notification de like:', errorResponse.message);
    }
  } catch (error) {
    console.error('Erreur réseau lors de l\'envoi de la notification de like:', error);
  }
};

// Composant principal pour afficher les notifications
export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Enregistre le périphérique pour les notifications push
    registerForPushNotificationsAsync();

    // Ajoute un listener pour les notifications reçues
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      setNotifications(prevNotifications => [notification, ...prevNotifications]);
    });

    // Nettoie le listener lors du démontage du composant
    return () => subscription.remove();
  }, []);

  // Fonction pour rendre un élément de la liste des notifications
  const renderItem = ({ item }) => (
    <View style={styles.notificationItem}>
      <Text style={styles.notificationTitle}>{item.request.content.title}</Text>
      <Text style={styles.notificationBody}>{item.request.content.body}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <LogoHeader />
      </View>
      <View style={styles.content}>
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={item => item.request.identifier}
        />
      </View>
    </View>
  );
}

// Styles pour le composant NotificationsScreen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5fcff',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  notificationItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  notificationBody: {
    fontSize: 16,
  },
});
