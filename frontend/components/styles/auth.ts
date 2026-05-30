import { StyleSheet } from 'react-native';

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  mainContainer: {
    width: 227,
    alignSelf: 'center',
    marginTop: 30,
    alignItems: 'center',
    gap: 42,
  },
  titleWrapper: {
    alignSelf: 'stretch',
    alignItems: 'flex-start',
    paddingHorizontal: 10,
  },
  inputGroup: {
    alignSelf: 'stretch',
    alignItems: 'center',
    gap: 25,
  },
  sectionWrapper: {
    width: '70%',
    minWidth: 200,
    alignItems: 'center',
    gap: 8,
  },
  title: {
    color: '#076E00',
    fontSize: 42,
    fontWeight: '900',
  },
  subtitle: {
    color: '#A3BF5B',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 5,
  },
  input: {
    alignSelf: 'stretch',
    height: 33,
    paddingHorizontal: 15,
    backgroundColor: '#CBE1B5',
    borderRadius: 15,
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  inputError: {
    borderWidth: 1,
    borderColor: '#E03E3E',
  },
  inputSuccess: {
    borderWidth: 1,
    borderColor: '#1F8A59',
  },
  disabledButton: {
    opacity: 0.5,
  },
  errorText: {
    alignSelf: 'stretch',
    color: '#E03E3E',
    fontSize: 10,
    marginTop: 4,
    textAlign: 'left',
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#333',
  },
  button: {
    width: '100%',
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  loginButtonFrame: {
    width: '100%',
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: '#ECF3D1',
    marginTop: 10,
  },
  emailSignupButton: {
    width: '88%',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 1,
    borderColor: '#ddd',
  },
 
  buttonRow: {
    width: '100%',
    gap: 5,
      alignItems: 'center',
  },
  googleButtonText: {
    color: '#333',
  },
  linkButton: {
    marginTop: 10,
  },
  linkText: {
    color: '#8DBA7D',
    fontSize: 12,
    fontWeight: '400',
    textDecorationLine: 'underline',
  },
  waveContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  waveBubble: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 260,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    top: -40,
    left: -70,
  },
  waveBubble2: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 240,
    backgroundColor: 'rgba(204, 234, 190, 0.18)',
    top: 80,
    right: -90,
  },
  waveBubble3: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 180,
    backgroundColor: 'rgba(255, 250, 227, 0.18)',
    bottom: -60,
    left: 40,
  },
});