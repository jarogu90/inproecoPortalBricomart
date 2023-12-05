import React, { useState, useEffect } from "react";
import ShowDocumentosModal from "../Modals/ShowDocumentosModal";

const ShowDocuments = ({ row }) => {
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);

  const toggleShowDocumentsModal = () => {
    setShowDocumentsModal(!showDocumentsModal);
  };

  return (
    <>
      <i
        className="oi oi-document"
        style={{
          cursor: "pointer",
          verticalAlign: "middle",
          textAlign: "center",
        }}
        onClick={toggleShowDocumentsModal}
      />
      {showDocumentsModal ? (
        <ShowDocumentosModal
          showDocumentsModal={showDocumentsModal}
          toggle={toggleShowDocumentsModal}
          retirada={row}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default ShowDocuments;
