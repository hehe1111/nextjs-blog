import { GetServerSidePropsContext, NextPage } from 'next';
import { useRouter } from 'next/router';
import getDatabaseConnection from 'backend/getDatabaseConnection';
import { Post } from 'db/src/entity/Post';
import useCreateOrEdit from 'frontend/hooks/useCreateOrEdit';

const PostEdit: NextPage<{ post: Post }> = ({ post }) => {
  const router = useRouter();
  return useCreateOrEdit({
    initialFormData: {
      title: post.title || '',
      content: post.content || '',
      id: post.id,
    },
    url: '/api/v1/post/edit',
    onSuccess: () => {
      alert('修改成功');
      router.replace(`/posts/${post.id}`);
    },
    type: '修改',
  });
};

export default PostEdit;

export const getServerSideProps = async (
  context: GetServerSidePropsContext<{ id: string }>
) => {
  const connection = await getDatabaseConnection();
  const post = await connection.manager.findOne<Post>(
    'Post',
    context.params.id
  );
  return {
    props: {
      post: JSON.parse(JSON.stringify(post)),
    },
  };
};
