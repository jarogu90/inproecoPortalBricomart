import React, { useContext } from "react";
import ShowDocuments from "./ShowDocuments";
import ShowDeleteVenta from "./ShowDeleteVenta";
import ShowEditVenta from "./ShowEditVenta";

//context
import { GlobalStateContext } from "../../../context/GlobalContext";

const RowVentaActions = (props) => {
  const { user } = useContext(GlobalStateContext);
  return (
    <>
      <td
        style={{
          cursor: "pointer",
          verticalAlign: "middle",
          textAlign: "center",
          ...props.style,
        }}
        {...props.restProps}
      >
        <ShowDocuments {...props} />
        {(user.rolDesc === "LEROY_INSTALACIONES_CORPORATIVO" ||
          user.rolDesc === "LEROY_INSTALACIONES_CENTRO") && (
          <>
            <ShowEditVenta {...props} />
            <ShowDeleteVenta {...props} />
          </>
        )}
      </td>
    </>
  );
};

export default RowVentaActions;
