import styled from 'styled-components';

type ITime = number | string | Date;

const PostDate = styled.div`
  font-size: 16px;
  color: #bbb;
`;

const formatedDate = (time: ITime): string =>
  new Date(time).toLocaleDateString().replace(/\//g, '-'); // WHY?

export default ({ date }: { date: ITime }) => {
  return <PostDate>{formatedDate(date)}</PostDate>;
};
