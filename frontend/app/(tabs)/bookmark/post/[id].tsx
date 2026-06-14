import { useLocalSearchParams, useRouter } from 'expo-router';
import { SharedPostFeed } from '@/components/post/shared-post-feed';

export default function BookmarkPostScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  return (
    <SharedPostFeed
      id={id}
      fetchType="single"
      onBack={() => router.back()}
    />
  );
}
