import { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import PropTypes from 'prop-types'; // Importamos PropTypes

const GenerateDocument = ({ formData, signatureURL }) => {
  const pdfRef = useRef();

  const generatePDF = () => {
    const doc = new jsPDF('p', 'pt', 'a4');
    const element = pdfRef.current;

    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      doc.addImage(imgData, 'PNG', 0, 0, 595, 842); // Imagen a tamaño de página A4
      doc.save('formulario.pdf');
    });
  };

  const generateJPG = () => {
    const element = pdfRef.current;

    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL('image/jpeg');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = 'formulario.jpg';
      link.click();
    });
  };

  return (
    <div>
      <div ref={pdfRef} style={{ width: '595px', height: '842px', padding: '20px', background: '#fff' }}>
        {/* Formato del PDF/JPG */}
        <h2 style={{ textAlign: 'center' }}>Formulario de Nuevos Residentes</h2>
        <p><strong>Nombre:</strong> {formData.fullName}</p>
        <p><strong>Teléfono:</strong> {formData.phone}</p>
        <p><strong>Correo Electrónico:</strong> {formData.email}</p>
        <p><strong>Propietario/Inquilino:</strong> {formData.ownerOrTenant}</p>
        <p><strong>Acepta reglamento:</strong> {formData.reglamento ? 'Sí' : 'No'}</p>

        {/* Firma digital */}
        {signatureURL && (
          <div style={{ marginTop: '20px' }}>
            <p><strong>Firma:</strong></p>
            <img src={signatureURL} alt="Firma" style={{ border: '1px solid black', width: '300px', height: '150px' }} />
          </div>
        )}

        {/* Puedes agregar más elementos con su respectivo posicionamiento */}
      </div>

      <div style={{ marginTop: '20px' }}>
        <button onClick={generatePDF}>Descargar PDF</button>
        <button onClick={generateJPG}>Descargar JPG</button>
      </div>
    </div>
  );
};

// Validaciones de las props
GenerateDocument.propTypes = {
  formData: PropTypes.shape({
    fullName: PropTypes.string.isRequired,  // Nombre completo es obligatorio
    phone: PropTypes.string.isRequired,  // Teléfono es obligatorio
    email: PropTypes.string.isRequired,  // Correo electrónico es obligatorio
    ownerOrTenant: PropTypes.string.isRequired,  // Propietario/Inquilino es obligatorio
    reglamento: PropTypes.bool.isRequired,  // Acepta reglamento es obligatorio y de tipo booleano
  }).isRequired,  // 'formData' es un objeto que contiene las propiedades anteriores y es obligatorio
  signatureURL: PropTypes.string,  // 'signatureURL' es opcional y debe ser una cadena
};

export default GenerateDocument;
