const app = document.getElementById("app");
const tablesRoot = document.createElement("div");
tablesRoot.className = "tables";
app.appendChild(tablesRoot);

const CELL_SIZE = 50;
const GAP = 2;
const STEP = CELL_SIZE + GAP;
const ENABLE_PAGE_NAV = true;

function createTable(parent, startRows = 4, startCols = 4) {
  const wrapper = document.createElement("div");
  wrapper.className = "wrapper";
  parent.appendChild(wrapper);
  const grid = document.createElement("div");
  grid.className = "grid";
  wrapper.appendChild(grid);

  let cols = startCols;
  let rows = startRows;
  const cells = [];

  function updateGridTemplate() {
    grid.style.gridTemplateColumns = `repeat(${cols}, ${CELL_SIZE}px)`;
    grid.style.gridTemplateRows = `repeat(${rows}, ${CELL_SIZE}px)`;
  }

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
    grid.innerHTML = "";
    cells.length = 0;
    updateGridTemplate();

    for (let r = 0; r < rows; r++) {
      cells[r] = [];
      for (let c = 0; c < cols; c++) {
        const cell = createCell(r, c);
        cells[r][c] = cell;
        grid.appendChild(cell);
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
   if (event.relatedTarget?.closest(".del-row, .del-col")) return;
    hideDeleteButtons();
  });
  delRowBtn.addEventListener("mouseleave", () => { // коли курсор виходить з кнопки рядка
    hideDeleteButtons();
  });
  delColBtn.addEventListener("mouseleave", () => {
    hideDeleteButtons();
  });

  addColBtn.addEventListener("click", () => {
    cols++;
    updateGridTemplate();

    for (let r = 0; r < rows; r++) {
      const cell = createCell(r, cols - 1);
      cells[r].push(cell);
      grid.appendChild(cell);
    }
    hideDeleteButtons();
  });

  addRowBtn.addEventListener("click", () => {
    rows++;
    updateGridTemplate();

    cells[rows - 1] = [];
    for (let c = 0; c < cols; c++) {
      const cell = createCell( rows - 1, c);
      cells[rows - 1][c] = cell;
      grid.appendChild(cell);
    }
    hideDeleteButtons();
  });

  delRowBtn.addEventListener("click", () => {
    if (rows <= 1) return;
    const rowIndex = Number(delRowBtn.dataset.rowIndex);
    cells[rowIndex].forEach(cell => cell.remove());
    cells.splice(rowIndex, 1);
    rows--;

    updateGridTemplate();
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

    updateGridTemplate();
    updateDataCells();
    hideDeleteButtons();
  });
}
for (let i= 0; i < 11; i++)createTable(tablesRoot);

if (ENABLE_PAGE_NAV) {
  const scrollTopBtn = document.createElement("button");
  scrollTopBtn.className = "page-nav page-nav-top";
  scrollTopBtn.textContent = "↑";

  const scrollBottomBtn = document.createElement("button");
  scrollBottomBtn.className = "page-nav page-nav-bottom";
  scrollBottomBtn.textContent = "↓";

  document.body.appendChild(scrollTopBtn);
  document.body.appendChild(scrollBottomBtn);

  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({top: 0, behavior: "smooth"});
  });

  scrollBottomBtn.addEventListener("click", () => {
    window.scrollTo({top: document.body.scrollHeight, behavior: "smooth"});
  });

  function updatePageNavVisibility() {
    scrollTopBtn.style.display = window.scrollY > 200 ? "block" : "none";
  }

  updatePageNavVisibility();
  window.addEventListener("scroll", updatePageNavVisibility);
}