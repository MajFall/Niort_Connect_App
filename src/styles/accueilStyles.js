import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: 30,
  },
  logoContainer: {
    flexDirection: 'row', // Aligner le logo et le texte horizontalement
    alignItems: 'center', // Centrer les éléments verticalement
  },
  logo: {
    width: 100,
    height: 100,
    marginTop: 20,
    marginBottom: 30,
  },
  niortConnectText: {
    marginLeft: 10,
    fontSize: 20,
    fontFamily: 'Times New Roman', // Appliquer la police Times New Roman
  },
  blueText: {
    color: '#00BFFF', // Couleur bleue pour le 'o'
  },
  centeredTextContainer: {
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
  },
  emailButton: {
    backgroundColor: '#00BFFF',
    alignItems: 'center',
    padding: 15,
    marginTop: 30,
    borderRadius: 10,
    width: '60%',
  },
  emailButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  bottomImage: {
    flex: 1,
    width: '100%',
    resizeMode: 'contain',
  },
});
