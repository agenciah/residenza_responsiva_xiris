import 'antd/dist/reset.css'; // Estilos de Ant Design
import NewResidentForm from './components/newResidentForm';
import './App.css'; // Archivo CSS para el estilo personalizado
import residenza_logo from "./assets/Residenza_logo.jpg";
import xiris_logo from "./assets/logo_xiris ac.png";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* Contenedor de los logos */}
        <div className="logos-container">
          <img src={xiris_logo} alt="Xiris Logo" className="logo left-logo" />
          <img src={residenza_logo} alt="Residenza Logo" className="logo right-logo" />
        </div>

        <h1>Formato para nuevo Residente</h1> 
        <p>
          Llena el siguiente formulario, al finalizar, presiona el botón &quot;Descargar documentos&quot;,<br /> 
          obtendrás el reglamento del condominio, el directorio de la administración y el formulario.<br />
          El formulario, por favor mándalo a la administración del condominio Xiris.
        </p>
      </header>

      <NewResidentForm />
    </div>
  );
}

export default App;
