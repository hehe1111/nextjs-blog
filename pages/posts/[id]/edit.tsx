import { GetServerSidePropsContext, NextPage } from 'next';
import { useRouter } from 'next/router';
import { Post } from 'db/src/entity/Post';
import { User } from 'db/src/entity/User';
import getDatabaseConnection from 'backend/getDatabaseConnection';
import { withSession } from 'backend/withSession';
import useCreateOrEdit from 'frontend/hooks/useCreateOrEdit';

const PostEdit: NextPage<{ post: Post; user: User }> = ({ post, user }) => {
  const router = useRouter();
  return useCreateOrEdit({
    user,
    initialFormData: {
      title: post.title || '',
      content: post.content || '',
      id: post.id,
    },
    url: '/api/v1/post/edit',
    type: '修改',
  });
};

export default PostEdit;

export const getServerSideProps = withSession(
  async (context: GetServerSidePropsContext<{ id: string }>) => {
    const { manager } = await getDatabaseConnection();
    const post = await manager.findOne<Post>('Post', context.params.id);

    return {
      props: {
        post: JSON.parse(JSON.stringify(post)),
        // @ts-ignore
        user: context.req.session.get('currentUser') || null,
      },
    };
  }
);
