import getDatabaseConnection from 'lib/getDatabaseConnection';
import { NextPage, GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { Post } from 'src/entity/Post';
import { User } from 'src/entity/User';
import styled from 'styled-components';
import marked from 'marked';
import hljs from 'highlight.js';
import Button from 'components/Button';
import { useCallback } from 'react';
import client from 'lib/client';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { withSession } from 'lib/withSession';

// https://marked.js.org/using_advanced
marked.setOptions({
  renderer: new marked.Renderer(),
  highlight: (code, language) => {
    const validLanguage = hljs.getLanguage(language) ? language : 'plaintext';
    return hljs.highlight(validLanguage, code).value;
  },
  pedantic: false,
  gfm: true,
  breaks: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  xhtml: false,
});

type IProps = {
  post: Post;
  user: User | null;
};

const PostTitle = styled.h1`
  margin-top: 20px;
  text-align: center;
`;
const TimeAndActions = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  button {
    margin-left: 16px;
  }
`;
const PostTime = styled.div`
  margin-top: 8px;
  font-size: 0.8em;
  color: #aaa;
  text-align: center;
`;
const PostContent = styled.article`
  padding: 0 2em;
  margin: 20px 0;
  @media (max-width: 800px) {
    padding: 0;
  }
  @media (min-width: 700px) {
    &.markdown-body {
      font-size: 24px;
    }
  }
`;

const ThePost: NextPage<IProps> = ({ post, user }) => {
  const date = new Date(post.createdAt)
    .toLocaleDateString()
    .replace(/\//g, '-'); // WHY?

  const router = useRouter();
  const onDelete = useCallback(() => {
    client
      .post('/api/v1/post/delete', { id: post.id })
      .then(response => {
        router.push('/posts/');
        alert(response.data.message);
      })
      .catch(error => {
        console.log('删除失败', JSON.stringify(error));
        alert('删除失败');
      });
  }, []);

  return (
    <>
      <Head>
        <title>{post.title}</title>
      </Head>
      <PostTitle>{post.title}</PostTitle>
      <TimeAndActions>
        <PostTime>{date}</PostTime>
        {user && (
          <>
            <Link href={`/posts/${post.id}/edit`}>
              <a>
                <Button className="blue">修改文章</Button>
              </a>
            </Link>
            <Button className="red" onClick={onDelete}>
              删除文章
            </Button>
          </>
        )}
      </TimeAndActions>
      <PostContent
        dangerouslySetInnerHTML={{ __html: marked(post.content) }}
        className="markdown-body"
      ></PostContent>
    </>
  );
};

export default ThePost;

export const getServerSideProps = withSession(
  // @ts-ignore
  async (context: GetServerSidePropsContext<{ id: string }>) => {
    const connection = await getDatabaseConnection();
    const post = await connection.manager.findOne<Post>(
      'Post',
      context.params.id
    );
    // @ts-ignore
    const user = context.req.session.get('currentUser') || null;
    return {
      props: {
        post: JSON.parse(JSON.stringify(post)),
        user,
      },
    };
  }
);
