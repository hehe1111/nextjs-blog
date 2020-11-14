import styled from 'styled-components';

const PostDate = styled.div`
  padding: 4px 0;
  font-size: 0.8em;
  color: #aaa;
`;

const formatedDate = (time: number | string | Date): string =>
  new Date(time).toLocaleDateString().replace(/\//g, '-'); // WHY?

export default ({ date }) => {
  return <PostDate>{formatedDate(date)}</PostDate>;
};
