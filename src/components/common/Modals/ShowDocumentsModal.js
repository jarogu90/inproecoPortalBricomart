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

  const fetchDocument = async (url) => {
    const fetchDocument = await fetch(
      `${API_INPRONET}/downloadbrico.php?filename=${url}`
    );
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
        </span>
      </li>
    );
  };

  return (
    <Modal isOpen={showDocumentsModal} toggle={toggle}>
      <ModalHeader>Documentos</ModalHeader>
      <ModalBody>
        <ShowDocuments />
      </ModalBody>
      <ModalFooter>
        <Button onClick={toggle}>Cerrar</Button>
      </ModalFooter>
    </Modal>
  );
};

export default ShowDocumentsModal;
