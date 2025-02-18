import './styles.css';
import { useRef, useState } from 'react';
import { Form, Input, Button, Upload, message, Radio, Space } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import SignatureCanvas from 'react-signature-canvas';
import jsPDF from 'jspdf';
import CropImage from './crop/cropimage';
import responsiva from '../assets/Responsiva_nuevos_Residentes.jpg';
import fakeReglamento from './documents/Reglamento Falso.pdf';
import fakeDirectorio from './documents/Directorio Falso.pdf';
import { saveAs } from 'file-saver';
import TermsCheckbox from './termsCheckbox';

const NewResidentForm = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [signatureURL, setSignatureURL] = useState('');
  const [idImageURL, setIdImageURL] = useState('');
  const [showCropper, setShowCropper] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [isSignatureSaved, setIsSignatureSaved] = useState(false);
  const signaturePadRef = useRef(null);

  const saveSignature = () => {
    if (signaturePadRef.current.isEmpty()) {
      message.error('Por favor, firma antes de continuar');
    } else {
      setSignatureURL(signaturePadRef.current.getTrimmedCanvas().toDataURL('image/png'));
      setIsSignatureSaved(true);
      message.success('Firma guardada correctamente');
    }
  };

  const clearSignature = () => {
    signaturePadRef.current.clear();
    setSignatureURL('');
    setIsSignatureSaved(false);
  };

  const generatePDF = () => {
    const doc = new jsPDF('p', 'pt', 'a4');

    doc.addImage(responsiva, 'JPEG', 0, 0, 595, 842);

    const name = form.getFieldValue('fullName');
    const houseNumber = form.getFieldValue('houseNumber');
    doc.setFontSize(11);
    doc.text(`${name}`, 130, 378);
    doc.text(`${houseNumber}`, 230, 200);
    doc.text(`${form.getFieldValue('phone')}`, 130, 398);
    doc.text(`${form.getFieldValue('email')}`, 130, 415);
    doc.text(`${form.getFieldValue('ownerOrTenant')}`, 80, 200);

    doc.text(`${name}`, 190, 520);

    if (signatureURL) {
      doc.addImage(signatureURL, 'PNG', 190, 470, 160, 80);
    }

    if (idImageURL) {
      doc.addImage(idImageURL, 'PNG', 200, 600, 160, 120);
    }

    doc.save('Formulario_Residente.pdf');
  };

  const handleFormSubmission = () => {
    generatePDF(); // Genera y descarga el PDF del formulario

    // Descarga los documentos adicionales
    saveAs(fakeReglamento, 'Reglamento.pdf');
    saveAs(fakeDirectorio, 'Directorio.pdf');

    form.resetFields(); // Limpia todos los campos del formulario
    setFileList([]); // Limpia la lista de archivos
    setSignatureURL(''); // Limpia la firma
    setIdImageURL(''); // Limpia la imagen de identificación
    setIsSignatureSaved(false); // Resetea el estado del botón de firma

    message.success('Documentos generados y descargados correctamente');
  };

  const handleUpload = ({ fileList }) => {
    if (fileList.length > 0) {
      const file = fileList[0].originFileObj;
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageToCrop(e.target.result);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
    setFileList(fileList);
  };

  const handleCropComplete = (croppedImage) => {
    setIdImageURL(croppedImage);
    setShowCropper(false);
  };

  return (
    <>
      <Form
        form={form}
        name="new-resident-form"
        layout="vertical"
        initialValues={{ ownerOrTenant: '' }}
        style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}
      >
        <Form.Item
          label="Nombre Completo"
          name="fullName"
          rules={[{ required: true, message: 'Por favor, ingresa tu nombre completo' }]}
        >
          <Input placeholder="Ingresa tu nombre completo" />
        </Form.Item>

        <Form.Item
          label="Número de Casa"
          name="houseNumber"
          rules={[{ required: true, message: 'Por favor, ingresa el número de casa' }]}
        >
          <Input placeholder="Ingresa el número de casa" />
        </Form.Item>

        <Form.Item
          label="Teléfono"
          name="phone"
          rules={[{ required: true, message: 'Por favor, ingresa tu número de teléfono' }]}
        >
          <Input placeholder="Ingresa tu número de teléfono" />
        </Form.Item>

        <Form.Item
          label="Correo Electrónico"
          name="email"
          rules={[{ required: true, message: 'Por favor, ingresa tu correo electrónico' }]}
        >
          <Input placeholder="Ingresa tu correo electrónico" />
        </Form.Item>

        <Form.Item
          label="Propietario o Inquilino"
          name="ownerOrTenant"
          rules={[{ required: true, message: 'Selecciona si eres propietario o inquilino' }]}
        >
          <Radio.Group>
            <Radio value="Propietario">Propietario</Radio>
            <Radio value="Inquilino">Inquilino</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="acceptTerms"
          valuePropName="checked"
          rules={[{ required: true, message: 'Debes aceptar que has recibido el reglamento y el directorio' }]}
          >
          <TermsCheckbox />
        </Form.Item>

        <Form.Item label="Colocar Firma en el rectángulo del centro">
          <div style={{ border: '2px solid #1a2a40', padding: '10px', position: 'relative', backgroundColor: '#f7f7f7' }}>
            <SignatureCanvas
              ref={signaturePadRef}
              penColor="#1a2a40"
              canvasProps={{ width: 500, height: 200, className: 'sigCanvas', style: { border: '1px solid #1a2a40', backgroundColor: '#ffffff' } }}
            />
          </div>
          <Space style={{ marginTop: '10px' }}>
            <Button onClick={clearSignature}>Limpiar Firma</Button>
            <Button type="primary" onClick={saveSignature} disabled={isSignatureSaved}>
              Guardar Firma
            </Button>
          </Space>
        </Form.Item>

        <Form.Item
          name="idImage"
          valuePropName="fileList"
          getValueFromEvent={(e) => e.fileList}
          rules={[{ required: true, message: 'Debes subir una imagen de identificación' }]}
        >
          <Upload
            beforeUpload={() => false}
            onChange={handleUpload}
            fileList={fileList}
            accept="image/*"
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />}>Subir Imagen de Identificación</Button>
          </Upload>
        </Form.Item>

        <Button type="primary" onClick={handleFormSubmission}>
          Descargar Documentos
        </Button>
      </Form>

      {showCropper && (
        <CropImage
          imageSrc={imageToCrop}
          onCropCompleteCallback={handleCropComplete}
          onClose={() => setShowCropper(false)}
        />
      )}
    </>
  );
};

export default NewResidentForm;