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
import {
  client,
  getRetiradaDocumentosId,
  getDocumentosById,
  GET_TIPO_DOCUMENTOS
} from "./../../graphql";
import { API_INPRONET } from "./../../constants";
import ShowDocumentsModal from "./ShowDocumentsModal";

import Dropzone from "react-dropzone";
const ShowDocumentosModal = ({
  retiradaId,
  estado,
  mostrarDocumentacion,
  row,
  title,
  showDocumentsModal, 
  toggle, 
  retirada
}) => {

  const [documentosAsociadosRetirada, setDocumentosAsociadosRetirada] =
    useState([]);
    const [fileNames, setFileNames] = useState([]);
    const [newFiles, setNewFiles] = useState([]);
    const [uploadFiles, setUploadFiles] = useState([]);
    const [fileNamesB, setFileNamesB] = useState([]);
    const [newFilesB, setNewFilesB] = useState([]);
    const [uploadFilesB, setUploadFilesB] = useState([]);
  const [documentosCentro, setDocumentosCentro] = useState();
  const [documentosGestor, setDocumentosGestor] = useState();
  const [documentosTransportista, setDocumentosTransportista] = useState();
  
  const [documentoDescarga, setDocumentoDescarga] = useState();

  let tipoDocumentos = [];
  const onClickCerrar = () => {
    toggle();
  };

  const getTiposDeDocumentos = useCallback(() => {
    client
        .query({
            query: GET_TIPO_DOCUMENTOS,
            fetchPolicy: "no-cache",
        })
        .then((res) => {
            tipoDocumentos = res.data.getLeroyInstalacionesTipoDocumento;
            
        });
    }, [client]);

  const getDocumentos = useCallback(() => {
    
    client
      .query({
        query: getRetiradaDocumentosId,
        fetchPolicy: "no-cache",
        variables: {
          retiradaId: retirada.ID.toString(),
        },
      })
      .then((res) => {
        fillDocumentsArray(
          res.data.getLeroyInstalacionesLeroyInstalacionesDocumento,
          setDocumentosAsociadosRetirada
        );
      });
  }, [client]);

  const fillDocumentsArray = async (retiradaDocumentos, setDocuments) => {
    let arrayDocumentos = [];
    for (let i = 0; i < retiradaDocumentos.length; i++) {
      await client
        .query({
          query: getDocumentosById,
          fetchPolicy: "no-cache",
          variables: {
            id: retiradaDocumentos[i].LEROY_INSTALACIONES_DOCUMENTO_ID.toString(),
          },
        })
        .then((res) => {
          arrayDocumentos.push(res.data.getLeroyInstalacionesDocumento[0]);
        });
    }
    // Añadir nombre del tipo de documento segun el tipo de documento id
    for (let i = 0; i < arrayDocumentos.length; i++) {
      for (let j = 0; j < tipoDocumentos.length; j++) {
        console.log(arrayDocumentos[i].TIPO_DOCUMENTO_ID);
        if (
          arrayDocumentos[i].TIPO_DOCUMENTO_ID ==
          tipoDocumentos[j].ID
        ) {
          arrayDocumentos[i].TIPO_DOCUMENTO = tipoDocumentos[j];
        }
      }
    }
    setDocuments(arrayDocumentos);
  };

  
//   const getDocumentosEntidadesAsociadas = () => {
//     const gestorId = row.GESTOR_ID ? row.GESTOR_ID : row.gestorId;
//     const transportistaId = row.TRANSPORTISTA_ID ? row.TRANSPORTISTA_ID : row.transportistaId;
//     const centroId = row.CENTRO_PRODUCTOR_ID ? row.CENTRO_PRODUCTOR_ID : row.centroId;
//     client
//       .query({
//         query: getRetiradaDocumentosEntidadesAsociadas,
//         variables: {
//           gestorId: gestorId.toString(),
//           transportistaId: transportistaId.toString(),
//           centroId: centroId.toString(),
//         },
//       })
//       .then((res) => {
//         fillDocumentsArray(
//           res.data.getCentroProductorDocumento,
//           setDocumentosCentro
//         );
//         fillDocumentsArray(res.data.getGestoresAutorizacionesDocumentoView, setDocumentosGestor);
//         fillDocumentsArray(
//           res.data.getTransportistasAutorizacionesDocumentoView,
//           setDocumentosTransportista
//         );
//       });
//   };
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

  const formData = new FormData();
  formData.append("accion", "subirDocumentoBricomart")
  formData.append("tipoId", 2);
  formData.append("instalacionId", retirada.ID);

  formData.append('documento', newFiles[0])
                        
    const requestOptions = {
      method: 'POST',
      body: formData
    };

    const postDocument = await fetch(`${API_INPRONET}/core/controller/BricomartController.php`, requestOptions)
    toggle();
}
}
const saveDocumentB = async () => {
if(newFilesB.length>0 && fileNamesB.length>0) {
    let fileDataFiltered = []
      const filterred = fileNames.filter(file => {
        return newFilesB[0].name === file.NOMBRE
      })
      if(filterred.length>0) fileDataFiltered = filterred;

    const formData = new FormData();
    formData.append("accion", "AdjuntarDocumentoLeroyInstalaciones")
    formData.append("tipoId", 3)
    formData.append("instalacionId", retirada.ID)
    formData.append('documento', newFilesB[0])
    formData.append('direct', 1);                    
    const requestOptions = {
      method: 'POST',
      body: formData
    };
    console.log("requestOptions", formData)
    const postDocument = await fetch(`${API_INPRONET}/core/controller/LeroyInstalacionesController.php`, requestOptions)
    toggle();
    //const resPostDocument = await postDocument.text() 
}
}
  const setDocumentLink = async (documento) => {
    const fetchDocument = await fetch(
      `${API_INPRONET}/download.php?filename=${documento.RUTA}`
    );

    const resfetchDocument = await fetchDocument.blob();
    const path = URL.createObjectURL(resfetchDocument);
    const link = document.createElement("a");
    link.setAttribute("href", path);
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
  };

  const ShowDocuments = ({ documentos, title }) => {
    if (documentos && documentos.length !== 0) {
      return (
        <div>
          <ul>
            <h3>{title && title}</h3>
            {documentos.map((documento) => {
              return (
                <li key={documento.ID}>
                  <span>{documento.TIPO_DOCUMENTO.NOMBRE}</span>
                  <span>
                    <a
                      target="_blank"
                      download={documento.NOMBRE}
                      title="Descargar"
                      /* className="link-document" */
                      style={{
                        padding: "0 20px",
                        color: "#00897b",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setDocumentLink(documento);
                      }}
                    >
                      {documento.NOMBRE}
                    </a>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      );
    } else if (documentos && documentos.length === 0) {
      return <p>No existen documentos</p>;
    } else {
      return <p>cargando...</p>;
    }
  };

//   useEffect(() => {
//     if(tipoDocumentos.length > 0) {
//         getDocumentos();
//     }
//   }, [tipoDocumentos]);

  useEffect(() => {
    getTiposDeDocumentos();
    getDocumentos();
    //if (title !== "Servicios Pendientes") getDocumentosEntidadesAsociadas();
  }, []);

  return (
    <Modal isOpen={toggle} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>
        Documentos asociados a la retirada
      </ModalHeader>
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
                                                          <> <span
                                                          onClick={() => saveDocumentA(fileName)}
                                                      >
                                                          <Button color="primary">Adjuntar</Button>
                                                      </span>
                                            <span
                                                className="delete-document"
                                                onClick={() => quitarDocumentoA(fileName)}
                                            >
                                                <Button color="danger">Eliminar</Button>
                                            </span></>
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
                                        <li key={fileName.NOMBRE} style={{"width":"500px"}}>
                                          
                                            <span className="filename-list">{fileName.NOMBRE}</span>

                                            {fileName.IS_NEW && (
                                                <> <span
                                                onClick={() => saveDocumentB(fileName)}
                                            >
                                                <Button color="primary">Adjuntar</Button>
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
        <ShowDocuments documentos={documentosAsociadosRetirada} />
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={onClickCerrar}>
          Cerrar
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ShowDocumentosModal;
