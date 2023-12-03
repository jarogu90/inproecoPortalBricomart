import React, { useContext } from "react";
import { Button } from "reactstrap";

//context
import { GlobalDispatchContext } from "../../../context/GlobalContext";

const ClearFilters = () => {
  const dispatch = useContext(GlobalDispatchContext);

  const onClickClearFilters = () => {
    dispatch({
      type: "SET_CLICKED_CENTRO",
      payload: { clickedOptionCentro: [] },
    });
    dispatch({
      type: "SET_CLICKED_ESTADO",
      payload: { clickedOptionEstado: [] },
    });
    dispatch({
      type: "SET_FILTERS_APPLIED",
      payload: { filtersApplied: [] },
    });
  };

  return (
    <Button className="clearFilters" color="primary" onClick={onClickClearFilters}>
      Limpiar filtros
    </Button>
  );
};

export default ClearFilters;
