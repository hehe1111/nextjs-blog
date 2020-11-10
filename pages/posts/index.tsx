import getDatabaseConnection from 'lib/getDatabaseConnection';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { Post } from 'src/entity/Post';

type IProps = {
  posts: Post[];
  page: number;
  totalPage: number;
  total: number;
};

const PostAll: NextPage<IProps> = ({ posts, page, totalPage, total }) => {
  return (
    <>
      <Head>
        <title>文章列表</title>
      </Head>

      <h1>文章列表（共 {total} 篇）</h1>
      {posts.length === 0 && <p>没有更多了~</p>}
      <main>
        {posts.map(post => {
          const date = new Date(post.createdAt)
            .toLocaleDateString()
            .replace(/\//g, '-'); // WHY?
          return (
            <div key={post.id}>
              <Link href={`/posts/${post.id}`}>
                <a>{post.title}</a>
              </Link>
              <span> @{date}</span>
            </div>
          );
        })}
      </main>
      {page <= totalPage && (
        <footer>
          共 {totalPage} 页，当前在第 {page} 页
          {page > 1 && <Link href={`?page=${page - 1}`}>上一页</Link>}
          {page < totalPage && <Link href={`?page=${page + 1}`}>下一页</Link>}
        </footer>
      )}
    </>
  );
};

export default PostAll;

const PER_PAGE = 10;

export const getServerSideProps: GetServerSideProps = async context => {
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

  return {
    props: {
      posts: JSON.parse(JSON.stringify(posts)),
      page,
      totalPage: Math.ceil(total / PER_PAGE),
      total,
    },
  };
};
