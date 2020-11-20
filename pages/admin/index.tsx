import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { AxiosError, AxiosResponse } from 'axios';
import { ReactNode, useCallback, useEffect } from 'react';
import { Post } from 'db/src/entity/Post';
import { User } from 'db/src/entity/User';
import getDatabaseConnection from 'backend/getDatabaseConnection';
import { withSession } from 'backend/withSession';
import usePage from 'frontend/hooks/usePage';
import Button from 'frontend/components/Button';
import PostDate from 'frontend/components/PostDate';
import client from 'frontend/client';

export interface IProps {
  isAdminPage?: boolean;
  posts: Post[];
  page: number;
  totalPage: number;
  total: number;
  totalComments?: number;
  user: User | null;
}
interface ICommonProps extends IProps {
  children?: ReactNode;
}

const ExitButton = styled(Button)`
  margin-left: 10px;
`;

const PostList: NextPage<IProps> = props => {
  const router = useRouter();
  const onExit = useCallback(() => {
    client
      .post('/api/v1/sign-out')
      .then(response => {
        alert(response.data.message);
        router.push('/posts');
      })
      .catch(error => console.log(error));
  }, []);
  return (
    <PostListCommon {...props} isAdminPage={true}>
      <>
        <Link href="/posts/create">
          <a>
            <Button className="green">新增</Button>
          </a>
        </Link>
        <ExitButton className="red" onClick={onExit}>
          退出
        </ExitButton>
      </>
      {EditAndDelete}
    </PostListCommon>
  );
};

export default PostList;

const PER_PAGE = 10;

export const getServerSideProps: GetServerSideProps = withSession(
  async (context: GetServerSidePropsContext) => {
    const { page: _page }: { page?: string } = context.query;
    let page = parseInt(_page || '1', 10);
    (!page || page <= 0) && (page = 1);

    const { manager } = await getDatabaseConnection();
    const [posts, total] = await manager.findAndCount('Post', {
      // https://typeorm.io/#/find-options
      order: { createdAt: 'DESC' },
      take: PER_PAGE,
      skip: PER_PAGE * (page - 1),
    });
    const [_, totalComments] = await manager.findAndCount('Comment');

    return {
      props: {
        posts: JSON.parse(JSON.stringify(posts)),
        page,
        totalPage: Math.ceil(total / PER_PAGE),
        total,
        totalComments,
        // @ts-ignore
        user: context.req.session.get('currentUser') || null,
      },
    };
  }
);

// === 以下是工具变量、函数 ==

const Page = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;
const Header = styled.header`
  margin-top: 40px;
  display: flex;
  align-items: center;
  > small {
    flex: 1;
  }
`;
const PostTitleItem = styled.div`
  padding: 16px 0;
  border-bottom: 1px dashed #ccc;
  font-size: 24px;
  display: flex;
  align-items: center;
  &:hover {
    background-color: #f6f8fa;
  }
  & > div {
    flex: 1;
  }
  button {
    margin-left: 10px;
  }
`;
const Footer = styled.div`
  margin: 20px 0 40px 0;
`;

export function PostListCommon({
  isAdminPage = false,
  posts,
  page,
  totalPage,
  total,
  totalComments,
  user,
  children,
}: ICommonProps) {
  const router = useRouter();
  useEffect(() => {
    isAdminPage &&
      !user &&
      router.push(
        `/admin/sign-in?redirect=${encodeURIComponent(router.asPath)}`
      );
  }, []);

  const pager = usePage({ page, totalPage });
  return isAdminPage && !user ? (
    <>请先登录</>
  ) : (
    <Page>
      <Head>
        <title>文章列表</title>
      </Head>

      <Header>
        <small>
          （共 {total} 篇文章{isAdminPage && <>，{totalComments} 条评论</>}）
        </small>

        {/* 新增 */}
        {user && children && children?.[0]}
      </Header>
      {posts.length === 0 && <p>没有更多了~</p>}
      <main>
        {posts.map(post => (
          <PostTitleItem key={post.id}>
            <div>
              <Link href={`/posts/${post.id}`}>
                <a>{post.title}</a>
              </Link>
              <PostDate date={post.createdAt} />
            </div>

            {/* 修改 删除 */}
            {children &&
              typeof children?.[1] === 'function' &&
              children[1](post)}
          </PostTitleItem>
        ))}
      </main>
      <Footer>{pager}</Footer>
    </Page>
  );
}

function EditAndDelete(post: Post) {
  const router = useRouter();
  // TODO: onDelete 不能用 useCallback 包裹，原因未知
  const onDelete = () => {
    client
      .delete('/api/v1/post/delete', { data: { id: post.id } })
      .then((response: AxiosResponse) => {
        // TODO: 请求接口做局部更新
        router.reload();
        alert(response.data.message);
      })
      .catch((error: AxiosError) => {
        console.log(error.response.data.message, JSON.stringify(error));
        if (error.response?.status === 401) {
          router.push(
            `/admin/sign-in?redirect=${encodeURIComponent(router.asPath)}`
          );
        }
      });
  };

  return (
    <>
      <Link href={`/posts/${post.id}/comments`}>
        <a>
          <Button className="blue">管理评论</Button>
        </a>
      </Link>
      <Link href={`/posts/${post.id}/edit`}>
        <a>
          <Button className="blue">修改</Button>
        </a>
      </Link>
      <Button className="red" onClick={onDelete}>
        删除
      </Button>
    </>
  );
}
