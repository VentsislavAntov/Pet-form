import { Routes, Route } from "react-router-dom"
import './App.css';
import FormGeneric from './components/FormGeneric/FormGeneric';
import CountryForm from './components/CountryForm/CountryForm';
import NotFound from './components/NotFound/NotFound';
import Pawtrip from "./images/Pawtrip.svg"

function App() {
  return (
    <div className="App">
      <img src={Pawtrip} alt="Logo" style={{ position: "absolute", top: 0, left: 0, width: 120 }} />
      <header className="App-header">
        <Routes>
          <Route path="/" element={ <FormGeneric/> } />
          <Route path="/country-form" element={ <CountryForm/> } />
          <Route path="*" element={ <NotFound/> } />
        </Routes>
      </header>
    </div>
  );
}

export default App;
