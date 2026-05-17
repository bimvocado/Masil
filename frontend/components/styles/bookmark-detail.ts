import { StyleSheet } from 'react-native';

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
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 40,
  },
  searchIconImage: {
    width: 16,
    height: 16,
    marginRight: 8,
    tintColor: '#aaa',
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#333',
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
    borderColor: '#f0f0f0',
  },
  bookmarkButton: {
    paddingRight: 16,
  },
  bookmarkIcon: {
    width: 22,
    height: 22,
  },
  cardLeft: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 12,
  },
  postTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 2,
  },
  postHandle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  postDate: {
    fontSize: 13,
    color: '#999999',
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
  heartIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  commentIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  countText: {
    fontSize: 13,
    color: '#666666',
  },
  thumbnailPlaceholder: {
    width: 76,
    height: 76,
    borderRadius: 16,
    backgroundColor: '#e0e0e0',
  },
});