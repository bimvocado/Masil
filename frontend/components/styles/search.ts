import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from '@/constants/colors';

// const { width } = Dimensions.get('window');

// 기존 코드 : width가 전체 기기 화면 너비 기준이라 실제 설정 값보다 크게 계산될 수 있음.
// export const CARD_SIZE = (width - 48) / 3;

// 수정
export const CARD_SIZE = '30%';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  searchBarContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.masil.searchBar,
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 40,
    borderWidth: 1,
    borderColor: Colors.masil.border,
  },
  searchIcon: {
    marginRight: 8,
    fontSize: 16,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.gray.dark,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: Colors.masil.border,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 3,
    borderColor: 'transparent',
  },
  activeTabButton: {
    borderColor: Colors.masil.point,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.gray.medium,
  },
  activeTabText: {
    color: Colors.masil.point,
  },
  gridContainer: {
    // 기존
    // flexDirection: 'row',
    // flexWrap: 'wrap',
    // padding: 12,
    // backgroundColor: Colors.masil.background,
    // flexGrow: 1,

    // 수정
      flexDirection: 'row',
      flexWrap: 'wrap',
      padding: 12,
      backgroundColor: Colors.masil.background,
      flexGrow: 1,
  },
  brandCard: {

    // 기존 WINDOW 기준
    // width: CARD_SIZE,
    // height: CARD_SIZE + 20,

    // 수정
    width: '30%',
    aspectRatio: 1,

    backgroundColor: Colors.white,
    borderRadius: 16,

    // margin: 4,
    margin: '1.66%',

    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,

    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  logoCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.gray.lighter, // 나중에 이미지 들어갈 자리
    marginBottom: 8,
  },
  brandNameText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.gray.dark,
  },
});