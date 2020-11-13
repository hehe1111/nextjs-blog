import getDatabaseConnection from 'lib/getDatabaseConnection';
import { NextPage, GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { Post } from 'src/entity/Post';
import styled from 'styled-components';
import marked from 'marked';
import hljs from 'highlight.js';

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
};

const PostTitle = styled.h1`
  margin-top: 20px;
  text-align: center;
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
  &.markdown-body {
    font-size: 24px;
  }
`;

const ThePost: NextPage<IProps> = ({ post }) => {
  const date = new Date(post.createdAt)
    .toLocaleDateString()
    .replace(/\//g, '-'); // WHY?

  return (
    <>
      <Head>
        <title>{post.title}</title>
      </Head>
      <PostTitle>{post.title}</PostTitle>
      <PostTime>{date}</PostTime>
      <PostContent
        dangerouslySetInnerHTML={{ __html: marked(post.content) }}
        className="markdown-body"
      ></PostContent>
    </>
  );
};

export default ThePost;

export const getServerSideProps = async (
  context: GetServerSidePropsContext<{ id: string }>
) => {
  const connection = await getDatabaseConnection();
  const post = await connection.manager.findOne<Post>(
    'Post',
    context.params?.id
  );
  return {
    props: {
      post: JSON.parse(JSON.stringify(post)),
    },
  };
};
