import { View, Text, TextInput, StyleSheet } from 'react-native';

interface Props {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  multiline?: boolean;
  placeholder?: string;
}

export function ProfileInput({ label, value, onChangeText, multiline, placeholder }: Props) {
  return (
    <View style={styles.group}>
      <Text style={styles.label}>{label}</Text>
      <TextInput 
        style={[styles.input, multiline && styles.textArea]} 
        value={value} 
        onChangeText={onChangeText}
        multiline={multiline}
        placeholder={placeholder}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  group: { 
    width: '90%', 
    marginBottom: 20 
  },
  label: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    marginBottom: 8, 
    color: '#333' 
  },
  input: { 
  
    flexDirection: 'row',      
    alignItems: 'center',
    height: 48,              
    paddingLeft: 20,        
    alignSelf: 'stretch',      
    gap: 10,                   
    borderRadius: 20,          
    backgroundColor: '#F3F3F3', 
    fontSize: 16,
  },
  textArea: { 
    height: 100, 
    textAlignVertical: 'top',
    paddingTop: 20, 
    paddingLeft: 20,   
    borderRadius: 25,       
  },
});