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

  table.addEventListener("mousemove", (event) => {
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

  table.addEventListener("mouseleave", (event) => {
   if (event.relatedTarget?.closest(".del-row, .del-col")) return;
    hideDeleteButtons();
  });
  delRowBtn.addEventListener("mouseleave", () => {
    hideDeleteButtons();
  });
  delColBtn.addEventListener("mouseleave", () => {
    hideDeleteButtons();
  });

  addColBtn.addEventListener("click", () => {
    cols++;

    for (let r = 0; r < rows; r++) {
      const cell = createCell(r, cols - 1);
      cells[r].push(cell);
      rowElements[r].appendChild(cell);
    }
    hideDeleteButtons();
  });

  addRowBtn.addEventListener("click", () => {
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

  delRowBtn.addEventListener("click", () => {
    if (rows <= 1) return;
    const rowIndex = Number(delRowBtn.dataset.rowIndex);
    rowElements[rowIndex].remove();
    rowElements.splice(rowIndex, 1);
    cells.splice(rowIndex, 1);
    rows--;

    updateDataCells();
    hideDeleteButtons();
  });

  delColBtn.addEventListener("click", () => {
    if (cols <= 1) return;
    const colIndex = Number(delColBtn.dataset.colIndex);
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