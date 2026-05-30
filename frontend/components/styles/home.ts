import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
export const DRAWER_WIDTH = width * 0.7;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  reelsPostContainer: {
    width: width,
    height: height,
    position: 'relative',
  },
  fullScreenPlaceholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#b0b0b0',
  },

  topTabContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  topTabButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
  },
  topTabText: {
    fontSize: 16,
    width: 40,
    textAlign: 'center',
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  activeTopTabText: {
    color: '#ffffff',
    borderBottomWidth: 2,
    borderColor: '#ffffff',
  },
  topProfileContainer: {
    position: 'absolute',
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniAvatar: { // 유저 프로필 사진
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#dbdbdb',
    marginRight: 8,
  },
  miniUsername: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginRight: 4,
  },
  starIcon: {
    fontSize: 14,
  },

  // 좌측 하단 정보 영역 (브랜드, 리뷰 코멘트, 태그)
  bottomInfoContainer: {
    position: 'absolute',
    left: 16,
    bottom: 120, 
    width: width * 0.75,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  brandLogoCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ffb3b3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  brandLogoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  brandNameText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  reviewCommentText: {
    fontSize: 14,
    color: '#ffffff',
    lineHeight: 20,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
  },

// 우측 하단 인터랙션 버튼
  rightActionsContainer: {
    position: 'absolute',
    right: 20,
    bottom: 250,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButton: {
    alignItems: 'center',
    marginVertical: 16,
  },
  actionIconImage: {
    width: 25,
    height: 25,
    marginBottom: 4,
    resizeMode: 'contain',
    tintColor: '#ffffff',
  },
  actionIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },

  actionCountText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
  },

  // 왼쪽 슬라이드 보관함 사이드바
  drawerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    flexDirection: 'row',
    zIndex: 999,
  },
  drawerContainer: {
    width: DRAWER_WIDTH,
    height: '100%',
    backgroundColor: '#ffffff',
    borderTopRightRadius: 32,
    borderBottomRightRadius: 32,
    paddingTop: 60,
    paddingHorizontal: 24,
    zIndex: 1000,
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 32,
  },
  drawerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  drawerItemName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333333',
  },
  drawerItemCount: {
    fontSize: 15,
    color: '#666666',
  },
  drawerCloseArea: {
    width: width - DRAWER_WIDTH,
  },
});