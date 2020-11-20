import { formattedDate, ITime } from 'frontend/utils';
import Small from 'frontend/components/Small';

const PostDate = ({
  date,
  className = '',
}: {
  date: ITime;
  className?: string;
}) => {
  return <Small className={className}>{formattedDate(date)}</Small>;
};

export default PostDate;
