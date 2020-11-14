import { NextPage } from 'next';
import { useRouter } from 'next/router';
import useCreateOrEdit from 'frontend/hooks/useCreateOrEdit';

const PostCreate: NextPage = () => {
  const router = useRouter();
  return useCreateOrEdit({
    initialFormData: { title: '', content: '' },
    url: '/api/v1/post/create',
    onSuccess: () => router.push('/posts/'),
    type: '新增',
  });
};

export default PostCreate;
