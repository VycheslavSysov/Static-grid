const app = document.getElementById ("app");
const tablesRoot = document.createElement("div");

const CELL_SIZE = 50;
const GAP = 2;
const STEP = CELL_SIZE + GAP;

const MAX_ROWS = 12;
const MAX_COLS = 12;

tablesRoot.className = "tables";
app.appendChild(tablesRoot);

function createTable(parent, startRows = 4, startCols = 4) {

  const wrapper = document.createElement("div");
  wrapper.className = "wrapper";
  parent.appendChild(wrapper);
  const grid = document.createElement("div");
  grid.className = "grid";
  wrapper.appendChild(grid);

  let cols = Math.min(Math.max(startCols, 1), MAX_COLS);
  let rows = Math.min(Math.max(startRows, 1), MAX_ROWS);

  let rowIds = Array.from({ length: rows }, (_, i) => i + 1 );
  let colIds = Array.from({ length: cols }, (_, i) => i + 1 );
  let nextRowId = rows + 1;
  let nextColId = cols + 1;

  function renderGrid() {
    grid.innerHTML = "";
    grid.style.gridTemplateColumns = `repeat(${cols}, ${CELL_SIZE}px)`;
    grid.style.gridTemplateRows = `repeat(${rows}, ${CELL_SIZE}px)`;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.dataset.row = String(r);
        cell.dataset.col = String(c);
        grid.appendChild(cell);
        // cell.textContent = `${rowIds[r]},${colIds[c]}`;
      }
    }
    updateAddButtonsState();
  }


  const addColBtn = document.createElement("button");
  addColBtn.className = "btn add-col";
  addColBtn.textContent = "+";

  const addRowBtn = document.createElement("button");
  addRowBtn.className = "btn add-row";
  addRowBtn.textContent = "+";

  const delColBtn = document.createElement("button");
  delColBtn.className = "btn del-col";
  delColBtn.textContent = "-";

  const delRowBtn = document.createElement("button");
  delRowBtn.className = "btn del-row";
  delRowBtn.textContent = "-";

  wrapper.appendChild(addColBtn);
  wrapper.appendChild(addRowBtn);
  wrapper.appendChild(delColBtn);
  wrapper.appendChild(delRowBtn);

  function hideDeleteButtons() {
    delRowBtn.style.display = "none";
    delColBtn.style.display = "none";
  }

  function updateAddButtonsState() {
    addColBtn.disabled = cols >= MAX_COLS;
    addRowBtn.disabled = rows >= MAX_ROWS;
  }

  renderGrid();

  grid.addEventListener("mousemove", (event) => {
    const cell = event.target.closest(".cell");
    if (!cell) return;

    const rowIndex = Number(cell.dataset.row);
    const colIndex = Number(cell.dataset.col);

    delRowBtn.style.display = rows > 1 ? "block" : "none";
    delColBtn.style.display = cols > 1 ? "block" : "none";

    delRowBtn.style.transform = `translateY(${rowIndex * STEP}px)`;
    delColBtn.style.transform = `translateX(${colIndex * STEP}px)`;

    delRowBtn.dataset.rowIndex = String(rowIndex);
    delColBtn.dataset.colIndex = String(colIndex);
  });

  grid.addEventListener("mouseleave", (event) => {
    const toDeleteBtn = event.relatedTarget?.closest(".del-row, .del-col");
    if (toDeleteBtn) return;
    hideDeleteButtons();
  });

  delRowBtn.addEventListener("mouseleave", () => { // коли курсор виходить з кнопки рядка
    hideDeleteButtons();
  });

  delColBtn.addEventListener("mouseleave", () => {
    hideDeleteButtons();
  });

  addColBtn.addEventListener("click", () => {
    if (cols >= MAX_COLS) return;
    cols = cols + 1;
    colIds.push(nextColId);
    nextColId = nextColId + 1;
    renderGrid();
    hideDeleteButtons();
  });

  addRowBtn.addEventListener("click", () => {
    if (rows >= MAX_ROWS) return;
    rows = rows + 1;
    rowIds.push(nextRowId);
    nextRowId = nextRowId + 1;
    renderGrid();
    hideDeleteButtons();
  });

  delRowBtn.addEventListener("click", () => {
    if (rows <= 1) return;

    const rowIndex = Number(delRowBtn.dataset.rowIndex);
    if (!Number.isInteger(rowIndex)) return;

    rowIds.splice(rowIndex, 1);
    rows = rows - 1;
    renderGrid();
    hideDeleteButtons();
  });

  delColBtn.addEventListener("click", () => {
    if (cols <= 1) return;

    const colIndex = Number(delColBtn.dataset.colIndex);
    if (!Number.isInteger(colIndex)) return;

    colIds.splice(colIndex, 1);
    cols = cols - 1;
    renderGrid();
    hideDeleteButtons();
  });
}

createTable(tablesRoot);
createTable(tablesRoot);
createTable(tablesRoot);








