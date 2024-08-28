import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Modal, Pressable } from 'react-native';
import LogoHeader from '../components/logoHeader';
import * as Notifications from 'expo-notifications';

export default function Publication({ route }) {
  const [titre, setTitre] = useState('');
  const [message, setMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  // Tableau des catégories disponibles pour les publications
  const categories = ['Divertissement', 'Restauration', 'Logement', 'Étude', 'Santé', 'Shopping'];

  // Fonction pour gérer l'envoi d'une nouvelle publication
  const handlePublication = async () => {
    const publicationData = {
      titre,
      message,
      categorie: selectedCategory,
    };
    console.log(publicationData);

    try {
      // Envoyer la publication au serveur 
      const response = await fetch('http://192.168.174.138:5000/publications/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(publicationData),
      });

      if (response.ok) {
        // Planifie l'envoi d'une notification locale pour informer l'utilisateur que sa publication a été envoyée avec succès
        await Notifications.scheduleNotificationAsync({
          content: {
            title: `Votre publication "${titre}" est envoyée avec succès`,
            body: 'Votre publication est en attente de vérification par le modérateur.',
          },
          trigger: null, // Envoyer immédiatement
        });

        // Réinitialise les champs du formulaire après l'envoi de la publication
        setTitre('');
        setMessage('');
        setSelectedCategory('');
      } else {
        console.error('Erreur lors de l\'envoi de la publication :', response.statusText);
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la publication :', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <LogoHeader />
        </View>
        <View style={styles.content}>
          <TextInput
            placeholder="Titre"
            value={titre}
            onChangeText={setTitre}
            style={styles.input}
          />
          <TextInput
            placeholder="Message"
            value={message}
            onChangeText={setMessage}
            style={[styles.input, { height: 100 }]}
            multiline
          />
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.input}>
            <Text>{selectedCategory || 'Sélectionner une catégorie'}</Text>
          </TouchableOpacity>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                {categories.map((category, index) => (
                  <Pressable
                    key={index}
                    onPress={() => {
                      setSelectedCategory(category);
                      setModalVisible(!modalVisible);
                    }}
                    style={[styles.categoryItem, { backgroundColor: category === selectedCategory ? '#00BFFF' : '#fff' }]}
                  >
                    <Text style={styles.categoryText}>{category}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </Modal>
          <TouchableOpacity onPress={handlePublication} style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Publier</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '100%',
  },
  submitButton: {
    backgroundColor: '#00BFFF',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  categoryItem: {
    padding: 10,
    marginBottom: 10,
    width: '100%',
    borderRadius: 5,
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 16,
  },
});
