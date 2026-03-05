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

  static createCell(rowIndex, columnIndex) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.row = String(rowIndex);
    cell.dataset.column = String(columnIndex);
    return cell;
  }

  bindEvents() {
    this.tableElement.addEventListener("mousemove", (event) => {
      const cell = event.target.closest(".cell");
      if (!cell) return;

      const rowIndex = Number(cell.dataset.row);
      const columnIndex = Number(cell.dataset.column);

      this.deleteRowButton.style.display = this.rows > 1 ? "block" : "none";
      this.deleteColumnButton.style.display = this.columns > 1 ? "block" : "none";

      this.deleteRowButton.style.transform = `translateY(${rowIndex * STEP}px)`;
      this.deleteColumnButton.style.transform = `translateX(${columnIndex * STEP}px)`;

      this.deleteRowButton.dataset.rowIndex = String(rowIndex);
      this.deleteColumnButton.dataset.columnIndex = String(columnIndex);
    });

    this.tableElement.addEventListener("mouseleave", (event) => {
      if (event.relatedTarget?.closest(".del-row, .del-col")) return;
      this.hideDeleteButtons();
    });

    this.addColumnButton.addEventListener("click", () => {
      this.addNewColumn();
      this.hideDeleteButtons();
    });

    this.addRowButton.addEventListener("click", () => {
      this.addNewRow();
      this.hideDeleteButtons();
    });

    this.deleteRowButton.addEventListener("click", () => {
      if (this.rows <= 1) return;
      const rowIndex = Number(this.deleteRowButton.dataset.rowIndex);

      this.removeRowByIndex(rowIndex);
      this.updateDataCells();
      this.hideDeleteButtons();
    });

    this.deleteColumnButton.addEventListener("click", () => {
      if (this.columns <= 1) return;
      const columnIndex = Number(this.deleteColumnButton.dataset.columnIndex);

      this.removeColumnByIndex(columnIndex);
      this.updateDataCells();
      this.hideDeleteButtons();
    });

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
      const cellElement = Table.createCell(rowIndex, newColumnIndex);
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
      const cellElement = Table.createCell(newRowIndex, columnIndex);
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
        const cellElement = Table.createCell(rowIndex, columnIndex);
        this.cells[rowIndex][columnIndex] = cellElement;
        rowElement.appendChild(cellElement);
      }
    }
  }
}

for (let tableIndex = 0; tableIndex < 11; tableIndex++) new Table(tablesRoot);