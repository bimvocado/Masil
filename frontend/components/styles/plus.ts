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
  imageUploadCardSmall: {
    width: '100%',
    height: 120,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: Colors.masil.border,
    borderStyle: 'dashed',
  },
  imagePlaceholderText: {
    color: Colors.gray.light,
    fontSize: 14,
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

  // 브랜드 이름 입력 카드
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
    overflow: 'hidden',
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

  // 단가 입력 로우 관련
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  priceLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.gray.dark,
    marginRight: 16,
    width: 40,
  },
  priceInput: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 44,
    borderWidth: 1,
    borderColor: Colors.masil.border,
    fontSize: 15,
  },

  // 구분선 및 추천 섹션
  divider: {
    height: 1,
    backgroundColor: Colors.masil.border,
    marginVertical: 20,
  },
  recommendSection: {
    marginBottom: 24,
  },
  recommendTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.gray.dark,
    marginBottom: 16,
  },

  // 본문 텍스트 입력 및 버튼
  contentInput: {
    width: '100%',
    height: 200,
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 20,
    fontSize: 15,
    color: Colors.gray.dark,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.masil.border,
    textAlignVertical: 'top',
  },
  nextButton: {
    width: '100%',
    backgroundColor: Colors.masil.button,
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  nextButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },

  // 자동완성 (Suggestions)
  suggestionsContainer: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    marginTop: -12,
    marginBottom: 20,
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

  // 모달 레이아웃 및 탭
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    height: '80%',
    backgroundColor: Colors.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
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

  // 모달 내부 브랜드 검색 및 리스트 아이템 디자인
  brandSearchInput: {
    backgroundColor: Colors.masil.searchBar,
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: Colors.masil.border,
    fontSize: 15,
    marginBottom: 16,
  },
  brandItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.masil.border,
  },
  brandLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray.lighter,
    marginRight: 16,
  },
  brandNameText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.gray.dark,
  },

  // 모달 닫기 버튼
  closeButton: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.gray.lighter,
    borderRadius: 20,
    marginTop: 12,
    marginBottom: 24,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.gray.dark,
  },

  questionMark: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.gray.medium,
  },
});