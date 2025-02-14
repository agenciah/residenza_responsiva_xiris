// App.js
import 'antd/dist/reset.css'; // Estilos de Ant Design
import NewResidentForm from './components/newResidentForm';
import './App.css'; // Archivo CSS para el estilo personalizado

function App() {
  return (
    <div className="App">
      <header className="App-header">
        
        <h1>Formato para nuevo Residente</h1> 
        <p>
          Llena el siguiente formulario, al finalizar, presiona el botón &quot;Descargar documentos&quot;,<br /> 
          obtendras el reglamento del condominio, el directorio de la administración y el formulario.<br />
          El formulario, por favor mándalo a la administración del condominio.
        </p>
      </header>
      <NewResidentForm/>
    </div>
  );
}

export default App;