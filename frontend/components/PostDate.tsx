import { formattedDate, ITime } from 'frontend/utils';
import Small from 'frontend/components/Small';

type IProps = {
  date: ITime;
  className?: string;
};

const PostDate = ({ date, className = '' }: IProps): JSX.Element => {
  return <Small className={className}>{formattedDate(date)}</Small>;
};

export default PostDate;
