import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
} from "react";
import { Row, Col } from "reactstrap";
import {
  IntegratedSorting,
  SortingState,
  SearchState,
  FilteringState,
  IntegratedFiltering,
  RowDetailState,
  PagingState,
  IntegratedPaging,
} from "@devexpress/dx-react-grid";
import { SearchPanel } from "@devexpress/dx-react-grid-bootstrap4";
import {
  Grid,
  TableHeaderRow,
  VirtualTable,
  TableColumnVisibility,
  TableFilterRow,
  Toolbar,
  ExportPanel,
  TableRowDetail,
  PagingPanel,
} from "@devexpress/dx-react-grid-bootstrap4";
import {
  Template,
  TemplatePlaceholder,
  TemplateConnector,
} from "@devexpress/dx-react-core";
import "@devexpress/dx-react-grid-bootstrap4/dist/dx-react-grid-bootstrap4.css";
import { GridExporter } from "@devexpress/dx-react-grid-export";
import saveAs from "file-saver";
import MultiSelect from "@khanacademy/react-multi-select";

// COMPONENTS
import ExportExcel from "./../Export/ExportExcel";
import Buttons from "./../Buttons/Buttons";
import FilterCell from "../../common/Filters/FilterCell";
import RowVentaActions from "../Icons/RowVentaActions";

// CONSTANTS
import { compareDates } from "./../../constants";

// CONTEXT
import { GlobalDispatchContext } from "../../../context/GlobalContext";

// GRAPHQL
import {
  client,
  getVentasAllCentros,
  getVentasByCentroFilter,
  getCentros,
  getVentasByCentro,
  getVentasByCentroNombre
} from "../../graphql";

const Layout = ({
  title,
  rows,
  setRows,
  columns,
  columnsToExport,
  children,
  fetchVentas,
  setEstadoName,
  user,
  lastQuery,
  setLastQuery,
}) => {
  const dispatch = useContext(GlobalDispatchContext);
  const getRowId = (row) => row.ID;
  const filterRowMessages = {
    filterPlaceholder: "Filtrar...",
  };
  const [filterRows, setFilterRows] = useState([]);

  
  
  const [count, setCount] = useState(null);
  const [pageSizes] = React.useState([5, 10, 15]);
  const [filtersApplied, setFiltersApplied] = useState([])

  // SORTING DE FECHAS
  const [integratedSortingColumnExtensions] = useState([
    { columnName: "fecha_venta", compare: compareDates },
  ]);

  const [tableColumnExtensions] = useState([
    { columnName: "numero_serie", width: '210px' },
  ]);

  // FILTRO COLUMNA
  const columnFilterMultiPredicate = (value, filter, row) => {
    if (!filter.value.length) return true;
    for (let i = 0; i < filter.value.length; i++) {
      if (value === filter.value[i]) return true;
    }


    return IntegratedFiltering.defaultPredicate(value, filter, row);
  };

  const [filteringColumnExtensions, setFilteringColumnExtensions] = useState([
    { columnName: "centro", predicate: columnFilterMultiPredicate },
    { columnName: "estado", predicate: columnFilterMultiPredicate },
  ]);

  // EXPORT EXCEL
  const onSave = (workbook) => {
    workbook.xlsx.writeBuffer().then((buffer) => {
      saveAs(
        new Blob([buffer], { type: "application/octet-stream" }),
        "Servicios.xlsx"
      );
    });
  };
  const [rowsExport, setRowsExport] = useState(null);
  const exporterRef = useRef(null);

  const startExport = useCallback(() => {
    exporterRef.current.exportGrid();
  }, [exporterRef]);

  const exportMessages = {
    exportAll: "Exportar todo",
  };

  // FILTRO BÚSQUEDA
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  //const [lastQuery, setLastQuery] = useState();

  const getQueryString = () => {
    let filter;
    if (
      user.rolDesc !== "LEROY_INSTALACIONES_CENTRO" &&
      user.rolDesc !== "INPROECO"
    ) {
      filter = columns
        .reduce((acc, { name }) => {
    
          if(searchValue === ""){
            return acc;
          }
          if (name === "id") {
        
            /* acc.push(`{"${name}": {"_eq": "${searchValue}"}}`); */
          } else acc.push(`"${name}": "(${searchValue})"`);
          return acc;
        }, [])
        .join(",");

      if (columns.length > 1) {
        filter = `${filter}`;
      }
      return `{${filter}}`;
    }

    filter = columns
      .reduce((acc, { name }) => {
        if (name === "id") {
          /* console.log("id"); */
          /* acc.push(`{"${name}": {"_eq": "${searchValue}"}}`); */
        }  else acc.push(`"${name}": "(${searchValue})"`);
        return acc;
      }, [])
      .join(",");

    if (columns.length > 1) {
      filter = `${filter}`;
    }
    return `{${filter}}`;
    };

  const loadData = (excelExport = false) => {
    const queryString = getQueryString();

    let limit = excelExport ? 10000 : 500;
    if (
      (queryString && excelExport) ||
      (queryString !== lastQuery && !loading)
    ) {
      client
        .query({
          query:
            user.rolDesc !== "LEROY_INSTALACIONES_CENTRO" &&
              user.rolDesc !== "INPROECO"
              ? getVentasAllCentros
              : getVentasByCentroFilter,
          fetchPolicy: "no-cache",
          variables: {
            limit: limit,
            fields: JSON.parse(queryString),
          },
        })
        .then((res) => {
          const results = setEstadoName(res.data.ventas_bricomart);
          if (!excelExport) {
       
            
            setRows(results);
            setLastQuery(queryString);
          } else {
            setRowsExport(results, () => startExport(rowsExport));
            startExport();
          }
        });
      if (!excelExport) setLastQuery(queryString);
    }
  };

  const loadDataFilter = () => {
    let centros = []
    let results = []
     filtersApplied.forEach((elemt)=>{
      if (elemt.columnName === "CENTRO_PRODUCTOR_NOMBRE") {
        
        
       return centros = elemt.value
      }
    })
    if (centros.length == 1) {
      client
        .query({
          query:
          getVentasByCentroNombre,
          fetchPolicy: "no-cache",
          variables: {

            centro: centros.toString(),
          },
        })
        .then((res) => {
         setEstadoName(res.data.ventas_bricomart);
         setRows(res.data.ventas_bricomart)
         results = res.data.ventas_bricomart
         
         
        }).catch((error)=> console.log(error));
    }else if(centros.length > 1){
      for (let i = 0; i < centros.length; i++) {
        client
        .query({
          query:
          getVentasByCentroNombre,
          fetchPolicy: "no-cache",
          variables: {

            centro: centros[i].toString(),
          },
        })
        .then((res) => {
        let total = res.data.ventas_bricomart
        setEstadoName(total);
         total.forEach(element => {
           results.push(element)
         });
         
        }).catch((error)=> console.log(error));
        
      }
     
        setTimeout(() => {
          setRows(results)
          
        }, 500);
       
    }
 
      
    }
  

  const dataCountFilter = () => {
    const queryString = getQueryString();
    client
      .query({
        query:
          user.rolDesc !== "LEROY_INSTALACIONES_CENTRO" &&
            user.rolDesc !== "INPROECO"
            ? getVentasAllCentros
            : getVentasByCentro,
        fetchPolicy: "no-cache",
        variables: {

          fields: JSON.parse(queryString),
        },
      })
      .then((res) => {
        const results = res.data.getLeroyInstalacionesView.length;
        setCount(results)

      });

  }

  const dataCount = () => {
    client
      .query({
        query:
          user.rolDesc !== "LEROY_INSTALACIONES_CENTRO" &&
            user.rolDesc !== "INPROECO"
            ? getVentasAllCentros
            : getVentasByCentro,
        fetchPolicy: "no-cache",
        variables: {

          fields: lastQuery,
        },
      })
      .then((res) => {
        const results = res.data.getLeroyInstalacionesView.length;
        setCount(results)

      });

  }



  const [centros, setCentros] = useState([]);
  const [estados, setEstados] = useState([]);
  const fetchCentros = useCallback(async () => {
    let results = [];
    await client
      .query({
        query: getCentros,
        fetchPolicy: "no-cache",
      })
      .then((res) => {
   
        for (let centro of res.data.getCentroProductor) {
          results.push(centro.DENOMINACION);
        }
      });
    setCentros(results);
  }, [client, getCentros]);

  const fetchEstados = useCallback(async () => {
    let results = [];
    await client
      .query({
        query: getVentasAllCentros,
        fetchPolicy: "no-cache",
      })
      .then((res) => {
    
        for (let estado of res.data.ventas_bricomart) {
          if (estado.estado_venta != null) {
            results.push(estado.estado_venta.nombre);
          }
          results = [...new Set(results)];
        }
      });
    setEstados(results);
  }, [client, getVentasAllCentros]);

  useEffect(() => {
    //dataCount()
    //fetchCentros();
    //fetchEstados()
  }, []);

  useEffect(() => {
    dataCountFilter()
  }, [getQueryString])

  useEffect(() => {
    dispatch({ type: "SET_LOAD_VENTAS", payload: { loadVentas: loadData } });
    if (searchValue !== "") {
      loadData();
    } else {
      fetchVentas();
    }
  }, [searchValue]);

  useEffect(()=>{
    if (filtersApplied) {
      loadDataFilter()
    }
    
  }, [filtersApplied])

  return (
    <div>
      <div className="content">
        <Row>
          <Col xs={12} md={12}>
            <div className="page-title">
              <div className="float-left">
                <h2 className="title">{title}</h2>
              </div>
            </div>
            <div className="col-12">
              <section className="box">
                <div className="content-body">
                  <div className="row">
                    <div className="col-lg-12 card">
                      {!rows ? (
                        <p>Cargando...</p>
                      ) : (
                        <Grid rows={rows} columns={columns} getRowId={getRowId}>
                          <PagingState defaultCurrentPage={0} pageSize={10} />
                          <IntegratedPaging />
                          <SearchState onValueChange={setSearchValue} />
                          <SortingState />
                          <FilteringState filters={filtersApplied} onFiltersChange={(filter) => setFiltersApplied(filter)}/>
                                                {/* <EditingState
                                                    onCommitChanges={commitChanges}
                                                /> */}
                                                <RowDetailState
                                                   // expandedRowIds={expandedRows}
                                                />
                         
                          <SortingState/>
                          <IntegratedSorting
                            columnExtensions={integratedSortingColumnExtensions}
                          />
                          <IntegratedFiltering
                            columnExtensions={filteringColumnExtensions}
                          />
                          {children}
                          <VirtualTable columnExtensions={tableColumnExtensions} />
                          <TableHeaderRow showSortingControls />
                          <Toolbar />
                          {/* <TableColumnVisibility
                            hiddenColumnNames={hiddenColumnsNames}
                          />
                          */}
                         {/*  <TableFilterRow
                            messages={filterRowMessages}
                            cellComponent={(props) => (
                              <FilterCell {...props} centros={centros} estados={estados} />
                            )}
                          /> */}
                          <SearchPanel
                            messages={{ searchPlaceholder: "Buscar..." }}
                          />
                          <ExportPanel
                            messages={exportMessages}
                            startExport={() => loadData(true)}
                          />
                          <GridExporter
                            ref={exporterRef}
                            rows={rowsExport}
                            columns={columnsToExport}
                            onSave={onSave}
                          />
                          <TableRowDetail
                            toggleCellComponent={(props) => (
                              <RowVentaActions {...props} />
                            )}
                          />
                          {/* INICIO RECOGER LAS LÍNEAS FILTRADAS */}
                          <Template name="root">
                            <TemplateConnector>
                              {({ rows: filteredRows }) => {
                              
                                setFilterRows(filteredRows)
                               
                                return <TemplatePlaceholder />;
                              }}
                            </TemplateConnector>
                          </Template>
                          {/* FIN RECOGER LAS LÍNEAS FILTRADAS */}
                          <PagingPanel />
                        </Grid>
                      )}

                    </div>
                  </div>
                  <p>Mostrando {filterRows.length} de {count} resultados</p>
                </div>
              </section>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Layout;
