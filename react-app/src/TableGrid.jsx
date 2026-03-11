import {useState} from "react";

function TableGrid() {
  const [rowIds, setRowIds] = useState(() => [0, 1, 2, 3]);
  const [columnIds, setColumnIds] = useState(() => [0, 1, 2, 3]);
  const [activeRowIndex, setActiveRowIndex] = useState(null);
  const [activeColumnIndex, setActiveColumnIndex] = useState(null);

  const handleDeleteRowClick = () => {
    setRowIds((currentIds) => {
      return currentIds.filter((_, index) => index !== activeRowIndex);
    });
  };

  const handleAddRowClick = () => {
    setRowIds((currentIds) => {
      const lastId = currentIds[currentIds.length - 1];
      return [...currentIds, lastId + 1];
    });
  };

  const handleAddColumnClick = () => {
    setColumnIds((currentIds) => {
      const lastId = currentIds[currentIds.length - 1];
      return [...currentIds, lastId + 1];
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
                ))}
              </div>
          ))}
        </div>

        <button className="button add-column" onClick={handleAddColumnClick}>+</button>
        <button className="button add-row" onClick={handleAddRowClick}>+</button>

      </div>
  );

}

export default TableGrid;