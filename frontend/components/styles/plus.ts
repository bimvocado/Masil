import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F8E6',
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
    color: '#333333',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
  },

  // 정사각형 이미지 업로드 
  imageUploadCard: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#ffffff',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  imageIconPlaceHolder: {
    width: 60,
    height: 60,
    tintColor: '#A5D6A7',
  },

  // 브랜드 이름 입력
  userInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 32,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#D9D9D9',
    marginRight: 16,
  },
  nameInputWrapper: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#666666',
    paddingBottom: 4,
  },
  nameInput: {
    fontSize: 16,
    color: '#333333',
    padding: 0,
  },

  // 본문 텍스트 입력
  contentUploadCard: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#ffffff',
    borderRadius: 32,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  contentInputBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 20,
    padding: 20,
  },
  contentInput: {
    flex: 1,
    fontSize: 15,
    color: '#333333',
    textAlignVertical: 'top',
  },

  submitButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#B3CBB3',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 24,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});