const app = document.getElementById('app');
const grid = document.createElement("div");
grid.className = "grid";
app.appendChild(grid);

const cols = 4;
grid.style.gridTemplateColumns = `repeat(${cols}, 50px)`;

const totalCells = 16;

for (let i = 0; i < totalCells; i++) {
  const cell = document.createElement("div");
  cell.className = "cell";
  grid.appendChild(cell);
}



