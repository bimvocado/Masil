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
  group: { width: '100%', marginBottom: 20 },
  label: { fontSize: 14, fontWeight: 'bold', marginBottom: 8, color: '#333' },
  input: { backgroundColor: '#F5F5F5', borderRadius: 10, padding: 15, fontSize: 16 },
  textArea: { height: 100, textAlignVertical: 'top' }
});