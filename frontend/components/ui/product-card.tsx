import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';


export const ProductCard = ({ rank, name, price, likes, comments, imageUrl, onPress }: any) => (
  <TouchableOpacity style={cardStyles.container} onPress={onPress} activeOpacity={0.7}>
    <Text style={cardStyles.rankText}>{rank}</Text>

    {imageUrl ? (
      <Image
        source={{ uri: imageUrl }}
        style={cardStyles.imageCircle}
      />
    ) : (
      <View style={cardStyles.imageCircle} />
    )}

    <View style={cardStyles.infoContainer}>
      <Text style={cardStyles.nameText}>{name}</Text>
      <Text style={cardStyles.priceText}>{price}원</Text>
      <View style={cardStyles.divider} />
      <View style={cardStyles.iconRow}>
        <Text>👍 {likes}</Text>
        <Text>📝 {comments}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const cardStyles = StyleSheet.create({
  container: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 25, padding: 15, marginBottom: 12, alignItems: 'center', elevation: 3, shadowOpacity: 0.1 },
  rankText: { fontSize: 16, fontWeight: 'bold', marginRight: 15 },
  imageCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#eee' },
  infoContainer: { flex: 1, marginLeft: 15 },
  nameText: { fontSize: 16, fontWeight: 'bold' },
  priceText: { fontSize: 14, color: '#666', marginVertical: 4 },
  divider: { height: 1, backgroundColor: '#333', marginVertical: 8 },
  iconRow: { flexDirection: 'row', gap: 15 },
  iconText: { fontSize: 12, color: '#666' }
});