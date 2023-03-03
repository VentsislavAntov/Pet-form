import { Routes, Route } from "react-router-dom"
import './App.css';
import FormGeneric from './components/FormGeneric/FormGeneric';
import CountryForm from './components/CountryForm/CountryForm';
import WrongPath from './components/WrongPath/WrongPath';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Routes>
          <Route path="/" element={ <FormGeneric/> } />
          <Route path="/country-form" element={ <CountryForm/> } />
          <Route path="*" element={ <WrongPath/> } />
        </Routes>
      </header>
    </div>
  );
}

export default App;
