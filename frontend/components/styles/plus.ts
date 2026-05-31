import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.masil.background,
    paddingHorizontal: 24,
  },

  // 헤더 (게시물 업로드 & 뒤로가기)
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    position: 'relative',
    height: 44,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    padding: 10,
  },
  backIcon: {
    fontSize: 22,
    color: Colors.gray.dark,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.gray.dark,
  },

  // 정사각형 이미지 업로드 
  imageUploadCard: {
    width: '70%',
    height: 200,
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  imageIconPlaceHolder: {
    width: 60,
    height: 60,
    tintColor: Colors.masil.icon,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
  },

  // 브랜드 이름 입력
  userInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 32,
    padding: 20,
    marginBottom: 20,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.gray.lighter,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameInputWrapper: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray.medium,
    paddingBottom: 4,
  },
  nameInput: {
    fontSize: 16,
    color: Colors.gray.dark,
    padding: 0,
  },

  // 본문 텍스트 입력
  contentUploadCard: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: Colors.white,
    borderRadius: 32,
    padding: 24,
    marginBottom: 20,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  contentInputBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.masil.border,
    borderRadius: 20,
    padding: 20,
  },
  contentInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.gray.dark,
    textAlignVertical: 'top',
  },

  submitButton: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.masil.button,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 24,
  },
  submitButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },

  // 브랜드 선택 시 뜨는 검색창에 사용
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  modalSearchBarContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  modalSearchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.masil.searchBar,
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 40,
    borderWidth: 1,
    borderColor: Colors.masil.border,
  },
  modalSearchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.gray.dark,
  },
  modalTabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: Colors.masil.border,
  },
  modalTabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 3,
    borderColor: 'transparent',
  },
  modalActiveTabButton: {
    borderColor: Colors.masil.point,
  },
  modalTabText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.gray.medium,
  },
  modalActiveTabText: {
    color: Colors.masil.point,
  },
  modalBrandGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    backgroundColor: Colors.masil.background,
    flexGrow: 1,
    paddingBottom: 100,
  },
  modalBrandCard: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: Colors.white,
    borderRadius: 16,
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
  modalBrandLogoCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.gray.lighter,
    marginBottom: 8,
  },
  modalBrandNameText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.gray.dark,
  },
    suggestionBox: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    marginTop: -8,
    marginBottom: 16,
    paddingVertical: 8,
    paddingHorizontal: 20,

    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  suggestionItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.masil.border,
  },

  suggestionText: {
    fontSize: 15,
    color: Colors.gray.dark,
  },
questionMark: {
  fontSize: 28,
  fontWeight: '700',
  color: Colors.gray.medium,
},
});