import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

const VentaSuccessModal = ({ ventaSuccess, toggle, redirectToVentas, linkA, linkB }) => {
  return (
    <Modal isOpen={ventaSuccess} toggle={toggle}>
      <ModalHeader toggle={toggle}>Venta</ModalHeader>
      <ModalBody>La venta se ha generado con éxito.
      {linkA && <p><a href={`https://inpronet.es/inproecoweb2_0/download.php?filename=${linkA}`} target="_blank" rel="noopener noreferrer">Descargar parte A</a></p>}
      {linkB && <p><a href={`https://inpronet.es/inproecoweb2_0/download.php?filename=${linkB}`} target="_blank" rel="noopener noreferrer">Descargar parte B</a></p>}

      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={redirectToVentas}>
          Volver a ventas
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default VentaSuccessModal;
