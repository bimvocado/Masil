import { StyleSheet } from 'react-native';

export const authStyles = StyleSheet.create({
  
  container: {
    flex: 1,
    paddingHorizontal: 40,
    justifyContent: 'center',
    backgroundColor: '#F0F9E8', 
  },
  
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#006400',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8DBA7D',
    marginBottom: 40,
  },
  
  input: {
    width: '100%',
    height: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.1)', 
    borderRadius: 25, 
    paddingHorizontal: 20,
    marginBottom: 12,
    textAlign: 'center',
    fontSize: 16,
  },
  
  button: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  whiteButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  kakaoButton: {
    backgroundColor: '#FEE500',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  }
});