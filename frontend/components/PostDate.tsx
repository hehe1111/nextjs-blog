import styled from 'styled-components';

type ITime = number | string | Date;

const PostDate = styled.div`
  padding: 4px 0;
  font-size: 0.8em;
  color: #aaa;
`;

const formatedDate = (time: ITime): string =>
  new Date(time).toLocaleDateString().replace(/\//g, '-'); // WHY?

export default ({ date }: { date: ITime }) => {
  return <PostDate>{formatedDate(date)}</PostDate>;
};
