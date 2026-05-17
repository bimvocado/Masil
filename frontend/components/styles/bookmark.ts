import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 56) / 2;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    padding: 20,
  },
  topBarButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: ITEM_WIDTH,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderColor: '#e8e8e8',
    marginBottom: 16,
  },
  labelContainer: {
    flex: 1,
    paddingRight: 4,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 2,
  },
  countText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'right',
  },
  deleteText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ff3b30',
    paddingLeft: 4,
  },
  addCategoryButton: {
    width: ITEM_WIDTH,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  addCategoryText: {
    fontSize: 14,
    color: '#999999',
    fontWeight: '500',
  },
});