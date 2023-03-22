import './App.css';
import Header from './components/Header/Header';
import RoutesContainer from "./components/RoutesContainer/RoutesContainer";
import Sidemenu from "./components/Sidemenu/Sidemenu";

function App() {
  return (
    <div className="App">
      <Header />
      <Sidemenu />
      <RoutesContainer/>
    </div>
  );
}

export default App;
