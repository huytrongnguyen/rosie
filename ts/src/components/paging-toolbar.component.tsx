import { useEffect, useState } from 'react';

export function PagingToolbar(props: { data: any[], pageSize?: number, onChange: (currentPage: number) => void }) {
  const [currentPage, setCurrentPage] = useState(1),
        [totalPage, setTotalPage] = useState(1);

  useEffect(() => { props.onChange(currentPage) }, [currentPage])

  useEffect(() => {
    const pageSize = props.pageSize ?? 25,
          totalCount = props.data?.length ?? 0;
    setTotalPage(totalCount <= 0 ? 1 : ((totalCount / pageSize).floor() + (totalCount % pageSize > 0 ? 1 : 0)));
  }, [props.data, props.pageSize])

  return <div className="input-group input-group-sm">
    <button type="button" className="btn btn-outline-secondary" onClick={() => setCurrentPage(1)} disabled={currentPage <= 1}><span className="fa fa-angle-double-left" /></button>
    <button type="button" className="btn btn-outline-secondary" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage <= 1}><span className="fa fa-angle-left" /></button>
    <span className="input-group-text"><span>{currentPage} / {totalPage}</span></span>
    <button type="button" className="btn btn-outline-secondary" onClick={() => setCurrentPage(currentPage + 1)} disabled={totalPage <= currentPage}><span className="fa fa-angle-right" /></button>
    <button type="button" className="btn btn-outline-secondary" onClick={() => setCurrentPage(totalPage)} disabled={totalPage <= currentPage}><span className="fa fa-angle-double-right" /></button>
  </div>
}