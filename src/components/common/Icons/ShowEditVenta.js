import React, { useState, useEffect } from "react";
import EditVentaModal from "../Modals/EditVentaModal";

const ShowEditVenta = ({ row, fetchVentas }) => {
  const [editVentaModal, setEditVentaModal] = useState(false);
 const toggleEditVentaModal = () => {
     /* console.log(row.id); */
    setEditVentaModal(!editVentaModal);
  };

  return (
    <>
      <i
        className="oi oi-pencil"
        style={{
          cursor: "pointer",
          verticalAlign: "middle",
          textAlign: "center",
          marginLeft: "5px"
        }}
         onClick={toggleEditVentaModal}
      />
     {editVentaModal ? (
        <EditVentaModal
        fetchVentas={fetchVentas}
          editVentaModal={editVentaModal}
          toggle={toggleEditVentaModal}
          row={row}
        />
      ) : (
        <></>
      )} 
    </>
  );
};

export default ShowEditVenta;
