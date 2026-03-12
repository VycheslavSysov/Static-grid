import {useState} from "react";

const rootStyles = getComputedStyle(document.documentElement);
const CELL_SIZE = Number.parseInt(rootStyles.getPropertyValue("--cell-size"), 10);
const GAP = Number.parseInt(rootStyles.getPropertyValue("--cell-gap"), 10);
const STEP = CELL_SIZE + GAP;


function TableGrid() {
  const [rowIds, setRowIds] = useState(() => [0, 1, 2, 3]);
  const [columnIds, setColumnIds] = useState(() => [0, 1, 2, 3]);
  const [activeRowIndex, setActiveRowIndex] = useState(null);
  const [activeColumnIndex, setActiveColumnIndex] = useState(null);

  const hideDeleteButton = () => {
    setActiveRowIndex(null);
    setActiveColumnIndex(null);
  };

  const handleDeleteRowClick = () => {
    setRowIds((currentIds) => {
      return currentIds.filter((_, index) => index !== activeRowIndex);
    });
    hideDeleteButton();
  };

  const handleDeleteColumnClick = () => {
    setColumnIds((currentIds) => {
      return currentIds.filter((_, index) => index !== activeColumnIndex);
    })
    hideDeleteButton();
  };

  const handleAddRowClick = () => {
    setRowIds((currentIds) => {
      const lastId = currentIds[currentIds.length - 1];
      return [...currentIds, lastId + 1];
    });
    hideDeleteButton();
  };

  const handleAddColumnClick = () => {
    setColumnIds((currentIds) => {
      const lastId = currentIds[currentIds.length - 1];
      return [...currentIds, lastId + 1];
    });
    hideDeleteButton();
  };

  const handlePointerOverCell = (event) => {
    const cellElement = event.target.closest(".cell");
    if (cellElement === null) return;

    const rowIndex = Number(cellElement.dataset.row);
    const columnIndex = Number(cellElement.dataset.column);

    setActiveRowIndex(rowIndex);
    setActiveColumnIndex(columnIndex);
  }

  const handleMouseLeaveTable = (event) => {
    if (event.relatedTarget instanceof Element && event.relatedTarget.closest(".delete-row, .delete-column")) return;

    hideDeleteButton();
  }

  return (
      <div className="wrapper">
        <div
            className="table"
            onPointerOver={handlePointerOverCell}
            onMouseLeave={handleMouseLeaveTable}
        >
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

        <button
            className="button add-column" onClick={handleAddColumnClick}
        >+
        </button>
        <button
            className="button add-row" onClick={handleAddRowClick}
        >+
        </button>

        <button
            className="button delete-column"
            onClick={handleDeleteColumnClick}
            onMouseLeave={hideDeleteButton}
            style={{
              display: activeColumnIndex === null || columnIds.length <= 1 ? "none" : "block",
              transform: `translateX(${activeColumnIndex * STEP}px)`,
            }}
        >-
        </button>

        <button
            className="button delete-row"
            onClick={handleDeleteRowClick}
            onMouseLeave={hideDeleteButton}
            style={{
              display: activeRowIndex === null || rowIds.length <= 1 ? "none" : "block",
              transform: `translateY(${activeRowIndex * STEP}px)`
            }}
        >-
        </button>

      </div>
  );
}

export default TableGrid;