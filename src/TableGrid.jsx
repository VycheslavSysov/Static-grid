import { useCallback, useEffect, useReducer, useRef } from "react";

const rootStyles = getComputedStyle(document.documentElement);
const CELL_SIZE = Number.parseInt(rootStyles.getPropertyValue("--cell-size"), 10);
const GAP = Number.parseInt(rootStyles.getPropertyValue("--cell-gap"), 10);
const STEP = CELL_SIZE + GAP;

function createGrid(rows, columns) {
  let id = 0;
  const grid = [];

  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < columns; c++) {
      row.push(id++);
    }
    grid.push(row);
  }

  return { grid, lastId: id - 1 };
}

// ✅ Reducer = єдине джерело правди
function gridReducer(state, action) {
  switch (action.type) {
    case "addRow": {
      const columnCount = state.grid[0]?.length ?? 0;
      if (!columnCount) return state;

      const newRow = new Array(columnCount);
      let lastId = state.lastId;

      for (let i = 0; i < columnCount; i++) {
        newRow[i] = ++lastId;
      }

      return {
        grid: [...state.grid, newRow],
        lastId,
      };
    }

    case "deleteRow": {
      if (action.row === null) return state;

      return {
        ...state,
        grid: state.grid.filter((_, i) => i !== action.row),
      };
    }

    case "addColumn": {
      let lastId = state.lastId;

      const newGrid = state.grid.map((row) => {
        const newCell = ++lastId;
        return [...row, newCell];
      });

      return {
        grid: newGrid,
        lastId,
      };
    }

    case "deleteColumn": {
      if (action.column === null) return state;

      return {
        ...state,
        grid: state.grid.map((row) =>
          row.filter((_, i) => i !== action.column)
        ),
      };
    }

    default:
      return state;
  }
}

function TableGrid({ rows = 4, columns = 4 }) {
  // ✅ Lazy init без ref і без дублювання
  const [state, dispatch] = useReducer(
    gridReducer,
    { rows, columns },
    ({ rows, columns }) => createGrid(rows, columns)
  );

  const { grid } = state;

  const [activeIndex, setActiveIndex] = useReducer(
    (_, next) => next,
    { row: null, column: null }
  );

  const activeRef = useRef(activeIndex);

  useEffect(() => {
    activeRef.current = activeIndex;
  }, [activeIndex]);

  const resetActiveIndex = useCallback(() => {
    setActiveIndex({ row: null, column: null });
  }, []);

  const handleAddRowClick = useCallback(() => {
    dispatch({ type: "addRow" });
    resetActiveIndex();
  }, [resetActiveIndex]);

  const handleDeleteRowClick = useCallback(() => {
    dispatch({ type: "deleteRow", row: activeRef.current.row });
    resetActiveIndex();
  }, [resetActiveIndex]);

  const handleAddColumnClick = useCallback(() => {
    dispatch({ type: "addColumn" });
    resetActiveIndex();
  }, [resetActiveIndex]);

  const handleDeleteColumnClick = useCallback(() => {
    dispatch({ type: "deleteColumn", column: activeRef.current.column });
    resetActiveIndex();
  }, [resetActiveIndex]);

  const handlePointerOver = useCallback((e) => {
    const cell = e.target.closest(".cell");
    if (!cell) return;

    const row = Number(cell.dataset.row);
    const column = Number(cell.dataset.column);

    const prev = activeRef.current;
    if (prev.row === row && prev.column === column) return;

    setActiveIndex({ row, column });
  }, []);

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

      <button className="button add-column" onClick={handleAddColumnClick}>
        +
      </button>

      <button className="button add-row" onClick={handleAddRowClick}>
        +
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
