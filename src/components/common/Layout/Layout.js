import React, { useState } from "react";
import { Row, Col } from "reactstrap";
import { IntegratedSorting, SortingState } from "@devexpress/dx-react-grid";
import {
  Grid,
  TableHeaderRow,
  VirtualTable,
  TableColumnVisibility,
  TableFilterRow,
  Toolbar,
} from "@devexpress/dx-react-grid-bootstrap4";
import {
  Template,
  TemplatePlaceholder,
  TemplateConnector,
} from "@devexpress/dx-react-core";
import "@devexpress/dx-react-grid-bootstrap4/dist/dx-react-grid-bootstrap4.css";

// COMPONENTS
import ExportExcel from "./../Export/ExportExcel";
import Buttons from "./../Buttons/Buttons";
import FilterCell from "../../common/Filters/FilterCell";

// CONSTANTS
import { compareDates } from "./../../constants";

const Layout = ({
  title,
  estadosInstructions,
  rowsStore,
  rows,
  setRows,
  columns,
  hiddenColumnsNames,
  children,
  dataFilters,
  setShowServiciosAsociarFactura,
  setFacturaId,
  setDocumentoId,
  setFechaEmisionFactura,
  setTotalBaseImponible,
}) => {
  const getRowId = (row) => row.ID;
  const filterRowMessages = {
    filterPlaceholder: "Filtrar...",
  };
  const [filterRows, setFilterRows] = useState(null);

  // SORTING DE FECHAS
  const [integratedSortingColumnExtensions] = useState([
    { columnName: "FECHA_REALIZACION", compare: compareDates },
    { columnName: "FECHA_SOLICITUD", compare: compareDates },
  ]);

  const RowsCount = () => {
    return (
      <div class="results">
        Se han encontrado <p> {filterRows && filterRows.length} </p> resultados
      </div>
    );
  };

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
                <div class="col-md-12">
                  <div class="form-row">
                    <div class="pendientes__servicios">
                      <div class="col-md-12">
                        {estadosInstructions ? estadosInstructions : null}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="content-body">
                  <div className="row">
                    <div className="col-lg-12 card">
                      {!rows ? (
                        <p>Cargando...</p>
                      ) : (
                        <Grid rows={rows} columns={columns} getRowId={getRowId}>
                          <SortingState />
                          <IntegratedSorting
                            columnExtensions={integratedSortingColumnExtensions}
                          />
                          {children}
                          <VirtualTable />
                          <TableHeaderRow showSortingControls />
                          <Toolbar />
                          <TableColumnVisibility
                            hiddenColumnNames={hiddenColumnsNames}
                          />
                          <TableFilterRow
                            messages={filterRowMessages}
                            cellComponent={(props) => (
                              <FilterCell {...props} {...dataFilters} />
                            )}
                          />
                          <ExportExcel
                            rowsToExport={!filterRows ? rows : filterRows}
                            columns={columns}
                          />
                          {/* INICIO RECOGER LAS LÍNEAS FILTRADAS */}
                          <Template name="root">
                            <TemplateConnector>
                              {({ rows: filteredRows }) => {
                                setFilterRows(filteredRows);
                                return <TemplatePlaceholder />;
                              }}
                            </TemplateConnector>
                          </Template>
                          {/* FIN RECOGER LAS LÍNEAS FILTRADAS */}
                        </Grid>
                      )}
                    </div>
                  </div>
                </div>
                <RowsCount />
                <Row>
                  <Buttons
                    rows={rows}
                    setRows={setRows}
                    rowsStore={rowsStore}
                    tableTitle={title}
                    setShowServiciosAsociarFactura={
                      setShowServiciosAsociarFactura
                    }
                    setFacturaId={setFacturaId}
                    setDocumentoId={setDocumentoId}
                    setFechaEmisionFactura={setFechaEmisionFactura}
                    setTotalBaseImponible={setTotalBaseImponible}
                  />
                </Row>
              </section>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Layout;
