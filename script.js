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
    this.rows = startRows;
    this.columns = startColumns;
    this.cells = [];
    this.row = [];
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

  getRowsCount() {
    return this.row.length;
  }

  getColumnsCount() {
    return this.cells[0]?.length ?? this.columns;
  }

  bindEvents() {
    this.table.addEventListener("pointerover", (event) => {
      const cell = event.target.closest(".cell");
      if (!cell) return;

      const rowIndex = Number(cell.dataset.row);
      const columnIndex = Number(cell.dataset.column);

      this.deleteRowButton.style.display = this.getRowsCount() > 1 ? "block" : "none";
      this.deleteColumnButton.style.display = this.getColumnsCount() > 1 ? "block" : "none";

      this.deleteRowButton.style.transform = `translateY(${rowIndex * STEP}px)`;
      this.deleteColumnButton.style.transform = `translateX(${columnIndex * STEP}px)`;

      this.deleteRowButton.dataset.rowIndex = String(rowIndex);
      this.deleteColumnButton.dataset.columnIndex = String(columnIndex);
    });

    this.table.addEventListener("mouseleave", (event) => {
      if (event.relatedTarget?.closest(".del-row, .del-col")) return;
      this.hideDeleteButtons();
    });

    this.deleteRowButton.addEventListener("mouseleave", () => {
      this.hideDeleteButtons();
    });

    this.deleteColumnButton.addEventListener("mouseleave", () => {
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
      if (this.getRowsCount() <= 1) {
        return;
      }
      const rowIndex = Number(this.deleteRowButton.dataset.rowIndex);

      this.removeRowByIndex(rowIndex);
      this.syncCellIndexes();
      this.hideDeleteButtons();
    });

    this.deleteColumnButton.addEventListener("click", () => {
      if (this.getColumnsCount() <= 1) {
        return;
      }
      const columnIndex = Number(this.deleteColumnButton.dataset.columnIndex);

      this.removeColumnByIndex(columnIndex);
      this.syncCellIndexes();
      this.hideDeleteButtons();
    });

  }

  createLayout() {
    this.wrapper = document.createElement("div");
    this.wrapper.className = "wrapper";
    this.parent.appendChild(this.wrapper);
    this.table = document.createElement("div");
    this.table.className = "table";
    this.wrapper.appendChild(this.table);
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
    const newColumnIndex = this.getColumnsCount();

    for (let rowIndex = 0; rowIndex < this.getRowsCount(); rowIndex++) {
      const cell = this.createCell(rowIndex, newColumnIndex);
      this.cells[rowIndex].push(cell);
      this.row[rowIndex].appendChild(cell);
    }
  }

  addNewRow() {
    const newRowIndex = this.getRowsCount();
    const row = document.createElement("div");
    row.className = "row";
    this.table.appendChild(row);
    this.row[newRowIndex] = row;
    this.cells[newRowIndex] = [];

    for (let columnIndex = 0; columnIndex < this.getColumnsCount(); columnIndex++) {
      const cell = this.createCell(newRowIndex, columnIndex);
      this.cells[newRowIndex][columnIndex] = cell;
      row.appendChild(cell);
    }
  }

  removeRowByIndex(rowIndex) {
    this.row[rowIndex].remove();
    this.row.splice(rowIndex, 1);
    this.cells.splice(rowIndex, 1);
  }

  removeColumnByIndex(columnIndex) {
    for (let rowIndex = 0; rowIndex < this.getRowsCount(); rowIndex++) {
      this.cells[rowIndex][columnIndex].remove();
      this.cells[rowIndex].splice(columnIndex, 1);
    }
  }

  syncCellIndexes() {
    for (let rowIndex = 0; rowIndex < this.getRowsCount(); rowIndex++) {
      for (let columnIndex = 0; columnIndex < this.getColumnsCount(); columnIndex++) {
        this.cells[rowIndex][columnIndex].dataset.row = String(rowIndex);
        this.cells[rowIndex][columnIndex].dataset.column = String(columnIndex);
      }
    }
  }

  renderGrid() {
    this.cells.length = 0;
    this.row.length = 0;
    const rowsFragment = document.createDocumentFragment();

    for (let rowIndex = 0; rowIndex < this.rows; rowIndex++) {
      this.cells[rowIndex] = [];

      const row = document.createElement("div");
      row.className = "row";
      rowsFragment.appendChild(row);
      this.row[rowIndex] = row;

      for (let columnIndex = 0; columnIndex < this.columns; columnIndex++) {
        const cell = this.createCell(rowIndex, columnIndex);
        this.cells[rowIndex][columnIndex] = cell;
        row.appendChild(cell);
      }
    }
    this.table.appendChild(rowsFragment);
  }
}

for (let tableIndex = 0; tableIndex < 1; tableIndex++) new Table(tablesRoot);