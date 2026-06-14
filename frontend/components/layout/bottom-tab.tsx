import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useRouter, Href, useSegments, usePathname } from 'expo-router'; 
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function BottomTab() {
  const segments = useSegments(); 
  const pathname = usePathname();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const currentTab = segments[1]; 

const handlePress = (path: string) => {
    if (pathname === path) return;

    if (pathname.startsWith(path)) {
      if (router.canDismiss()) {
        router.dismissAll(); 
      } else {
        router.replace(path as Href);
      }
    } else {
      router.navigate(path as Href);
    }
  };

  const touchSlop = { top: 15, bottom: 15, left: 15, right: 15 };

  return (
    <View 
      style={[
        bottomTabStyles.container,
        { paddingBottom: insets.bottom > 0 ? insets.bottom + 10 : 30 } 
      ]}
    >
      <TouchableOpacity onPress={() => handlePress('/bookmark')} hitSlop={touchSlop}>
        <Image
          source={require('@/assets/icons/bookmark.png')}
          style={[
            bottomTabStyles.icon,
            currentTab === 'bookmark' && bottomTabStyles.activeIcon,
          ]}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handlePress('/search')} hitSlop={touchSlop}>
        <Image
          source={require('@/assets/icons/search.png')}
          style={[
            bottomTabStyles.icon,
            currentTab === 'search' && bottomTabStyles.activeIcon,
          ]}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handlePress('/home')} hitSlop={touchSlop}>
        <Image
          source={require('@/assets/icons/home.png')}
          style={[
            bottomTabStyles.icon,
            currentTab === 'home' && bottomTabStyles.activeIcon,
          ]}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handlePress('/plus')} hitSlop={touchSlop}>
        <Image
          source={require('@/assets/icons/plus.png')}
          style={[
            bottomTabStyles.icon,
            currentTab === 'plus' && bottomTabStyles.activeIcon,
          ]}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handlePress('/user')} hitSlop={touchSlop}>
        <Image 
          source={require('@/assets/icons/user.png')} 
          style={[
            bottomTabStyles.icon, 
            pathname.startsWith('/user') && bottomTabStyles.activeIcon
          ]} 
        />
      </TouchableOpacity>
    </View>
  );
}

const bottomTabStyles = StyleSheet.create({
  container: {
    paddingTop: 16,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#dddddd',
  },
  icon: {
    width: 24,
    height: 24,
  },
  activeIcon: {
    tintColor: '#009205',
  },
});