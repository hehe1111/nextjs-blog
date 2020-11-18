import styled from 'styled-components';
import { formattedDate, ITime } from 'frontend/utils';

const PostDateElement = styled.div`
  font-size: 16px;
  color: #bbb;
`;

const PostDate = ({
  date,
  className = '',
}: {
  date: ITime;
  className?: string;
}) => {
  return (
    <PostDateElement className={className}>
      {formattedDate(date)}
    </PostDateElement>
  );
};

export default PostDate;
