import { useCallback, useRef, useState } from "react";

const rootStyles = getComputedStyle(document.documentElement);
const CELL_SIZE = Number.parseInt(rootStyles.getPropertyValue("--cell-size"), 10);
const GAP = Number.parseInt(rootStyles.getPropertyValue("--cell-gap"), 10);
const STEP = CELL_SIZE + GAP;

function createGrid(rows, columns) {
  let id = 0;
  const grid = [];

  for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
    const row = [];
    for (let columnIndex = 0; columnIndex < columns; columnIndex++) {
      row.push(id++);
    }
    grid.push(row);
  }
  {
    return { grid, lastId: id - 1 };
  }
}

function TableGrid({ rows = 4, columns = 4 }) {
  const initial = createGrid(rows, columns);

  const [grid, setGrid] = useState(initial.grid);
  const lastIdRef = useRef(initial.lastId);

  const [activeIndex, setActiveIndex] = useState({ row: null, column: null });
  const activeRef = useRef(activeIndex);

  const setActive = useCallback((next) => {
    activeRef.current = next;
    setActiveIndex(next);
  }, []);

  const resetActiveIndex = useCallback(() => {
    setActive({ row: null, column: null });
  }, [setActive]);

  const handleAddRowClick = useCallback(() => {
    setGrid((current) => {
      const columnCount = current[0]?.length ?? 0;
      if (columnCount === 0) return current;
      const newRow = new Array(columnCount);

      for (let i = 0; i < columnCount; i++) {
        newRow[i] = ++lastIdRef.current;
      }
      {
        return [...current, newRow];
      }
    });

    resetActiveIndex();
  }, [resetActiveIndex]);

  const handleDeleteRowClick = useCallback(() => {
    const rowToDelete = activeRef.current.row;
    if (rowToDelete === null) {
      return;
    }
    setGrid((current) => current.filter((_, i) => i !== rowToDelete));

    resetActiveIndex();
  }, [resetActiveIndex]);

  const handleAddColumnClick = useCallback(() => {
    setGrid((current) => {
      return current.map((row) => {
        const newCell = ++lastIdRef.current;
        {
          return [...row, newCell];
        }
      });
    });

    resetActiveIndex();
  }, [resetActiveIndex]);

  const handleDeleteColumnClick = useCallback(() => {
    const columnToDelete = activeRef.current.column;
    if (columnToDelete === null) {
      return;
    }
    setGrid((current) =>
      current.map((row) => row.filter((_, i) => i !== columnToDelete))
    );

    resetActiveIndex();
  }, [resetActiveIndex]);

  const handlePointerOver = useCallback((e) => {
    const cell = e.target.closest(".cell");
    if (!cell) {
      return;
    }
    const row = Number(cell.dataset.row);
    const column = Number(cell.dataset.column);

    const prev = activeRef.current;

    if (prev.row === row && prev.column === column) {
      return;
    }
    setActive({ row, column });
  }, [setActive]);

  const handleMouseLeave = useCallback((event) => {
    if (
      event.relatedTarget instanceof Element &&
      event.relatedTarget.closest(".delete-row, .delete-column")
    ) {
      return;
    }
    resetActiveIndex();
  }, [resetActiveIndex]);

  return (
    <div className="wrapper">
      <div
        className="table"
        onPointerOver={handlePointerOver}
        onMouseLeave={handleMouseLeave}
      >
        {grid.map((row, rowIndex) => (
          <div className="row" key={rowIndex}>
            {row.map((id, columnIndex) => (
              <div
                key={id}
                className="cell"
                data-row={rowIndex}
                data-column={columnIndex}
              />
            ))}
          </div>
        ))}
      </div>

      <button className="button add-column" onClick={handleAddColumnClick}>+
      </button>

      <button className="button add-row" onClick={handleAddRowClick}>+
      </button>

      <button
        className="button delete-column"
        onClick={handleDeleteColumnClick}
        onMouseLeave={resetActiveIndex}
        style={{
          display:
            activeIndex.column === null || (grid[0]?.length ?? 0) <= 1
              ? "none"
              : "block",
          transform: `translateX(${activeIndex.column * STEP}px)`,
        }}
      >
        -
      </button>

      <button
        className="button delete-row"
        onClick={handleDeleteRowClick}
        onMouseLeave={resetActiveIndex}
        style={{
          display:
            activeIndex.row === null || grid.length <= 1
              ? "none"
              : "block",
          transform: `translateY(${activeIndex.row * STEP}px)`,
        }}
      >
        -
      </button>
    </div>
  );
}
export default TableGrid;