import {useState} from "react";

function TableGrid() {
  const [rowIds, setRowIds] = useState(() => [0, 1, 2, 3]);
  const [columnIds, setColumnIds] = useState(() => [0, 1, 2, 3]);
  const [activeRowIndex, setActiveRowIndex] = useState(null);
  const [activeColumnIndex, setActiveColumnIndex] = useState(null);

  const hanleDeleteRowClick = () => {
    setRowIds((currentIds) => {
      return currentIds.filter((_, index) => index !== activeRowIndex);
    });
  };

  return (
      <div className="wrapper">
        <div className="table">
          {rowIds.map((rowId, rowIndex) => (
              <div className="row" key={rowId}>
                {columnIds.map((columnId, columnIndex) => (
                        <div
                            className="cell"
                            key={columnId}
                            data-row={rowIndex}
                            data-column={columnIndex}
                        />
                    )
                )
                }
              </div>
          ))}
        </div>
      </div>
  )
}

export default TableGrid;