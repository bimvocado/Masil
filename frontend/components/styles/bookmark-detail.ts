import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  listContainer: {
    flex: 1,
    backgroundColor: Colors.masil.background,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  postCard: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    marginBottom: 14,
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  imageBackground: {
    width: '100%',
    minHeight: 140,
  },
  imageOverlay: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  cardLeft: {
    flex: 1,
    justifyContent: 'space-between',
    paddingRight: 12,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.gray.dark,
    marginBottom: 4,
    marginTop: 13,
    marginLeft: 13,
  },
  postHandle: {
    fontSize: 13,
    color: Colors.gray.medium,
    marginBottom: 8,

  },
  postDate: {
    fontSize: 13,
    color: Colors.gray.medium,
    marginBottom: 8,
    marginLeft: 13,

  },
  interactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 13,
    marginBottom: 13,
  },
  iconGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,

  },
  cardRight: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 16,
    backgroundColor: Colors.gray.lighter,
  },
});