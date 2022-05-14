
import * as React from "react";
import { Routes, Route} from "react-router-dom";
import Dashboard from "./Dashboard";
import Login from "./Login";


function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<Login/>} />
        <Route path="/welcome" element={<Dashboard />} />

      </Routes>
    </div>
  );
}

export default App;