import React, { useState, useEffect, useCallback } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormText,
} from "reactstrap";

//constants
import { API_INPRONET } from "../../constants";

const ShowDocumentsModal = ({ showDocumentsModal, toggle, retirada }) => {
  const [parteA, setParteA] = useState(false);
  const [parteB, setParteB] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false); // Estado para manejar el popup de confirmación
  const [docToDelete, setDocToDelete] = useState(null); // Estado para almacenar el documento a borrar
console.log(retirada)
  const fetchDocument = async (url) => {
    let fetchDocument = await fetch(
      `${API_INPRONET}/downloadbrico.php?filename=${url}`
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
          <i
        className="oi oi-trash"
        style={{
          cursor: "pointer",
          verticalAlign: "middle",
          textAlign: "center",
          marginLeft: "5px",
        }}
        onClick={() => handleDeleteClick(path)}
      />
          
        </span>
      </li>
    );
  };

  const handleDeleteClick = (path) => {
    setDocToDelete(path);
    setConfirmDelete(true);
  };

  const handleConfirmDelete = () => {
    deleteDoc(docToDelete);
    setConfirmDelete(false);
    setDocToDelete(null);
  };

  const deleteDoc = (path) => {
    // Lógica para borrar el documento
    console.log(`Documento a borrar: ${path}`);
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