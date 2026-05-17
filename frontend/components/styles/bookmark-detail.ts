import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  searchBarContainer: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.masil.searchBar,
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 40,
  },
  searchIconImage: {
    width: 16,
    height: 16,
    marginRight: 8,
    tintColor: Colors.gray.light,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: Colors.gray.dark,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  postCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: Colors.masil.border,
  },
  bookmarkButton: {
    paddingRight: 16,
  },

  cardLeft: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 12,
  },
  postTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.gray.dark,
    marginBottom: 2,
  },
  postHandle: {
    fontSize: 14,
    color: Colors.gray.medium,
    marginBottom: 4,
  },
  postDate: {
    fontSize: 13,
    color: Colors.gray.light,
    marginBottom: 8,
  },
  interactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  
  thumbnailPlaceholder: {
    width: 76,
    height: 76,
    borderRadius: 16,
    backgroundColor: Colors.gray.lighter,
  },
});