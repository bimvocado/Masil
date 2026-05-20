import { useLocalSearchParams,useRouter } from 'expo-router';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { TopBar } from '@/components/layout/top-bar';
import { ProductCard } from '@/components/ui/product-card';

export default function BrandDetailScreen() {
  const { name } = useLocalSearchParams(); 
  const router = useRouter();

  return (
    <View style={detailStyles.container}>
      <TopBar title={name as string} showBackButton={true} />
      
      <ScrollView style={{ backgroundColor: '#f5fbe7' }} contentContainerStyle={{ padding: 20 }}>
        <Text style={detailStyles.headerText}>53개의 템이 있소</Text>
        
        {/* 부품(ProductCard)으로 리스트 쫙 뿌리기 */}
        {[1, 2, 3, 4].map((item) => (
          <ProductCard 
          key={item}
          rank={item}
          name="상품이름"
          price="1,234"
          likes="1,234"
          comments="1,234"
          onPress={() => router.push({
            pathname: "/search/product/[id]", // 상품 상세 경로
            params: { id: item, name: "상품이름" }
          } as any)}
        />
        ))}
      </ScrollView>
    </View>
  );
}

const detailStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerText: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 20 },
});