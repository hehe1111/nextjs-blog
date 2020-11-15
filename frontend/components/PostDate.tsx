import styled from 'styled-components';

type ITime = number | string | Date;

const PostDateElement = styled.div`
  font-size: 16px;
  color: #bbb;
`;

const formatedDate = (time: ITime): string =>
  new Date(time).toLocaleDateString().replace(/\//g, '-'); // WHY?

const PostDate = ({ date }: { date: ITime }) => {
  return <PostDateElement>{formatedDate(date)}</PostDateElement>;
};

export default PostDate;
