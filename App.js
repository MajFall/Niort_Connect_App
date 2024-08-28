import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';

// Importation des composants d'écran depuis leurs fichiers respectifs
import FirstPage from './src/screens/FirstPage';
import Inscription from './src/screens/Identification';
import Connexion from './src/screens/Connexion';
import Inscription_ from './src/screens/Inscription';
import Acceuil from './src/screens/Accueil';
import Preference from './src/screens/Preference';
import Profil from './src/screens/Profil';
import NotificationsScreen from './src/screens/Notifications';
import Publication from './src/screens/Publication';

// Création des navigateurs
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Composant de navigation pour les onglets
const ThumbNavigation = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;

        // Définition de l'icône en fonction de l'onglet sélectionné
        if (route.name === 'Accueil') {
          iconName = 'home';
        } else if (route.name === 'Publier') {
          iconName = 'add';
        } else if (route.name === 'Notifications') {
          iconName = 'notifications';
        } else if (route.name === 'Profil') {
          iconName = 'person';
        }

        // Retourne l'icône appropriée avec la couleur et la taille données
        return <Ionicons name={iconName} size={size} color={color} />;
      },
    })}
    tabBarOptions={{
      activeTintColor: '#00BFFF',  // Couleur des icônes actives
      inactiveTintColor: 'gray',   // Couleur des icônes inactives
    }}
  >
    {/* Définition des onglets et leurs composants */}
    <Tab.Screen name="Accueil" component={Acceuil} />
    <Tab.Screen name="Publier" component={Publication} />
    <Tab.Screen name="Notifications" component={NotificationsScreen} />
    <Tab.Screen name="Profil" component={Profil} />
  </Tab.Navigator>
);

// Composant principal de l'application
export default function App() {
  useEffect(() => {
    const registerForPushNotificationsAsync = async () => {
      // Si l'application est sur Android, définir le canal de notification
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      // Demander les permissions de notification
      const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      if (status !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        if (status !== 'granted') {
          alert('Failed to get push token for push notification!');
          return;
        }
      }

      // Obtenir le token de notification
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);  // Afficher le token pour le débogage
    };

    // Appeler la fonction pour s'enregistrer aux notifications push
    registerForPushNotificationsAsync();
  }, []);

  // Retourner le conteneur de navigation en utilisant Stack Navigator pour la première page et ThumbNavigation pour les autres pages
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="FirstPage" component={FirstPage} options={{ headerShown: false }} />
        <Stack.Screen name="Accueil" component={ThumbNavigation} options={{ headerShown: false }} />
        <Stack.Screen name="Inscription" component={Inscription} />
        <Stack.Screen name="Connexion" component={Connexion} />
        <Stack.Screen name="Inscription_" component={Inscription_} />
        <Stack.Screen name="Preference" component={Preference} />
        <Stack.Screen name="Publication" component={Publication} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="Profil" component={Profil} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
