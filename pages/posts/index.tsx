import { IProps, PostListCommon, getServerSideProps } from 'pages/admin/index';

const PostList = (props: IProps) => <PostListCommon {...props} />;

export default PostList;

export { getServerSideProps };
