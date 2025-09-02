import { Rosie } from '../core';

export function PagingToolbar(props: { page?: number, size?: number, count?: number, total?: number }) {
  const { page = 1, size = 100, count = 0, total = 0 } = props,
        totalPage = (total / size).floor() + ((total % size) > 0 ? 1 : 0);

  return <>
    <div className="mt-1 me-auto">Display records {!count ? 0 : (page - 1) * size + 1} - {Math.min(page * size, (page - 1) * size + count)} of {total}</div>
    <ul className="pagination pagination-sm mb-0">
      <li className={Rosie.classNames('page-item', { disabled: page <= 1 })}>
        <span className="page-link"><span className="fa fa-step-backward" /></span>
      </li>
      <li className={Rosie.classNames('page-item', { disabled: (page - 1) < 1 })}>
        <span className="page-link"><span className="fa fa-play fa-rotate-180" /></span>
      </li>
      <li className="page-item active"><span className="page-link">{!totalPage ? 0 : page} / {totalPage}</span></li>
      <li className={Rosie.classNames('page-item', { disabled: (page + 1) > totalPage })}>
        <span className="page-link"><span className="fa fa-play" /></span>
      </li>
      <li className={Rosie.classNames('page-item', { disabled: page >= totalPage })}>
        <span className="page-link"><span className="fa fa-step-forward" /></span>
      </li>
    </ul>
  </>
}