import React, { useEffect, useState } from 'react'; // Importation des hooks useEffect et useState de React
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native'; // Importation des composants React Native

import LogoHeader from '../components/logoHeader'; // Importation d'un composant personnalisé pour l'en-tête
import { Ionicons } from '@expo/vector-icons'; // Importation de l'icône Ionicons
import { sendLikeNotification } from './Notifications'; // Importation de la fonction pour envoyer des notifications de like

import { sendCommentNotification } from './Notifications'; // Importation de la fonction pour envoyer des notifications de commentaire

// Définition du composant principal Accueil
export default function Accueil({ navigation, pseudo }) {
  const [posts, setPosts] = useState([]); // État pour stocker les publications
  const [showCommentsIndex, setShowCommentsIndex] = useState(null); // État pour afficher les commentaires d'une publication spécifique
  const [newComment, setNewComment] = useState(''); // État pour le nouveau commentaire

  // useEffect pour récupérer les publications depuis le serveur lors du montage du composant
  useEffect(() => {
    fetch('http://172.20.10.4:5000') // Reception des données depuis la base de donnée
      .then(response => response.json())
      .then(json => {
        setPosts(json); // Mise à jour de l'état avec les publications reçues
      })
      .catch(error => {
        console.error(error); // Affichage des erreurs éventuelles
      });
  }, []);

  // Fonction pour liker une publication
  const handleLike = (index, postAuthor) => {
    sendLikeNotification(postAuthor); // Envoi de la notification de like à l'auteur de la publication
  };

  // Fonction pour voter (liker ou retirer le like) une publication
  const handleVote = (index) => {
    const updatedPosts = [...posts]; // Copie des publications pour modification
    updatedPosts[index].nombre_vote += updatedPosts[index].voted ? -1 : 1; // Mise à jour du nombre de votes
    updatedPosts[index].voted = !updatedPosts[index].voted; // Mise à jour de l'état de vote
    setPosts(updatedPosts); // Mise à jour de l'état avec les nouvelles publications

    sendLikeNotification(updatedPosts[index].pseudo); // Envoi de la notification de like
  };

  // Fonction pour envoyer une notification de like
  const sendLikeNotification = async (postAuthor) => {
    try {
      const response = await fetch("http://192.168.1.77:5000", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postAuthor }), // Corps de la requête avec l'auteur de la publication
      });
      if (!response.ok) {
        const errorResponse = await response.json();
        console.error('Erreur lors de l\'envoi de la notification de like:', errorResponse.message);
      }
    } catch (error) {
      console.error('Erreur réseau lors de l\'envoi de la notification de like:', error);
    }
  };

  // Fonction pour basculer l'affichage des commentaires pour une publication spécifique
  const toggleComments = (index) => {
    setShowCommentsIndex(index === showCommentsIndex ? null : index); // Basculer l'index des commentaires affichés
  };

  // Fonction pour ajouter un nouveau commentaire à une publication
  const handleAddComment = (index) => {
    const updatedPosts = [...posts]; // Copie des publications pour modification
    updatedPosts[index].commentaire.push({ auteur: pseudo, contenu: newComment }); // Ajout du nouveau commentaire
    setPosts(updatedPosts); // Mise à jour de l'état avec les nouvelles publications
    setNewComment(''); // Réinitialisation du champ de commentaire

    sendCommentNotification(updatedPosts[index].pseudo, newComment); // Envoi de la notification de commentaire
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <LogoHeader /> 
        </View>
        <View style={styles.content}>
          {posts.map((post, index) => (
            <View key={index} style={styles.postContainer}>
              <View style={styles.postHeader}>
                <Text style={styles.title}>{post.pseudo}</Text>
                <Text style={styles.date}>{formatDate(post.date_publication)}</Text>
              </View>
              <TouchableOpacity onPress={() => toggleComments(index)}>
                <Text style={styles.details}>{post.titre}</Text>
                <Text style={styles.message}>{post.message}</Text>
              </TouchableOpacity>
              <View style={styles.voteContainer}>
                <TouchableOpacity onPress={() => handleVote(index)} style={styles.voteButton}>
                  <Ionicons name={'heart'} size={24} color={post.voted ? '#00BFFF' : '#DCDCDC'} />
                  <Text style={styles.voteCount}>{post.nombre_vote}</Text>
                </TouchableOpacity>
              </View>
              {showCommentsIndex === index && (
                <View style={styles.commentContainer}>
                  <ScrollView style={styles.commentScroll}>
                    {post.commentaire.map((comment, commentIndex) => (
                      <View key={commentIndex} style={[styles.comment, comment.auteur === pseudo ? styles.userComment : null]}>
                        <Text>{comment.auteur}: {comment.contenu}</Text>
                      </View>
                    ))}
                  </ScrollView>
                  <TextInput
                    placeholder="Votre commentaire"
                    value={newComment}
                    onChangeText={setNewComment}
                    style={styles.input}
                  />
                  <TouchableOpacity onPress={() => handleAddComment(index)} style={styles.submitButton}>
                    <Text style={styles.submitButtonText}>Ajouter un commentaire</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

// Fonction pour formater la date en chaîne lisible
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) {
    return "Il y a moins d'une minute";
  }
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `Il y a ${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `Il y a ${hours} heure${hours !== 1 ? 's' : ''}`;
  }
  const days = Math.floor(hours / 24);
  return `Il y a ${days} jour${days !== 1 ? 's' : ''}`;
}

// Styles pour le composant Accueil
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5fcff',
  },
  headerContainer: {
    flexDirection: 'row',
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
  postContainer: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    width: '100%', // Prend toute la largeur disponible
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  date: {
    fontSize: 12,
    marginLeft: 'auto',
    color: '#666',
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    marginRight: 10,
  },
  details: {
    fontSize: 20,
    marginBottom: 5,
    alignItems: 'center',
    fontWeight: 'bold',
  },
  messageContainer: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
  },
  voteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  voteCount: {
    marginLeft: 5,
  },
  commentContainer: {
    marginTop: 10,
  },
  commentScroll: {
    maxHeight: 100,
    marginBottom: 10,
  },
  comment: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  userComment: {
    backgroundColor: '#00BFFF', // Couleur de fond différente pour les commentaires de l'utilisateur
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
});
