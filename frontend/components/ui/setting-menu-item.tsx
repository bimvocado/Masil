import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}

export function SettingMenuItem({ icon, label, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <View style={styles.iconBox}>
        <Ionicons name={icon} size={24} color="black" />
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#EEE', borderRadius: 25, padding: 18, marginBottom: 15, width: '90%' },
  iconBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F9F9F9', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  label: { fontSize: 16, fontWeight: '500',  }
});