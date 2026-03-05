const app = document.getElementById("app");
const tablesRoot = document.createElement("div");
tablesRoot.className = "tables";
app.appendChild(tablesRoot);

const rootStyles = getComputedStyle(document.documentElement);
const CELL_SIZE = Number.parseInt(rootStyles.getPropertyValue("--cell-size"), 10);
const GAP = Number.parseInt(rootStyles.getPropertyValue("--cell-gap"), 10);
const STEP = CELL_SIZE + GAP;

class Table {
  constructor(parent, startRows = 4, startColumns = 4) {
    this.parent = parent;
    this.startRows = startRows;
    this.startColumns = startColumns;
    this.initializeState();
    this.createLayout();
    this.createControls();
    this.renderGrid();
    this.bindEvents();
    this.hideDeleteButtons();
  }

  createCell(rowIndex, columnIndex) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.row = String(rowIndex);
    cell.dataset.column = String(columnIndex);
    return cell;
  }

  bindEvents() {
  }

  initializeState() {
    this.rows = this.startRows;
    this.columns = this.startColumns;
    this.cells = [];
    this.rowElements = [];
  }

  createLayout() {
    this.wrapper = document.createElement("div");
    this.wrapper.className = "wrapper";
    this.parent.appendChild(this.wrapper);
    this.tableElement = document.createElement("div");
    this.tableElement.className = "table";
    this.wrapper.appendChild(this.tableElement);
  }

  createControls() {
    this.addColumnButton = document.createElement("button");
    this.addColumnButton.className = "btn add-col";
    this.addColumnButton.textContent = "+";

    this.addRowButton = document.createElement("button");
    this.addRowButton.className = "btn add-row";
    this.addRowButton.textContent = "+";

    this.deleteColumnButton = document.createElement("button");
    this.deleteColumnButton.className = "btn del-col";
    this.deleteColumnButton.textContent = "-";

    this.deleteRowButton = document.createElement("button");
    this.deleteRowButton.className = "btn del-row";
    this.deleteRowButton.textContent = "-";

    this.wrapper.append(
        this.addColumnButton,
        this.addRowButton,
        this.deleteColumnButton,
        this.deleteRowButton
    );
  }

   hideDeleteButtons() {
    this.deleteRowButton.style.display = "none";
    this.deleteColumnButton.style.display = "none";
  }

  addNewColumn() {
    this.columns++;
    const newColumnIndex = this.columns - 1;

    for (let rowIndex = 0; rowIndex < this.rows; rowIndex++) {
      const cellElement = this.createCell(rowIndex, newColumnIndex);
      this.cells[rowIndex].push(cellElement);
      this.rowElements[rowIndex].appendChild(cellElement);
    }
  }

  addNewRow() {
    this.rows++;
    const newRowIndex = this.rows - 1;
    const rowElement = document.createElement("div");
    rowElement.className = "row";
    this.tableElement.appendChild(rowElement);
    this.rowElements[newRowIndex] = rowElement;
    this.cells[newRowIndex] = [];

    for (let columnIndex = 0; columnIndex < this.columns; columnIndex++) {
      const cellElement = this.createCell(newRowIndex, columnIndex);
      this.cells[newRowIndex][columnIndex] = cellElement;
      rowElement.appendChild(cellElement);
    }
  }

  removeRowByIndex(rowIndex) {
    this.rowElements[rowIndex].remove();
    this.rowElements.splice(rowIndex, 1);
    this.cells.splice(rowIndex, 1);
    this.rows--;
  }

  removeColumnByIndex(columnIndex) {
    for (let rowIndex = 0; rowIndex < this.rows; rowIndex++) {
      this.cells[rowIndex][columnIndex].remove();
      this.cells[rowIndex].splice(columnIndex, 1);
    }
    this.columns--;
  }

  updateDataCells() {
    for (let rowIndex = 0; rowIndex < this.rows; rowIndex++) {
      for (let columnIndex = 0; columnIndex < this.columns; columnIndex++) {
        this.cells[rowIndex][columnIndex].dataset.row = String(rowIndex);
        this.cells[rowIndex][columnIndex].dataset.column = String(columnIndex);
      }
    }
  }

  renderGrid() {
    this.tableElement.innerHTML = "";
    this.cells.length = 0;
    this.rowElements.length = 0;

    for (let rowIndex = 0; rowIndex < this.rows; rowIndex++) {
      this.cells[rowIndex] = [];

      const rowElement = document.createElement("div");
      rowElement.className = "row";
      this.tableElement.appendChild(rowElement);
      this.rowElements[rowIndex] = rowElement;

      for (let columnIndex = 0; columnIndex < this.columns; columnIndex++) {
        const cellElement = this.createCell(rowIndex, columnIndex);
        this.cells[rowIndex][columnIndex] = cellElement;
        rowElement.appendChild(cellElement);
      }
    }
  }
}

function createTable(parent, startRows = 4, startColumns = 4) {
  const wrapper = document.createElement("div");
  wrapper.className = "wrapper";
  parent.appendChild(wrapper);

  const table = document.createElement("div");
  table.className = "table";
  wrapper.appendChild(table);

  let columns = startColumns;
  let rows = startRows;
  const cells = [];
  const rowElements = [];

  function createCell(rowIndex, columnIndex) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.row = String(rowIndex);
    cell.dataset.column = String(columnIndex);
    return cell;
  }

  function updateDataCells() {
    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
      for (let columnIndex = 0; columnIndex < columns; columnIndex++) {
        cells[rowIndex][columnIndex].dataset.row = String(rowIndex);
        cells[rowIndex][columnIndex].dataset.column = String(columnIndex);
      }
    }
  }

  function renderGrid() {
    table.innerHTML = "";
    cells.length = 0;
    rowElements.length = 0;

    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
      cells[rowIndex] = [];

      const rowElement = document.createElement("div");
      rowElement.className = "row";
      table.appendChild(rowElement);
      rowElements[rowIndex] = rowElement;

      for (let columnIndex = 0; columnIndex < columns; columnIndex++) {
        const cellElement = createCell(rowIndex, columnIndex);
        cells[rowIndex][columnIndex] = cellElement;
        rowElement.appendChild(cellElement);
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

  function addNewColumn() {
    columns++;
    const newColumnIndex = columns - 1;

    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
      const cellElement = createCell(rowIndex, newColumnIndex);
      cells[rowIndex].push(cellElement);
      rowElements[rowIndex].appendChild(cellElement);
    }
  }

  function addNewRow() {
    rows++;
    const newRowIndex = rows - 1;
    const rowElement = document.createElement("div");
    rowElement.className = "row";
    table.appendChild(rowElement);
    rowElements[newRowIndex] = rowElement;
    cells[newRowIndex] = [];

    for (let columnIndex = 0; columnIndex < columns; columnIndex++) {
      const cellElement = createCell(newRowIndex, columnIndex);
      cells[newRowIndex][columnIndex] = cellElement;
      rowElement.appendChild(cellElement);
    }
  }

  function removeRowByIndex(rowIndex) {

    rowElements[rowIndex].remove();
    rowElements.splice(rowIndex, 1);
    cells.splice(rowIndex, 1);
    rows--;
  }

  function removeColumnByIndex(columnIndex) {
    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
      cells[rowIndex][columnIndex].remove();
      cells[rowIndex].splice(columnIndex, 1);
    }
    columns--;
  }

  table.addEventListener("mousemove", (event) => {
    const cell = event.target.closest(".cell");
    if (!cell) return;

    const rowIndex = Number(cell.dataset.row);
    const columnIndex = Number(cell.dataset.column);

    deleteRowButton.style.display = rows > 1 ? "block" : "none";
    deleteColumnButton.style.display = columns > 1 ? "block" : "none";

    deleteRowButton.style.transform = `translateY(${rowIndex * STEP}px)`;
    deleteColumnButton.style.transform = `translateX(${columnIndex * STEP}px)`;

    deleteRowButton.dataset.rowIndex = String(rowIndex);
    deleteColumnButton.dataset.columnIndex = String(columnIndex);
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
    addNewColumn();
    hideDeleteButtons();
  });

  addRowButton.addEventListener("click", () => {
    addNewRow();
    hideDeleteButtons();
  });

  deleteRowButton.addEventListener("click", () => {
    if (rows <= 1) return;
    const rowIndex = Number(deleteRowButton.dataset.rowIndex);

    removeRowByIndex(rowIndex);
    updateDataCells();
    hideDeleteButtons();
  });

  deleteColumnButton.addEventListener("click", () => {
    if (columns <= 1) return;
    const columnIndex = Number(deleteColumnButton.dataset.columnIndex);

    removeColumnByIndex(columnIndex);
    updateDataCells();
    hideDeleteButtons();
  });
}

for (let tableIndex = 0; tableIndex < 11; tableIndex++) createTable(tablesRoot);