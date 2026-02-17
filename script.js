const app = document.getElementById('app');
const grid = document.createElement("div");
grid.className = "grid";
app.appendChild(grid);

let cols = 4;
grid.style.gridTemplateColumns = `repeat(${cols}, 50px)`;

let rows = 4;
grid.style.gridTemplateRows = `repeat(${rows}, 50px)`;

const totalCells = rows * cols;

for (let i = 0; i < totalCells; i++) {
  const cell = document.createElement("div");
  cell.className = "cell";
  grid.appendChild(cell);
}

const addColBtn = document.createElement("button");
addColBtn.className = "btn add-col";
addColBtn.textContent = "+";

const addRowBtn = document.createElement("button");
addRowBtn.className = "btn add-row";
addRowBtn.textContent = "+";

app.appendChild(addColBtn);
app.appendChild(addRowBtn);

addColBtn.addEventListener("click", () => {
  cols = cols + 1;
  grid.style.gridTemplateColumns = `repeat(${cols}, 50px)`;
  const totalCells = rows * cols;
  grid.innerHTML = "";
  for (let i = 0; i < totalCells; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    grid.appendChild(cell);
  }
});

addRowBtn.addEventListener("click", () => {
  rows = rows + 1;
  grid.style.gridTemplateRows = `repeat(${rows}, 50px)`;
  const totalCells = rows * cols;
  grid.innerHTML = "";
  for (let i = 0; i < totalCells; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    grid.appendChild(cell);
  }

});







