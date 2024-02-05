import React, { useState, useEffect, useCallback } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormText,
  Col, Row, Form, FormGroup, Label, Input,
} from "reactstrap";
import Dropzone from "react-dropzone";
//constants
import { API_INPRONET } from "../../constants";

const ShowDocumentsModal = ({ showDocumentsModal, toggle, retirada }) => {
  console.log("retirada", retirada);
  const [parteA, setParteA] = useState(false);
  const [parteB, setParteB] = useState(false);
  const [fileNames, setFileNames] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [fileNamesB, setFileNamesB] = useState([]);
  const [newFilesB, setNewFilesB] = useState([]);
  const [uploadFilesB, setUploadFilesB] = useState([]);
  const fetchDocument = async (url) => {
    let fetchDocument = await fetch(
      `${API_INPRONET}/download.php?filename=${url}`
    );
    console.log(fetchDocument)
    if(fetchDocument == null) {
      fetchDocument = await fetch(
      `${API_INPRONET}/download.php?filename=${url}`
    );
    }
    const resfetchDocument = await fetchDocument.blob();
    var reader = new FileReader();
    reader.onload = (e) => {
      console.log(e.target.result);
      if (!url.includes("parteB")) setParteA(e.target.result);
      else setParteB(e.target.result);
    };
    reader.readAsDataURL(resfetchDocument);
  };
  const onDropA = useCallback((acceptedFiles) => {
    setNewFiles(newFiles.concat(acceptedFiles));
    let newFileNames = [];
    // REVISAR FIX PARA AÑADIR ESTADO
    //setDatosForm({...datosForm, estado_id: 2})
    
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

  const onDropB = useCallback((acceptedFiles) => {
    setNewFilesB(newFilesB.concat(acceptedFiles));
    let newFileNames = [];
    // REVISAR FIX PARA AÑADIR ESTADO
    //setDatosForm({...datosForm, estado_id: 3})

    acceptedFiles.forEach((file) => {
      newFileNames.push({
        NOMBRE: file.name,
        RUTA: "",
        TIPO_DOCUMENTO_ID: "",
        IS_NEW: true,
      });
    });
    const files = fileNamesB.concat(newFileNames);
    setFileNamesB(files);
    setUploadFilesB(acceptedFiles);
  });


const quitarDocumentoA = (name) => {
setNewFiles(newFiles.filter((item) => item.name !== name.NOMBRE));
setFileNames(fileNames.filter((item) => item !== name));
};

const quitarDocumentoB = (name) => {
    setNewFilesB(newFilesB.filter((item) => item.name !== name.NOMBRE));
    setFileNamesB(fileNamesB.filter((item) => item !== name));
};

const saveDocumentA = async () => {
  if(newFiles.length>0 && fileNames.length>0) {
    let fileDataFiltered = []
      const filterred = fileNames.filter(file => {
        return newFiles[0].name === file.NOMBRE
      })
      if(filterred.length>0) fileDataFiltered = filterred;

    const docData = new FormData();
    docData.append("accion", "subirDocumentoBricomart")
    docData.append("tipoId", 2)
    docData.append('documento', newFiles[0])
                          
      const requestOptions = {
        method: 'POST',
        body: docData
      };

      const postDocument = await fetch(`${API_INPRONET}/core/controller/BricomartController.php`, requestOptions)
      const resPostDocument = await postDocument.text() 
      return resPostDocument
  }
}
const saveDocumentB = async () => {
  if(newFilesB.length>0 && fileNamesB.length>0) {
      let fileDataFiltered = []
        const filterred = fileNames.filter(file => {
          return newFilesB[0].name === file.NOMBRE
        })
        if(filterred.length>0) fileDataFiltered = filterred;

      const docData = new FormData();
      docData.append("accion", "AdjuntarDocumentoLeroyInstalaciones")
      docData.append("tipoName", 3)
      docData.append("instalacionId", 3)
      docData.append('documento', newFilesB[0])
                          
      const requestOptions = {
        method: 'POST',
        body: docData
      };

      const postDocument = await fetch(`${API_INPRONET}/core/controller/BricomartController.php`, requestOptions)
      const resPostDocument = await postDocument.text() 
      return resPostDocument
  }
}
  const ShowDocuments = () => {
    return (
      <>
        {showDocument(retirada.parteA_ruta, "parteA")}
        {retirada.parteB_ruta && showDocument(retirada.parteB_ruta, "parteB")}
      </>
    );
  };

  const showDocument = (path, type) => {
    if (!parteA) fetchDocument(path);
    if (!parteB) fetchDocument(path);
    return (
      <li key={path}>
        <span>
          <a
            target="_blank"
            download="documento"
            href={type === "parteB" ? [parteB] : [parteA]}
            title="Descargar"
          >
            {path.includes("parteB") ? "Parte B" : "Parte A"}
          </a>
        </span>
      </li>
    );
  };

  return (
    <Modal isOpen={showDocumentsModal} toggle={toggle}>
      <ModalHeader>Documentos</ModalHeader>
      <ModalBody>
      <Row form>
                                <Col md={4}>
                                <Label>Añadir parte A*:</Label>
                                <Dropzone onDrop={onDropA}>
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
                                                onClick={() => quitarDocumentoA(fileName)}
                                            >
                                                <Button color="danger">Eliminar</Button>
                                            </span>
                                            )}
                                        </li>
                                        ))}
                                    </ul>
                                    </div>
                                </Col>
                                <Col md={4}>
                                <Label>Añadir parte B:</Label>
                                <Dropzone onDrop={onDropB}>
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
                                        </div>
                                        );
                                    }}
                                </Dropzone>
                                    <div>
                                    {fileNamesB.length > 0 ? <strong>Documentos:</strong> : <></>}
                                    <ul>
                                        {fileNamesB.map((fileName) => (
                                        <li key={fileName.NOMBRE}>
                                            <span className="filename-list">{fileName.NOMBRE}</span>

                                            {fileName.IS_NEW && (
                                                <> <span
                                                className="delete-document"
                                                onClick={() => saveDocumentB(fileName)}
                                            >
                                                <Button color="danger">Adjuntar</Button>
                                            </span>
                                            <span
                                                className="delete-document"
                                                onClick={() => quitarDocumentoB(fileName)}
                                            >
                                                <Button color="danger">Eliminar</Button>
                                            </span></>
                                            )}
                                        </li>
                                        ))}
                                    </ul>
                                    </div>
                                </Col>
                            </Row>
        <ShowDocuments />
      </ModalBody>
      <ModalFooter>
        <Button onClick={toggle}>Cerrar</Button>
      </ModalFooter>
    </Modal>
  );
};

export default ShowDocumentsModal;
