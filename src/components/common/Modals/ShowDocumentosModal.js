import React, { useState, useEffect, useCallback } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import {
  client,
  getRetiradaDocumentosId,
  getDocumentosById,
  GET_TIPO_DOCUMENTOS
} from "./../../graphql";
import { API_INPRONET } from "./../../constants";
import ShowDocumentsModal from "./ShowDocumentsModal";

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
    console.log("tipoDocumentos", tipoDocumentos)
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
    console.log(arrayDocumentos);
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
