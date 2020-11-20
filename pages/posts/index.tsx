import { NextPage } from 'next';
import { IProps, PostListCommon, getServerSideProps } from 'pages/admin/index';

const PostList: NextPage<IProps> = props => <PostListCommon {...props} />;

export default PostList;

export { getServerSideProps };
