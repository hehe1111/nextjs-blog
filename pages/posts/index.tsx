import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import styled from 'styled-components';
import getDatabaseConnection from 'backend/getDatabaseConnection';
import { withSession } from 'backend/withSession';
import { Post } from 'db/src/entity/Post';
import { User } from 'db/src/entity/User';
import usePage from 'frontend/hooks/usePage';
import Button from 'frontend/components/Button';
import PostDate from 'frontend/components/PostDate';

type IProps = {
  posts: Post[];
  page: number;
  totalPage: number;
  total: number;
  user: User | null;
};

const Header = styled.header`
  display: flex;
  align-items: center;
  > small {
    flex: 1;
  }
`;
const PostTitleItem = styled.div`
  padding: 16px 0;
  border-bottom: 1px dashed #ccc;
`;
const Footer = styled.div`
  margin-top: 20px;
`;

const PostList: NextPage<IProps> = ({
  posts,
  page,
  totalPage,
  total,
  user,
}) => {
  const pager = usePage({ page, totalPage });
  return (
    <>
      <Head>
        <title>文章列表</title>
      </Head>

      <h1>文章列表</h1>
      <Header>
        <small>（共 {total} 篇）</small>
        {user && (
          <Link href="/posts/create">
            <a>
              <Button className="green">新增文章</Button>
            </a>
          </Link>
        )}
      </Header>
      {posts.length === 0 && <p>没有更多了~</p>}
      <main>
        {posts.map(post => (
          <PostTitleItem key={post.id}>
            <Link href={`/posts/${post.id}`}>
              <a>{post.title}</a>
            </Link>
            <PostDate date={post.createdAt} />
          </PostTitleItem>
        ))}
      </main>
      <Footer>{pager}</Footer>
    </>
  );
};

export default PostList;

const PER_PAGE = 10;

export const getServerSideProps: GetServerSideProps = withSession(
  async context => {
    const { page: _page }: { page?: string } = context.query;
    let page = parseInt(_page || '1', 10);
    (!page || page <= 0) && (page = 1);

    const connection = await getDatabaseConnection();
    const [posts, total] = await connection.manager.findAndCount('Post', {
      // https://typeorm.io/#/find-options
      order: { createdAt: 'DESC' },
      take: PER_PAGE,
      skip: PER_PAGE * (page - 1),
    });

    // @ts-ignore
    const user = context.req.session.get('currentUser') || null;

    return {
      props: {
        posts: JSON.parse(JSON.stringify(posts)),
        page,
        totalPage: Math.ceil(total / PER_PAGE),
        total,
        user,
      },
    };
  }
);
