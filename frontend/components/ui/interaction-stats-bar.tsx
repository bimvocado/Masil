// 📍 경로: components/InteractionStatsBar.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface InteractionStatDetail {
  total: number; 
  ratio: number; 
  korean: number; 
  foreigner: number; 
}

interface InteractionStatsBarProps {
  likeStats?: InteractionStatDetail;
  dislikeStats?: InteractionStatDetail;
}

const COLOR_LIKE_KOR = '#45a350';
const COLOR_LIKE_FOR = '#2a4732';
const COLOR_DISLIKE_KOR = '#4A4A4A';
const COLOR_DISLIKE_FOR = '#D3D3D3';
const COLOR_BG = '#F5F5F5';

export function InteractionStatsBar({ likeStats, dislikeStats }: InteractionStatsBarProps) {
  
  const getStats = (stats?: InteractionStatDetail) => ({
    total: stats?.total || 0,
    ratio: stats?.ratio || 0,
    korean: stats?.korean || 0,
    foreigner: stats?.foreigner || 0,
  });

  const like = getStats(likeStats);
  const dislike = getStats(dislikeStats);

  const calcDetailPercent = (count: number, total: number) => {
    return total > 0 ? Math.round((count / total) * 100) : 0;
  };

  const likeKoreanPercent = calcDetailPercent(like.korean, like.total);
  const likeForeignerPercent = calcDetailPercent(like.foreigner, like.total);
  const dislikeKoreanPercent = calcDetailPercent(dislike.korean, dislike.total);
  const dislikeForeignerPercent = calcDetailPercent(dislike.foreigner, dislike.total);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>통계</Text>

      {/* 옳소 통계 */}
      <View style={styles.statBlock}>
        {/* 헤더 */}
        <View style={styles.headerRow}>
          <Text style={[styles.mainLabel, { color: COLOR_LIKE_KOR }]}>옳소</Text>
          <Text style={styles.mainCount}>{like.total}명</Text>
          <Text style={styles.mainPercent}>{like.ratio}%</Text>
        </View>

        <View style={styles.barBackground}>
          {like.total > 0 && (
            <>
              <View style={[styles.progressBar, { width: `${likeKoreanPercent}%`, backgroundColor: COLOR_LIKE_KOR }]} />
              <View style={[styles.progressBar, { width: `${likeForeignerPercent}%`, backgroundColor: COLOR_LIKE_FOR }]} />
            </>
          )}
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailText}>내국인 {like.korean}명 {likeKoreanPercent}%</Text>
          <Text style={styles.detailText}>외국인 {like.foreigner}명 {likeForeignerPercent}%</Text>
        </View>
      </View>

      {/* 싫소 통계 */}
      <View style={styles.statBlock}>
        {/* 헤더 */}
        <View style={styles.headerRow}>
          <Text style={[styles.mainLabel, { color: COLOR_DISLIKE_KOR }]}>싫소</Text>
          <Text style={styles.mainCount}>{dislike.total}명</Text>
          <Text style={styles.mainPercent}>{dislike.ratio}%</Text>
        </View>

        <View style={styles.barBackground}>
          {dislike.total > 0 && (
            <>
              <View style={[styles.progressBar, { width: `${dislikeKoreanPercent}%`, backgroundColor: COLOR_DISLIKE_KOR }]} />
              <View style={[styles.progressBar, { width: `${dislikeForeignerPercent}%`, backgroundColor: COLOR_DISLIKE_FOR }]} />
            </>
          )}
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailText}>내국인 {dislike.korean}명 {dislikeKoreanPercent}%</Text>
          <Text style={styles.detailText}>외국인 {dislike.foreigner}명 {dislikeForeignerPercent}%</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  statBlock: {
    marginBottom: 25,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  mainLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  mainCount: {
    fontSize: 14,
    color: '#444',
    marginRight: 'auto', 
  },
  mainPercent: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },

  barBackground: {
    height: 10,
    backgroundColor: COLOR_BG,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8,
    flexDirection: 'row'
  },
  progressBar: {
    height: '100%',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailText: {
    fontSize: 12,
    color: '#A0A0A0', 
  },
});