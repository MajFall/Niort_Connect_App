#!/usr/bin/env python
# encoding: utf-8
import json
from flask import Flask, request, jsonify
from flask_cors import CORS  # Importation de CORS pour gérer les requêtes Cross-Origin


app = Flask(__name__)

CORS(app)  # Activation de CORS pour toutes les routes de l'application

# Une liste pour stocker les tokens Expo
expo_tokens = []

# Liste pour stocker les utilisateurs inscrits (simulé ici)
registered_users = []



@app.route('/')
def index():
    return jsonify([
        {
            'pseudo': 'Alice',
            'titre': 'Réduction Billet Cinéma',
            'message': 'Bonjour à tous ! Y a des Réductions de 50% sur les cartes au Nouveau Cinéma',
            'date_publication': "2024-03-30T15:09:36Z",
            'nombre_vote': 5,
            'categorie': 'divertissement',
            'commentaire': [{'auteur': 'Bob', 'contenu': 'Génial'},
                            {'auteur': 'Charlie', 'contenu': 'Très bien'}]
        },
        {
            'pseudo': 'Bob',
            'titre': 'Nouvelle Restaurant avec Réduction Etudiant',
            'message': 'Hello, Je suis allé au Resto BFF de la Brêche et ils disent qu\' il y\' a maintenant des réductions avec la carte étudiante !',
            'date_publication': "2024-03-24T10:30:00Z",
            'nombre_vote': 8,
            'categorie': 'Restauration',
            'commentaire': [{'auteur': 'Alice', 'contenu': 'Ça a l\'air Bien!'},
                            {'auteur': 'Jeanne', 'contenu': 'Super'},
                            {'auteur': 'Charlie', 'contenu': 'Je vais la tester ce soir !'}]
        },
        {
            'pseudo': 'Sokhna',
            'titre': 'Un medecin traitant pour tous, la nouvelle politique de la CPAM',
            'message': 'Pour tous les étudiants de Niort qui n\'ont pas encore de medecin, un atelier sera organisé prochainement à la breche regroupant des personnels de santé pour trouver son medecin traitant.',
            'date_publication': "2024-03-17T14:00:00Z",
            'nombre_vote': 12,
            'categorie': 'Santé',
            'commentaire': [{'auteur': 'Marc', 'contenu': 'Intéressant !'},
                            {'auteur': 'Emilie', 'contenu': 'cool'},
                            {'auteur': 'Kevin', 'contenu': 'Oui j\'ai reçu le mail'},
                            {'auteur': 'Sumeya', 'contenu': 'Vous n\'avez pas la date?'}]
        },
        {
            'pseudo': 'Emilie',
            'titre': 'Solde chez Gemo',
            'message': 'Jusqu\'au 15 Avril, retrouvez des réductions jusqu\'à -40% à Gemo, Avenue de Paris',
            'date_publication': "2024-03-14T14:00:00Z",
            'photo': 'sieste.jpeg',
            'nombre_vote': 10,
            'categorie': 'Shopping',
            'commentaire': [{'auteur': 'Marc', 'contenu': 'Merci'}]
        }
    ])

@app.route('/publications/new', methods=['POST'])
def new_publication():
    data = request.json
    print(data)
    return jsonify({"success": True}), 200

@app.route('/register-token', methods=['POST'])
def register_token():
    data = request.json
    token = data.get('token')
    if token and token not in expo_tokens:
        expo_tokens.append(token)
    print(f'Registered token: {token}')
    return jsonify({"success": True}), 200

@app.route('/notifications', methods=['POST'])
def receive_notification():
    data = request.json
    print("Notification reçue :", data)
    return jsonify({"success": True}), 200

def send_notification(to, title, body):
    # Simuler l'envoi de la notification en imprimant les détails
    notification = {
    
        'title': title,
        'body': body,
        'sound': 'default'
    }
    print("Notification simulée:", json.dumps(notification, indent=2))

@app.route('/notifications/send', methods=['POST'])
def simulate_notification():
    data = request.json
    to = data.get('to')
    title = data.get('title')
    body = data.get('body')
    send_notification(to, title, body)
    return jsonify({"success": True}), 200

@app.route('/notifications/like', methods=['POST'])
def send_like_notification():
    data = request.json
    post_author = data.get('postAuthor')

    #  la logique pour envoyer la notification à l'auteur de la publication ici

    return jsonify({"success": True}), 200

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    print(data)
    # Simuler une réponse JSON pour tester
    return jsonify({"success": True, "message": "Connexion réussie"}), 200

@app.route('/send-verification-code', methods=['POST'])
def send_verification_code():
    data = request.json
    email = data.get('email')
    print(f'Envoi du code de vérification à: {email}')
    # Simuler l'envoi d'un code de vérification (à remplacer par une vraie logique d'envoi d'email)
    verification_code = '1234'  # Génération du code de vérification
    return jsonify({"success": True, "verificationCode": verification_code}), 200

# Route pour gérer l'inscription d'un nouvel utilisateur
@app.route('/register', methods=['POST'])
def register():
    data = request.json  # Récupération des données JSON envoyées depuis l'application
    pseudo = data.get('pseudo')  # Récupération du pseudo de l'utilisateur
    password = data.get('password')  # Récupération du mot de passe de l'utilisateur

    # Vérification que les données ont été correctement reçues
    if pseudo and password:
        # Ajout du nouvel utilisateur à la liste (simulé ici)
        registered_users.append({'pseudo': pseudo, 'password': password})
        print(f'Nouvel utilisateur enregistré : {pseudo}')
        return jsonify({"success": True, "message": "Inscription réussie!"}), 200
    else:
        return jsonify({"success": False, "message": "Données manquantes."}), 400





if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
