import { Rosie } from '../core';

export type PagingToolbarProps = {
  page?: number,
  size?: number,
  count?: number,
  total?: number,
  onChange?: (page: number) => void,
};

export function PagingToolbar({ page = 1, size = 100, count = 0, total = 0, onChange }: Readonly<PagingToolbarProps>) {
  const totalPage = (total / size).floor() + ((total % size) > 0 ? 1 : 0);

  const pageLink = (target: number, icon: string, label: string) => {
    const disabled = !onChange || target < 1 || target > totalPage || target === page;
    return <li className={Rosie.classNames('page-item', { disabled })}>
      <button type="button" className="page-link" aria-label={label} disabled={disabled} onClick={() => onChange?.(target)}>
        <i className={`rosie-icon rosie-icon-${icon}`} />
      </button>
    </li>;
  };

  return <>
    <div className="mt-1 me-auto">Display records {!count ? 0 : (page - 1) * size + 1} - {Math.min(page * size, (page - 1) * size + count)} of {total}</div>
    <ul className="pagination pagination-sm mb-0">
      {pageLink(1, 'chevrons-left', 'First page')}
      {pageLink(page - 1, 'chevron-left', 'Previous page')}
      <li className="page-item active"><span className="page-link">{!totalPage ? 0 : page} / {totalPage}</span></li>
      {pageLink(page + 1, 'chevron-right', 'Next page')}
      {pageLink(totalPage, 'chevrons-right', 'Last page')}
    </ul>
  </>
}
