import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  Row,
  FormText,
  FormGroup,
  Label,
  Input,
} from "reactstrap";

// GRAPHQL
import { client, getGestoresByUser } from "../../../components/graphql";

// context
import {
  GlobalStateContext,
  GlobalDispatchContext,
} from "../../../context/GlobalContext";

// Constants
import { API_INPRONET } from "./../../constants";

// components
import GestorInput from "../Inputs/GestorInput";
import ClienteInput from "../Inputs/ClienteInput";
import CentroInput from "../Inputs/CentroInput";
import NumFacturaInput from "../Inputs/NumFacturaInput";
import ConceptoFactura from "../Inputs/ConceptoFactura";
import FechaInput from "../Inputs/FechaInput";
import MesAndYearInput from "../Inputs/MesAndYearInput";
import BaseImponibleTotalInput from "../Inputs/BaseImponibleTotalInput";
import TotalConIvaInput from "../Inputs/TotalConIvaInput";
import IvaCeroInput from "../Inputs/IvaCeroInput";
import IvaDiezInput from "../Inputs/IvaDiezInput";
import IvaVeintiunoInput from "../Inputs/IvaVeintiunoInput";
import IgicInput from "../Inputs/IgicInput";
import IpsiInput from "../Inputs/IpsiInput";
import DocumentosInput from "../Inputs/DocumentosInput";
import FacturaExistsModal from "../Modals/FacturaExistsModal";

const Addfactura = ({
  addFacturaModal,
  toggle,
  setShowServiciosAsociarFactura,
  setFacturaId,
  setDocumentoId,
  setFechaEmisionFactura,
  setTotalBaseImponible,
}) => {
  const { user } = useContext(GlobalStateContext);
  /* const [facturaId, setFacturaId] = useState();
  const [documentoId, setDocumentoId] = useState(); */

  const dispatch = useContext(GlobalDispatchContext);
  // ESTADOS PARA ENVIAR EN EL SUBMIT
  const [gestorSelected, setGestorSelected] = useState("");
  const [centroSelected, setCentroSelected] = useState("");
  const [numFacturaSelected, setNumFacturaSelected] = useState("");
  const [conceptoFacturaSelected, setConceptoFacturaSelected] = useState("");
  const [fechaSelected, setFechaSelected] = useState("");
  const [mesSelected, setMesSelected] = useState("");
  const [yearSelected, setYearSelected] = useState("");
  const [baseImponibleTotalSelected, setBaseImponibleTotalSelected] =
    useState("");
  const [totalFacturaIva, setTotalFacturaIva] = useState("");
  const [ivaCero, setIvaCero] = useState("");
  const [ivaDiez, setIvaDiez] = useState("");
  const [ivaVeintiuno, setIvaVeintiuno] = useState("");
  const [igic, setIgic] = useState("");
  const [ipsi, setIpsi] = useState("");
  const [invalidForm, setInvalidForm] = useState(false);

  // ESTADOS PARA DOCUMENTOS
  const [fileNames, setFileNames] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [tipoDocumentos, setTipoDocumentos] = useState();

  // ESTADOS PARA RESPUESTAS
  const [invalidFactura, setInvalidFactura] = useState(false);

  // Tiene que haber al menos uno de los siguientes inputs rellenos
  const isValidForm = () => {
    return (
      fileNames.length !== 0 &&
      (ivaCero !== "" ||
        ivaDiez !== "" ||
        ivaVeintiuno !== "" ||
        igic !== "" ||
        ipsi !== "")
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidForm()) {
      setInvalidForm(true);
      return;
    }
    setInvalidForm(false);

    const data = new FormData();
    console.log(baseImponibleTotalSelected, totalFacturaIva);
    data.append("accion", "guardarFacturaGestor");
    data.append("entidad", "gestor");
    data.append("entidadId", gestorSelected);
    data.append("selectCentroId", centroSelected);
    data.append("numfactura", numFacturaSelected);
    data.append("concepto", conceptoFacturaSelected);
    data.append("baseimponible", baseImponibleTotalSelected);
    data.append("totalfactura", totalFacturaIva);
    data.append("importe0", ivaCero);
    data.append("importe10", ivaDiez);
    data.append("importe21", ivaVeintiuno);
    data.append("igic", igic);
    data.append("ipsi", ipsi);
    data.append("fecha", fechaSelected);
    data.append("mes", mesSelected);
    data.append("anyo", yearSelected);
    data.append("fileToUpload", newFiles[0]);

    const requestOptions = {
      method: "POST",
      body: data,
    };

    const saveFactura = await fetch(
      `${API_INPRONET}/core/controller/FacturaController.php`,
      requestOptions
    );
    const resSaveFactura = await saveFactura.text();
    console.log(resSaveFactura);
    const parsedResponse = JSON.parse(resSaveFactura.trim());
    console.log(parsedResponse);

    if (parsedResponse.error) {
      toggleInvalidFactura();
      return;
    }

    saveDocumentoAsociado(parsedResponse.facturaId, newFiles, fileNames);
    setFacturaId(parsedResponse.facturaId);
    dispatch({
      type: "SET_FACTURA_CARGADA_ID",
      payload: { facturaCargada: parsedResponse.facturaId },
    });
    setShowServiciosAsociarFactura(true);
    toggle();
  };

  const saveDocumentoAsociado = async (
    facturaId,
    files = [],
    fileNames = []
  ) => {
    //console.log(retiradaId, files, fileNames)
    if (files.length > 0 && fileNames.length > 0) {
      //console.log(files, fileNames)
      files.forEach(async (doc) => {
        let fileDataFiltered = [];
        const filterred = fileNames.filter((file) => {
          return doc.name === file.NOMBRE;
        });
        if (filterred.length > 0) fileDataFiltered = filterred;
        const docData = new FormData();
        docData.append("accion", "adjuntarDocumentoFactura");
        docData.append("facturaId", facturaId);
        docData.append("tipoId", fileDataFiltered[0].TIPO_DOCUMENTO_ID);
        docData.append("documento", doc);

        const requestOptions = {
          method: "POST",
          body: docData,
        };

        const saveDocumentosFactura = await fetch(
          `${API_INPRONET}/core/controller/FacturaController.php`,
          requestOptions
        );
        const resSaveDocumentosFactura = await saveDocumentosFactura.text();

        if (resSaveDocumentosFactura.trim() !== "null")
          setDocumentoId(resSaveDocumentosFactura.trim());
      });
    }
  };

  const toggleInvalidFactura = () => {
    setInvalidFactura(!invalidFactura);
  };

  return (
    <Modal isOpen={addFacturaModal} toggle={toggle}>
      <ModalHeader toggle={toggle}>Añadir factura</ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <Row>
            <GestorInput setGestorSelected={setGestorSelected} />
            {/* Carga cliente y centro en el mismo input */}
            <CentroInput setCentroSelected={setCentroSelected} />
          </Row>
          <Row>
            <NumFacturaInput setNumFacturaSelected={setNumFacturaSelected} />
            <ConceptoFactura
              setConceptoFacturaSelected={setConceptoFacturaSelected}
            />
          </Row>
          <Row>
            <FechaInput
              setFechaSelected={setFechaSelected}
              setFechaEmisionFactura={setFechaEmisionFactura}
            />
            <MesAndYearInput
              setMesSelected={setMesSelected}
              setYearSelected={setYearSelected}
            />
          </Row>
          <Row>
            <BaseImponibleTotalInput
              setBaseImponibleTotalSelected={setBaseImponibleTotalSelected}
            />
            <TotalConIvaInput setTotalFacturaIva={setTotalFacturaIva} />
            <IvaCeroInput
              setIvaCero={setIvaCero}
              setInvalidForm={setInvalidForm}
            />
          </Row>
          <Row>
            <IvaDiezInput setIvaDiez={setIvaDiez} />
            <IvaVeintiunoInput setIvaVeintiuno={setIvaVeintiuno} />
            <IgicInput setIgic={setIgic} />
            <IpsiInput setIpsi={setIpsi} />
          </Row>
          <Row>
            <DocumentosInput
              fileNames={fileNames}
              setFileNames={setFileNames}
              newFiles={newFiles}
              setNewFiles={setNewFiles}
              tipoDocumentos={tipoDocumentos}
              setTipoDocumentos={setTipoDocumentos}
            />
          </Row>
          <ModalFooter>
            <Button onClick={toggle}>Cancelar</Button>
            <Button color="primary" type="submit">
              Cargar
            </Button>
            {invalidForm ? (
              <FormText color="danger">
                hay que rellenar al menos uno de los campos relaciones con los
                impuestos y un documento.
              </FormText>
            ) : (
              <></>
            )}
          </ModalFooter>
        </Form>
      </ModalBody>
      <FacturaExistsModal
        invalidFactura={invalidFactura}
        toggle={toggleInvalidFactura}
      />
    </Modal>
  );
};

export default Addfactura;
