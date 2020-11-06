import { NextApiHandler } from 'next';
import { Post } from 'src/entity/Post';
import { withSession } from 'lib/withSession';
import { getDatabaseConnection } from 'lib/getDatabaseConnection';

const PostCreate: NextApiHandler = async (request, response) => {
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  const METHOD = 'POST';
  if (request.method?.toUpperCase() !== METHOD) {
    response.statusCode = 405;
    return response.end(`{message: "请求方法只能为 ${METHOD}"}`);
  }
  const { title, content } = request.body;
  const post = new Post();
  post.title = title;
  post.content = content;
  const user = request.session.get('currentUser');
  post.author = user;
  const connection = await getDatabaseConnection();
  await connection.manager.save(post);
  response.json(post);
};

export default withSession(PostCreate);
