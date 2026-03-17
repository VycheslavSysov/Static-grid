import {useCallback, useState} from "react";

const rootStyles = getComputedStyle(document.documentElement);
const CELL_SIZE = Number.parseInt(rootStyles.getPropertyValue("--cell-size"), 10);
const GAP = Number.parseInt(rootStyles.getPropertyValue("--cell-gap"), 10);
const STEP = CELL_SIZE + GAP;
const ROWS = 4;
const COLUMNS = 4;


function TableGrid() {
  const [grid, setGrid] = useState(() =>
      Array.from({length: ROWS},  (_, rowIndex) =>
       Array.from({length: COLUMNS}, (_, columnIndex) => rowIndex * COLUMNS + columnIndex)
   )
  );

  const [activeRowIndex, setActiveRowIndex] = useState(null);
  const [activeColumnIndex, setActiveColumnIndex] = useState(null);

  const hideDeleteButton = useCallback(() => {
    setActiveRowIndex(null);
    setActiveColumnIndex(null);
  },[]);

  const handleDeleteRowClick = useCallback(() => {
    setGrid((currentGrid) =>
        currentGrid.filter((_, index) => index !== activeRowIndex)
    );
    hideDeleteButton();
  }, [activeRowIndex, hideDeleteButton]);

  const handleDeleteColumnClick = useCallback(() => {
    setGrid((currentGrid) =>
        currentGrid.map((row) =>
            row.filter((_, index) => index !== activeColumnIndex))
    );
    hideDeleteButton();
  }, [activeColumnIndex, hideDeleteButton]);

  const handleAddRowClick = useCallback(() => {
    setGrid((currentGrid) => {
      const columnCount = currentGrid[0].length;
      const lastId = currentGrid.flat().at(-1);
      const newRow = Array.from({length: columnCount}, (_, index) => lastId + index + 1);
      return [...currentGrid, newRow];
    });
    hideDeleteButton();
  }, [hideDeleteButton]);

  const handleAddColumnClick = useCallback(() => {
    setGrid((currentGrid) => {
      const lastId = currentGrid.flat().at(-1);
      return currentGrid.map((row, rowIndex) => [
        ...row,
        lastId + rowIndex + 1,
      ]);
    });
    hideDeleteButton();
  },[hideDeleteButton]);

  const handlePointerOverCell = useCallback((event) => {
    const cellElement = event.target.closest(".cell");
    if (cellElement === null) return;

    const rowIndex = Number(cellElement.dataset.row);
    const columnIndex = Number(cellElement.dataset.column);

    if (rowIndex !== activeRowIndex) setActiveRowIndex(rowIndex);
    if (columnIndex !== activeColumnIndex) setActiveColumnIndex(columnIndex);
  }, [activeColumnIndex, activeRowIndex]);

  const handleMouseLeaveTable = useCallback((event) => {
    if (event.relatedTarget instanceof Element && event.relatedTarget.closest(".delete-row, .delete-column")) return;

    hideDeleteButton();
  }, [hideDeleteButton]);

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
              display: activeColumnIndex === null || grid[0].length <= 1 ? "none" : "block",
              transform: `translateX(${activeColumnIndex * STEP}px)`,
            }}
        >-
        </button>

        <button
            className="button delete-row"
            onClick={handleDeleteRowClick}
            onMouseLeave={hideDeleteButton}
            style={{
              display: activeRowIndex === null || grid.length <= 1 ? "none" : "block",
              transform: `translateY(${activeRowIndex * STEP}px)`,
            }}
        >-
        </button>

      </div>
  );
}

export default TableGrid;