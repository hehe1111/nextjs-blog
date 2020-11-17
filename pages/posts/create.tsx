import { GetServerSidePropsContext, NextPage } from 'next';
import { useRouter } from 'next/router';
import { User } from 'db/src/entity/User';
import { withSession } from 'backend/withSession';
import useCreateOrEdit from 'frontend/hooks/useCreateOrEdit';

const PostCreate: NextPage<{ user: User }> = ({ user }) => {
  const router = useRouter();
  return useCreateOrEdit({
    user,
    initialFormData: { title: '', content: '' },
    url: '/api/v1/post/create',
    type: '新增',
  });
};

export default PostCreate;

export const getServerSideProps = withSession(
  async (context: GetServerSidePropsContext) => {
    return {
      props: {
        // @ts-ignore
        user: context.req.session.get('currentUser') || null,
      },
    };
  }
);
