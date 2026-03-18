import {useCallback, useState} from "react";

const rootStyles = getComputedStyle(document.documentElement);
const CELL_SIZE = Number.parseInt(rootStyles.getPropertyValue("--cell-size"), 10);
const GAP = Number.parseInt(rootStyles.getPropertyValue("--cell-gap"), 10);
const STEP = CELL_SIZE + GAP;

function createGrid(rows, columns) {
  {
    return Array.from({length: rows}, (_, rowIndex) =>
        Array.from({length: columns}, (_, columnIndex) => rowIndex * columns + columnIndex)
    );
  }
}

function TableGrid({rows = 4, columns = 4}) {
  const [grid, setGrid] = useState(() => createGrid(rows, columns));

  const [activeIndex, setActiveIndex] = useState({row: null, column: null});

  const resetActiveIndex = useCallback(() => {
    setActiveIndex({row: null, column: null});
  }, []);

  const handleDeleteRowClick = useCallback(() => {
    setGrid((currentGrid) =>
        currentGrid.filter((_, index) => index !== activeIndex.row)
    );
    resetActiveIndex();
  }, [activeIndex.row, resetActiveIndex]);/*ESLint требует указать хоть и никогда не меняется*/

  const handleDeleteColumnClick = useCallback(() => {
    setGrid((currentGrid) =>
        currentGrid.map((row) =>
            row.filter((_, index) => index !== activeIndex.column))
    );
    resetActiveIndex();
  }, [activeIndex.column, resetActiveIndex]);/*ESLint требует указать*/

  const handleAddRowClick = useCallback(() => {
    setGrid((currentGrid) => {
      const columnCount = currentGrid[0].length;
      const lastId = currentGrid.flat().at(-1);
      const newRow = Array.from({length: columnCount}, (_, index) => lastId + index + 1);
      {
        return [...currentGrid, newRow];
      }
    });
    resetActiveIndex();
   }, [resetActiveIndex]);/*ESLint требует указать*/

  const handleAddColumnClick = useCallback(() => {
    setGrid((currentGrid) => {
      const lastId = currentGrid.flat().at(-1);
      {
        return currentGrid.map((row, rowIndex) => [
          ...row,
          lastId + rowIndex + 1,
        ]);
      }
    });
    resetActiveIndex();
  }, [resetActiveIndex]);/*ESLint требует указать*/

  const handlePointerOverCell = useCallback((event) => {
    const cellElement = event.target.closest(".cell");
    if (cellElement === null) {
      return;
    }

    const rowIndex = Number(cellElement.dataset.row);
    const columnIndex = Number(cellElement.dataset.column);

    setActiveIndex(previous => {
      if (previous.row === rowIndex && previous.column === columnIndex) {
        return previous;
      }
      {
        return {row: rowIndex, column: columnIndex};
      }
    })
  }, []);

  const handleMouseLeaveTable = useCallback((event) => {
    if (event.relatedTarget instanceof Element && event.relatedTarget.closest(".delete-row, .delete-column")) {
      return;
    }
    resetActiveIndex();
  }, [resetActiveIndex]);/*ESLint требует указать*/

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
            onMouseLeave={resetActiveIndex}
            style={{
              display: activeIndex.column === null || grid[0].length <= 1 ? "none" : "block",
              transform: `translateX(${activeIndex.column * STEP}px)`,
            }}
        >-
        </button>

        <button
            className="button delete-row"
            onClick={handleDeleteRowClick}
            onMouseLeave={resetActiveIndex}
            style={{
              display: activeIndex.row === null || grid.length <= 1 ? "none" : "block",
              transform: `translateY(${activeIndex.row * STEP}px)`,
            }}
        >-
        </button>

      </div>
  );
}

export default TableGrid;