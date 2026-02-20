const app = document.getElementById("app");
const wrapper = document.createElement("div");
wrapper.className = "wrapper";
app.appendChild(wrapper);
const grid = document.createElement("div");
grid.className = "grid";
wrapper.appendChild(grid);

let cols = 4;
grid.style.gridTemplateColumns = `repeat(${cols}, 50px)`;

let rows = 4;
grid.style.gridTemplateRows = `repeat(${rows}, 50px)`;

function renderGrid() {
  grid.innerHTML = "";
  grid.style.gridTemplateColumns = `repeat(${cols}, 50px)`;
  grid.style.gridTemplateRows = `repeat(${rows}, 50px)`;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.row = r;
      cell.dataset.col = c;
      grid.appendChild(cell);
      /*cell.textContent = `${r + 1},${c + 1}`;
      cell.style.fontSize = "10px";*/
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

const CELL_SIZE = 50;
const GAP = 2;
const STEP = CELL_SIZE + GAP;

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

  delRowBtn.dataset.rowIndex = rowIndex;
  delColBtn.dataset.colIndex = colIndex;
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
  cols = cols + 1;
  renderGrid();
});

addRowBtn.addEventListener("click", () => {
  rows = rows + 1;
  renderGrid();
});

delRowBtn.addEventListener("click", () => {
  if (rows <= 1) return;
  rows = rows - 1;
  renderGrid();
  hideDeleteButtons();
});

delColBtn.addEventListener("click", () => {
  if (cols <= 1) return;
  cols = cols - 1;
  renderGrid();
  hideDeleteButtons();
});







