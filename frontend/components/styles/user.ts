import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    flexGrow: 1,
  },
  settingsIcon: {
    fontSize: 22,
    color: Colors.gray.dark,
  },
  profileContainer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 74,
    height: 74,
    borderRadius: 37,
    overflow: 'hidden',
    marginRight: 16,
  },
  avatarPlaceholder: {
    flex: 1,
    backgroundColor: Colors.gray.lighter,
  },
  avatarImage: {
    flex: 1,
  },
  profileTextContainer: {
    flex: 1,
  },
  nicknameText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.gray.dark,
    marginBottom: 2,
  },
  bioText: {
    fontSize: 14,
    color: Colors.gray.medium,
    marginBottom: 8,
  },
  profileEditButton: {
    backgroundColor: Colors.masil.background,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  profileEditButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.masil.point,
  },
  filterContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 20,
    paddingHorizontal: 14,
    height: 36,
    borderWidth: 1,
    borderColor: Colors.masil.border,
  },
  searchIcon: {
    marginRight: 6,
    fontSize: 14,
  },
  filterInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.gray.dark,
    paddingVertical: 0,
  },
  listContainer: {
    flex: 1,
    backgroundColor: Colors.masil.background,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  postCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 16,
    marginBottom: 14,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
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
  heartIcon: {
    fontSize: 12,
    marginRight: 4,
    resizeMode: 'contain',
  },
  commentIcon: {
    fontSize: 12,
    marginRight: 4,
    resizeMode: 'contain',
  },
  countText: {
    fontSize: 13,
    color: Colors.gray.medium,
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