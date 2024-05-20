import React, { useState, useCallback, useEffect } from "react";
import Dropzone from "react-dropzone";
import { Row, Col, Label, Button } from "reactstrap";
import { client, GET_TIPO_DOCUMENTOS } from "../../graphql";

const DocumentosInput = ({
  fileNames,
  setFileNames,
  newFiles,
  setNewFiles,
  setInstaladorCertificadoConDocumento,
}) => {
  const [uploadFiles, setUploadFiles] = useState([]);
  const [tipoDocumentos, setTipoDocumentos] = useState();

  /* const onDrop = useCallback((acceptedFiles) => {
    setNewFiles(newFiles.concat(acceptedFiles));
    let newFileNames = [];
    acceptedFiles.forEach((file) => {
      newFileNames.push({
        NOMBRE: file.name,
        RUTA: "",
        TIPO_DOCUMENTO_ID: "",
        IS_NEW: true,
      });
    });
    const files = fileNames.concat(newFileNames);
    setFileNames(files);
    setUploadFiles(acceptedFiles);
  }); */

  const getDocumentos = () => {
    client
      .query({
        query: GET_TIPO_DOCUMENTOS,
      })
      .then((res) => {
        //console.log("TIPOS", res.data)
        let tipos = res.data.getTipoDocumento;
        tipos.sort((a, b) => a.nombre.localeCompare(b.nombre));
        setTipoDocumentos(tipos);
      });
  };

  const onDrop = useCallback((acceptedFiles) => {
    setNewFiles(newFiles.concat(acceptedFiles));
    let newFileNames = [];
    acceptedFiles.forEach((file) => {
      newFileNames.push({
        NOMBRE: file.name,
        RUTA: "",
        TIPO_DOCUMENTO_ID: "",
        IS_NEW: true,
      });
    });
    const files = fileNames.concat(newFileNames);
    setFileNames(files);
    setUploadFiles(acceptedFiles);
  });

  const changeType = (event) => {
    const selectedFiles = fileNames.map((fileName) => {
      if (fileName.NOMBRE === event.target.name) {
        fileName.TIPO_DOCUMENTO_ID = event.target.value;
      }
      return fileName;
    });
    setFileNames(selectedFiles);
  };

  const quitarDocumento = (name) => {
    setNewFiles(newFiles.filter((item) => item.name !== name.NOMBRE));
    setFileNames(fileNames.filter((item) => item !== name));
  };
  useEffect(() => {
    if (fileNames.length > 0) {
        setInstaladorCertificadoConDocumento(true);
    } else {
        setInstaladorCertificadoConDocumento(false);
    }
}, [fileNames, setInstaladorCertificadoConDocumento]);
  useEffect(() => {
    //getDocumentos();
  }, []);

  return (
    <Col sm={12} className="px-2">
      <div className="App">
        <Label>Añadir carnet de instalador: <span style={{ color: 'red' }}>*</span></Label>
        <Dropzone onDrop={onDrop}>
          {({
            getRootProps,
            getInputProps,
            isDragActive,
            isDragAccept,
            isDragReject,
          }) => {
            const additionalClass = isDragAccept
              ? "accept"
              : isDragReject
              ? "reject"
              : "";

            return (
              <div
                {...getRootProps({
                  className: `dropzone ${additionalClass}`,
                })}
              >
                <input {...getInputProps()} />
                <span>{isDragActive ? "📂" : "📁"}</span>
                <p>Suelta aquí la foto o haz click para seleccionarla.</p>
              </div>
            );
          }}
        </Dropzone>
        <div>
          {fileNames.length > 0 ? <strong>Documentos:</strong> : <></>}
          <ul>
            {fileNames.map((fileName) => (
              <li key={fileName.NOMBRE}>
                <span className="filename-list">{fileName.NOMBRE}</span>

                {fileName.IS_NEW && (
                  <span
                    className="delete-document"
                    onClick={() => quitarDocumento(fileName)}
                  >
                    <Button color="danger">Eliminar</Button>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Col>
  );
};

export default DocumentosInput;
