import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from '@/constants/colors';

const { width } = Dimensions.get('window');
export const CARD_SIZE = (width - 48) / 3;

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
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    backgroundColor: Colors.masil.background,
    flexGrow: 1,
  },
  brandCard: {
    width: CARD_SIZE,
    height: CARD_SIZE + 20,
    backgroundColor: Colors.white,
    borderRadius: 16,
    margin: 4,
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