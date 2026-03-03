const app = document.getElementById("app");
const tablesRoot = document.createElement("div");
tablesRoot.className = "tables";
app.appendChild(tablesRoot);

const rootStyles = getComputedStyle(document.documentElement);
const CELL_SIZE = Number.parseInt(rootStyles.getPropertyValue("--cell-size"), 10);
const GAP = Number.parseInt(rootStyles.getPropertyValue("--cell-gap"), 10);
const STEP = CELL_SIZE + GAP;

function createTable(parent, startRows = 4, startCols = 4) {
  const wrapper = document.createElement("div");
  wrapper.className = "wrapper";
  parent.appendChild(wrapper);
  const table = document.createElement("div");
  table.className = "table";
  wrapper.appendChild(table);

  let cols = startCols;
  let rows = startRows;
  const cells = [];
  const rowElements = [];

  function createCell(r, c) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.row = String(r);
    cell.dataset.col = String(c);
    return cell;
  }

  function updateDataCells() {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        cells[r][c].dataset.row = String(r);
        cells[r][c].dataset.col = String(c);
      }
    }
  }

  function renderGrid() {
    table.innerHTML = "";
    cells.length = 0;
    rowElements.length = 0;

    for (let r = 0; r < rows; r++) {
      cells[r] = [];

      const row = document.createElement("div");
      row.className = "row";
      table.appendChild(row);
      rowElements[r] = row;

      for (let c = 0; c < cols; c++) {
        const cell = createCell(r, c);
        cells[r][c] = cell;
        row.appendChild(cell);
      }
    }
  }

  renderGrid();

  const addColumnButton = document.createElement("button");
  addColumnButton.className = "btn add-col";
  addColumnButton.textContent = "+";

  const addRowButton = document.createElement("button");
  addRowButton.className = "btn add-row";
  addRowButton.textContent = "+";

  const deleteColumnButton = document.createElement("button");
  deleteColumnButton.className = "btn del-col";
  deleteColumnButton.textContent = "-";

  const deleteRowButton = document.createElement("button");
  deleteRowButton.className = "btn del-row";
  deleteRowButton.textContent = "-";

  wrapper.appendChild(addColumnButton);
  wrapper.appendChild(addRowButton);
  wrapper.appendChild(deleteColumnButton);
  wrapper.appendChild(deleteRowButton);

  function hideDeleteButtons() {
    deleteRowButton.style.display = "none";
    deleteColumnButton.style.display = "none";
  }

  table.addEventListener("mousemove", (event) => {
    const cell = event.target.closest(".cell");
    if (!cell) return;

    const rowIndex = Number(cell.dataset.row);
    const colIndex = Number(cell.dataset.col);

    deleteRowButton.style.display = rows > 1 ? "block" : "none";
    deleteColumnButton.style.display = cols > 1 ? "block" : "none";

    deleteRowButton.style.transform = `translateY(${rowIndex * STEP}px)`;
    deleteColumnButton.style.transform = `translateX(${colIndex * STEP}px)`;

    deleteRowButton.dataset.rowIndex = String(rowIndex);
    deleteColumnButton.dataset.colIndex = String(colIndex);
  });

  table.addEventListener("mouseleave", (event) => {
   if (event.relatedTarget?.closest(".del-row, .del-col")) return;
    hideDeleteButtons();
  });
  deleteRowButton.addEventListener("mouseleave", () => {
    hideDeleteButtons();
  });
  deleteColumnButton.addEventListener("mouseleave", () => {
    hideDeleteButtons();
  });

  addColumnButton.addEventListener("click", () => {
    cols++;

    for (let r = 0; r < rows; r++) {
      const cell = createCell(r, cols - 1);
      cells[r].push(cell);
      rowElements[r].appendChild(cell);
    }
    hideDeleteButtons();
  });

  addRowButton.addEventListener("click", () => {
    rows++;
    const row = document.createElement("div");
    row.className = "row";
    table.appendChild(row);
    rowElements[rows - 1] = row;

    cells[rows - 1] = [];
    for (let c = 0; c < cols; c++) {
      const cell = createCell( rows - 1, c);
      cells[rows - 1][c] = cell;
      row.appendChild(cell);
    }
    hideDeleteButtons();
  });

  deleteRowButton.addEventListener("click", () => {
    if (rows <= 1) return;
    const rowIndex = Number(deleteRowButton.dataset.rowIndex);
    rowElements[rowIndex].remove();
    rowElements.splice(rowIndex, 1);
    cells.splice(rowIndex, 1);
    rows--;

    updateDataCells();
    hideDeleteButtons();
  });

  deleteColumnButton.addEventListener("click", () => {
    if (cols <= 1) return;
    const colIndex = Number(deleteColumnButton.dataset.colIndex);
    for (let r = 0; r < rows; r++) {
      cells[r][colIndex].remove();
      cells[r].splice(colIndex, 1);
    }
    cols--;

    updateDataCells();
    hideDeleteButtons();
  });
}
for (let i= 0; i < 11; i++)createTable(tablesRoot);