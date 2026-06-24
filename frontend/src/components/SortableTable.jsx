// columns: [{ key, label, sortable }]
// data: array of row objects
// renderCell: optional (row, columnKey) => node, for custom cell rendering
export default function SortableTable({ columns, data, sortBy, order, onSortChange, renderCell, emptyMessage }) {
  function handleHeaderClick(col) {
    if (!col.sortable || !onSortChange) return;
    const nextOrder = sortBy === col.key && order === 'ASC' ? 'DESC' : 'ASC';
    onSortChange(col.key, nextOrder);
  }

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={col.sortable ? 'sortable' : ''}
                onClick={() => handleHeaderClick(col)}
              >
                {col.label}
                {col.sortable && sortBy === col.key && (
                  <span className="sort-arrow">{order === 'ASC' ? ' ▲' : ' ▼'}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="empty-row">
                {emptyMessage || 'No records found.'}
              </td>
            </tr>
          )}
          {data.map((row, idx) => (
            <tr key={row.id ?? idx}>
              {columns.map((col) => (
                <td key={col.key}>{renderCell ? renderCell(row, col.key) : row[col.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
