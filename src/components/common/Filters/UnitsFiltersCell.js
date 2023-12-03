import React, { useContext, useEffect } from "react";
import * as PropTypes from "prop-types";
import MultiSelect from "@khanacademy/react-multi-select";

// context
import {
  GlobalStateContext,
  GlobalDispatchContext,
} from "../../../context/GlobalContext";

const UnitsFilterCell = ({ onFilter, column, centros, estados }) => {
  const { clickedOptionCentro, clickedOptionEstado, user } =
    useContext(GlobalStateContext);
  const dispatch = useContext(GlobalDispatchContext);

  let elems = [];
  let data = [];

  //Dropdowns dinámicos
  useEffect(() => {}, [centros]);
  if (column.name === "centro") {
    elems = centros;
    data = elems.map((elem) => {
      return { label: elem, value: elem };
    });

    return (
      <th style={{ fontWeight: "normal" }}>
        <MultiSelect
          disabled={
            user.rolDesc !== "BRICOMART_CENTRO" &&
            user.rolDesc !== "BRICOMART_INPROECO_CENTRO"
              ? false
              : true
          }
          selectAllLabel="Todos"
          selectSomeItems="Seleccionar..."
          options={data}
          selected={clickedOptionCentro}
          overrideStrings={{
            selectSomeItems: "Seleccionar...",
            search: "Buscar",
            allItemsAreSelected: "Todos",
          }}
          onSelectedChanged={(selected) => {
            // Actualizamos el valor seleccionado
            dispatch({
              type: "SET_CLICKED_CENTRO",
              payload: { clickedOptionCentro: selected },
            });
            // Callback a filtrado
            onFilter(selected ? { value: selected } : null);
          }}
        />
      </th>
    );
  }
  if (column.name === "estado") {
    elems = estados;
    data = elems.map((elem) => {
      return { label: elem, value: elem };
    });

    return (
      <th style={{ fontWeight: "normal" }}>
        <MultiSelect
          selectAllLabel="Todos"
          selectSomeItems="Seleccionar..."
          options={data}
          selected={clickedOptionEstado}
          overrideStrings={{
            selectSomeItems: "Seleccionar...",
            search: "Buscar",
            allItemsAreSelected: "Todos",
          }}
          onSelectedChanged={(selected) => {
            // Actualizamos el valor seleccionado
            dispatch({
              type: "SET_CLICKED_ESTADO",
              payload: { clickedOptionEstado: selected },
            });
            // Callback a filtrado
            onFilter(selected ? { value: selected } : null);
          }}
        />
      </th>
    );
  }
};
UnitsFilterCell.propTypes = {
  filter: PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  }),
  onFilter: PropTypes.func.isRequired,
  column: PropTypes.shape({ name: PropTypes.string }).isRequired,
};

UnitsFilterCell.defaultProps = {
  filter: null,
};

export default UnitsFilterCell;
