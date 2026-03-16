import {useState} from "react";

const rootStyles = getComputedStyle(document.documentElement);
const CELL_SIZE = Number.parseInt(rootStyles.getPropertyValue("--cell-size"), 10);
const GAP = Number.parseInt(rootStyles.getPropertyValue("--cell-gap"), 10);
const STEP = CELL_SIZE + GAP;


function TableGrid() {
  const [grid, setGrid] = useState(() => [
        [0, 1, 2, 3],
        [4, 5, 6, 7],
        [8, 9, 10, 11],
        [12, 13, 14, 15],
  ]);

  const [activeRowIndex, setActiveRowIndex] = useState(null);
  const [activeColumnIndex, setActiveColumnIndex] = useState(null);

  const hideDeleteButton = () => {
    setActiveRowIndex(null);
    setActiveColumnIndex(null);
  };

  const handleDeleteRowClick = () => {
    setGrid((currentGrid) =>
        currentGrid.filter((_, index) => index !== activeRowIndex)
    );
    hideDeleteButton();
  };

  const handleDeleteColumnClick = () => {
    setGrid((currentGrid) =>
        currentGrid.map((row) =>
        row.filter((_, index) => index !== activeColumnIndex))
    );
    hideDeleteButton();
  };

  const handleAddRowClick = () => {};

  const handleAddColumnClick = () => {};

  const handlePointerOverCell = (event) => {
    const cellElement = event.target.closest(".cell");
    if (cellElement === null) return;

    const rowIndex = Number(cellElement.dataset.row);
    const columnIndex = Number(cellElement.dataset.column);

    if (rowIndex !== activeRowIndex) setActiveRowIndex(rowIndex);
    if (columnIndex !== activeColumnIndex) setActiveColumnIndex(columnIndex);
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
          {grid.map((row, rowIndex) => (
              <div className="row" key={rowIndex}>
                {row.map((cellId, columnIndex) => (
                    <div
                        className="cell"
                        key={cellId}
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
              display:"none",
            }}
        >-
        </button>

        <button
            className="button delete-row"
            onClick={handleDeleteRowClick}
            onMouseLeave={hideDeleteButton}
            style={{
              display:"none"
            }}
        >-
        </button>

      </div>
  );
}

export default TableGrid;