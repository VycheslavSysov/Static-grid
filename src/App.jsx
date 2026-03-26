import TableGrid from "./TableGrid.jsx";


function App() {
  return (
      <div className="tables">
        {Array.from({ length: 51 }, (_, index) => (
            <TableGrid key={index}/>
        ))}
      </div>
  );
}


export default App;
