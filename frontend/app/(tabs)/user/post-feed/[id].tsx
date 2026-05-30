import { useLocalSearchParams, useRouter } from 'expo-router';
import { SharedPostFeed } from '@/components/post/shared-post-feed';

export default function UserTabPostScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  return (
    <SharedPostFeed 
      id={id} 
      fetchType="user"
      onBack={() => router.back()} 
    />
  );
}