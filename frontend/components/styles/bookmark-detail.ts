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
  },
  postHandle: {
    fontSize: 13,
    color: Colors.gray.medium,
    marginBottom: 8,
  },
  postDate: {
    fontSize: 13,
    color: Colors.gray.medium,
    marginBottom: 12,
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