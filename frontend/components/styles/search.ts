import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
export const CARD_SIZE = (width - 48) / 3;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  searchBarContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 40,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchIcon: {
    marginRight: 8,
    fontSize: 16,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 3,
    borderColor: 'transparent',
  },
  activeTabButton: {
    borderColor: '#009205',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#888',
  },
  activeTabText: {
    color: '#009205',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    backgroundColor: '#edf3d2',
    flexGrow: 1,
  },
  brandCard: {
    width: CARD_SIZE,
    height: CARD_SIZE + 20,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    margin: 4,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  logoCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ccc', // 나중에 이미지 들어갈 자리
    marginBottom: 8,
  },
  brandNameText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
  },
});