import React, { useReducer, createContext, useEffect } from "react";

export const GlobalStateContext = createContext();
export const GlobalDispatchContext = createContext();

const initialState = {
  value: null,
  rows: {},
  lastQuery: {},
  oldEstado: {},
  newEstado: {},
  changedId: {},
  token: null,
  user: null,
  isAllowed: false,
  loadVentas: null,
  filtersApplied: [],
  clickedOptionCentro: [],
  clickedOptionEstado: [],
  centros: [],
  estados: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_VALUE":
      return {
        ...state,
        value: action.payload.value,
      };
    case "SET_ROWS":
      return {
        ...state,
        rows: action.payload.rows,
      };
    case "SET_OLDESTADO":
      return { ...state, oldEstado: action.payload.oldEstado };
    case "SET_NEWESTADO":
      return { ...state, newEstado: action.payload.newEstado };
    case "SET_CHANGEID":
      return { ...state, changeId: action.payload.changeId };
    case "SET_LOGIN":
      sessionStorage.setItem("token", action.payload.token);
      sessionStorage.setItem("user", JSON.stringify(action.payload.user));
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
      };
    case "SET_ALLOWED":
      sessionStorage.setItem(
        "isAllowed",
        JSON.stringify(action.payload.isAllowed)
      );
      return { ...state, isAllowed: action.payload.isAllowed };
    case "SET_LOGOUT":
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("isAllowed");

      return { ...state, token: null, user: null, isAllowed: null };
    case "SET_LOAD_VENTAS":
      return { ...state, loadVentas: action.payload.loadVentas };
    case "SET_FILTERS_APPLIED":
      return { ...state, filtersApplied: action.payload.filtersApplied };
    case "SET_CLICKED_CENTRO":
      return {
        ...state,
        clickedOptionCentro: action.payload.clickedOptionCentro,
      };
    case "SET_CLICKED_ESTADO":
      return {
        ...state,
        clickedOptionEstado: action.payload.clickedOptionEstado,
      };
    case "SET_CENTROS":
      return {
        ...state,
        centros: action.payload.centros,
      };
    case "SET_ESTADOS":
      return {
        ...state,
        estados: action.payload.estados,
      };
    case "RESET": {
      return initialState;
    }
    default:
      console.error(`Invalid action type: ${action.type}`);
      throw new Error(`Invalid action type: ${action.type}`);
  }
};

const init = () => {
  if (typeof window !== `undefined`) {
    return {
      value: null,
      rows: {},
      lastQuery: {},
      oldEstado: {},
      newEstado: {},
      changedId: {},
      token: sessionStorage.getItem("token")
        ? sessionStorage.getItem("token")
        : null,
      user: sessionStorage.getItem("user")
        ? JSON.parse(sessionStorage.getItem("user"))
        : null,
      isAllowed: sessionStorage.getItem("isAllowed")
        ? JSON.parse(sessionStorage.getItem("isAllowed"))
        : false,
      filtersApplied: [],
      clickedOptionCentro: [],
      clickedOptionEstado: [],
      centros: [],
      estados: [],
    };
  } else {
    return initialState;
  }
};

const GlobalContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState, init);

  return (
    <>
      <GlobalStateContext.Provider value={state}>
        <GlobalDispatchContext.Provider value={dispatch}>
          {children}
        </GlobalDispatchContext.Provider>
      </GlobalStateContext.Provider>
    </>
  );
};

export default GlobalContextProvider;
