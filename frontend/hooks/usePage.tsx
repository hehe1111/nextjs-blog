import Link from 'next/link';
import styled from 'styled-components';

type IProps = {
  page: number;
  totalPage: number;
};
type IResult = Array<number | string>;

const PageContainer = styled.div`
  margin: 10px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`;
const PageAnchor = styled.div`
  padding: 10px 20px;
  cursor: pointer;
  user-select: none;
  &.plain {
    cursor: not-allowed;
  }
  &:hover:not(.plain),
  &.active {
    background-color: #0170fe;
    color: #fff;
  }
`;

const usePage = ({ page, totalPage }: IProps) => {
  const numbers = generatePaginationNumberArray({ page, totalPage });
  return (
    <>
      {page <= totalPage && (
        <PageContainer>
          共 {totalPage} 页，
          {page > 1 && (
            <Link href={getHref(page - 1)}>
              <PageAnchor>&lt;&lt;</PageAnchor>
            </Link>
          )}
          {numbers.map((p, index) => (
            <div key={`${index}-${p}`}>
              {p === page ? (
                <PageAnchor className="plain active">{p}</PageAnchor>
              ) : typeof p === 'number' ? (
                <Link href={getHref(p)}>
                  <PageAnchor>{p}</PageAnchor>
                </Link>
              ) : (
                <PageAnchor className="plain">{p}</PageAnchor>
              )}
            </div>
          ))}
          {page < totalPage && (
            <Link href={getHref(page + 1)}>
              <PageAnchor>&gt;&gt;</PageAnchor>
            </Link>
          )}
        </PageContainer>
      )}
    </>
  );
};

export default usePage;

function generatePaginationNumberArray({ page, totalPage }: IProps): IResult {
  if (page <= 0 || totalPage <= 0 || page > totalPage) {
    return [];
  }
  const result: IResult = [page - 2, page - 1, page, page + 1, page + 2].filter(
    v => v > 0 && v <= totalPage
  );
  page - 3 > 1 && result.unshift('...');
  page + 3 < totalPage && result.push('...');
  !result.includes(1) && result.unshift(1);
  !result.includes(totalPage) && result.push(totalPage);
  return result;
}

function getHref(page: number): string {
  return `?page=${page}`;
}
