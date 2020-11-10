import Link from 'next/link';

type IProps = {
  page: number;
  totalPage: number;
};
type IResult = Array<number | string>;

const usePage = ({ page, totalPage }: IProps) => {
  const numbers = generatePaginationNumberArray({ page, totalPage });
  const view = (
    <>
      {page <= totalPage && (
        <div>
          共 {totalPage} 页，当前在第 {page} 页
          {page > 1 && (
            <Link href={getHref(page - 1)}>
              <a>上一页</a>
            </Link>
          )}
          {numbers.map((p, index) => (
            <span key={`${index}-${p}`}>
              {typeof p === 'number' && p !== page ? (
                <Link href={getHref(p)}>
                  <a>{p}</a>
                </Link>
              ) : (
                p
              )}
            </span>
          ))}
          {page < totalPage && (
            <Link href={getHref(page + 1)}>
              <a>下一页</a>
            </Link>
          )}
        </div>
      )}
    </>
  );
  return { view };
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
