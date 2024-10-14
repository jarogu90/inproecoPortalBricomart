import React, { useState, useEffect, useCallback } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormText,
} from "reactstrap";
import { client, deleteDocumentField } from '../../graphql';

//constants
import { API_INPRONET } from "../../constants";

const ShowDocumentsModal = ({ showDocumentsModal, toggle, retirada }) => {
  const [parteA, setParteA] = useState(false);
  const [parteB, setParteB] = useState(false);
  const [parteAruta, setParteAruta] = useState(retirada.parteA_ruta);
  const [parteBruta, setParteBruta] = useState(retirada.parteB_ruta);
  const [confirmDelete, setConfirmDelete] = useState(false); // Estado para manejar el popup de confirmación
  const [docToDelete, setDocToDelete] = useState(null); // Estado para almacenar el documento a borrar
console.log(retirada)
  const fetchDocument = async (url) => {
    let fetchDocument = await fetch(
      `${API_INPRONET}/downloadbrico.php?filename=${url}`
    );
    if(fetchDocument == null) {
      fetchDocument = await fetch(
      `${API_INPRONET}/download.php?filename=${url}`
    );
    }
    const resfetchDocument = await fetchDocument.blob();
    var reader = new FileReader();
    reader.onload = (e) => {
      if (!url.includes("parteB")) setParteA(e.target.result);
      else setParteB(e.target.result);
    };
    reader.readAsDataURL(resfetchDocument);
  };

  const ShowDocuments = () => {
    return (
      <>
        {parteAruta && showDocument(retirada.parteA_ruta, "parteA")}
        {parteBruta && showDocument(retirada.parteB_ruta, "parteB")}
      </>
    );
  };

  const showDocument = (path, type) => {
    if (!parteA) fetchDocument(path);
    if (!parteB) fetchDocument(path);
    const { user } = useContext(GlobalStateContext);

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
          {user.rolDesc == "BRICOMART_INPROECO" && <i
        className="oi oi-trash"
        style={{
          cursor: "pointer",
          verticalAlign: "middle",
          textAlign: "center",
          marginLeft: "5px",
        }}
        onClick={() => handleDeleteClick(type === "parteB" ? "parteB_ruta" : "parteA_ruta")}
      />}
          
        </span>
      </li>
    );
  };

  const handleDeleteClick = (type) => {
    console.log(type)
    setDocToDelete(type);
    setConfirmDelete(true);
  };

  const handleConfirmDelete = () => {
    deleteDoc(docToDelete);
    setConfirmDelete(false);
    setDocToDelete(null);
  };

  const deleteDoc = (type) => {
    const fieldToUpdate = {};
    fieldToUpdate[type] = null;
    client.mutate({
      mutation: deleteDocumentField,
      variables: {
        ventaId: retirada.id, // Asumiendo que `retirada` tiene un campo `id`
        field: fieldToUpdate
      }
    }).then(response => {
      console.log(`Documento ${type} borrado`);
      // Actualizar el estado local si es necesario
      if (type === "parteA_ruta") setParteAruta(false);
      if (type === "parteB_ruta") setParteBruta(false);
    }).catch(error => {
      console.error(`Error al borrar el documento ${type}:`, error);
    });
  };

  return (
    <>
      <Modal isOpen={showDocumentsModal} toggle={toggle}>
        <ModalHeader>Documentos</ModalHeader>
        <ModalBody>
          <ShowDocuments />
        </ModalBody>
        <ModalFooter>
          <Button onClick={toggle}>Cerrar</Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={confirmDelete} toggle={() => setConfirmDelete(false)}>
        <ModalHeader>Confirmar Borrado</ModalHeader>
        <ModalBody>
          ¿Está seguro que desea borrar este documento?
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={handleConfirmDelete}>Borrar</Button>
          <Button color="secondary" onClick={() => setConfirmDelete(false)}>Cancelar</Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default ShowDocumentsModal;