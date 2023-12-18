import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Col,
  Row,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import Dropzone from "react-dropzone";
import moment from "moment";

//graphql
import {
  client,
  getProvincias,
  getMunicipiosByProvincia,
  getCentros,
  getZonaByCentro,
  getZonaName,
  getDocumentPath,
  updateParteB,
  updateDocumentsPath,
  updateVentaById,
  updateEstadoVenta,
} from "../../../components/graphql";

// constants
import { API_INPRONET } from "../../../components/constants";

//context
import { GlobalStateContext } from "../../../context/GlobalContext";

// components
import VentaErrorDocumentoModal from "../../../components/common/Modals/VentaErrorDocumentoModal";

const EditVentaModal = ({ editVentaModal, toggle, row, fetchVentas }) => {
  const { loadVentas } = useContext(GlobalStateContext);
  const [provincias, setProvincias] = useState();
  const [localidades, setLocalidades] = useState();
  const [centros, setCentros] = useState();
  const [datosForm, setDatosForm] = useState(row);
  const [nifInvalido, setNifInvalido] = useState();
  const [rowForm, setRowForm] = useState({ INSTALACION_PROPIA: row.INSTALACION_PROPIA, ESTADO_ID: row.ESTADO_ID });
  const [dateToShow, setdateToShow] = useState(
    row.fecha_venta ? row.fecha_venta.split("/").reverse().join("-") : null
  );

  // MODALES
  const [ventaErrorDocument, setVentaErrorDocument] = useState(false);

  const toggleVentaErrorDocument = () => {
    setVentaErrorDocument(!ventaErrorDocument);
  };

  // ESTADOS PARA DOCUMENTOS - B para el Parte B
  const [fileNames, setFileNames] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [fileNamesB, setFileNamesB] = useState([]);
  const [newFilesB, setNewFilesB] = useState([]);
  const [uploadFilesB, setUploadFilesB] = useState([]);

  const onDropB = useCallback((acceptedFiles) => {
    setNewFilesB(newFilesB.concat(acceptedFiles));
    let newFileNames = [];
    acceptedFiles.forEach((file) => {
      newFileNames.push({
        NOMBRE: file.name,
        RUTA: "",
        TIPO_DOCUMENTO_ID: "",
        IS_NEW: true,
      });
    });
    const files = fileNamesB.concat(newFileNames);
    setFileNamesB(files);
    setUploadFilesB(acceptedFiles);
  });

  const saveDocuments = async (files = [], fileNames = [], tipoName) => {
    if (files.length > 0 && fileNames.length > 0) {
      let fileDataFiltered = [];
      const filterred = fileNames.filter((file) => {
        return files[0].name === file.NOMBRE;
      });
      if (filterred.length > 0) fileDataFiltered = filterred;

      const docData = new FormData();
      docData.append("accion", "subirDocumentoBricomart");
      docData.append("tipoName", tipoName);
      docData.append("documento", files[0]);

      const requestOptions = {
        method: "POST",
        body: docData,
      };

      const postDocument = await fetch(
        `${API_INPRONET}/core/controller/BricomartController.php`,
        requestOptions
      );
      const resPostDocument = await postDocument.text();
      return resPostDocument;
    }
  };

  const quitarDocumentoB = (name) => {
    setNewFilesB(newFilesB.filter((item) => item.name !== name.NOMBRE));
    setFileNamesB(fileNamesB.filter((item) => item !== name));
  };

  // COGER VALORES INPUTS

  const onChangeNif = (e) => {
        setDatosForm({ ...datosForm, nif: e.target.value });
        let cif = e.target.value 

        if (cif.length == 9 || cif == '') {
            setNifInvalido(false)
            setDatosForm({...datosForm, nif: e.target.value})
            return true;
            
        } else {
            setNifInvalido(true)
        }
    }

  const onChangeFullName = (e) => {
    setDatosForm({ ...datosForm, nombre: e.target.value });
  };

  const onChangeApellido1 = (e) => {
    setDatosForm({ ...datosForm, apellido1: e.target.value });
  };

  const onChangeApellido2 = (e) => {
    setDatosForm({ ...datosForm, apellido2: e.target.value });
  };

  const onChangeRazonSocial = (e) => {
    setDatosForm({ ...datosForm, razon_social: e.target.value });
  };

  const onChangeTipoVia = (e) => {
    setDatosForm({ ...datosForm, tipo_via: e.target.value });
  };

  const onChangeNombreVia = (e) => {
    setDatosForm({ ...datosForm, nombre_via: e.target.value });
  };

  const onChangeNumero = (e) => {
    setDatosForm({ ...datosForm, numero: e.target.value });
  };

  const onChangePiso = (e) => {
    setDatosForm({ ...datosForm, piso: e.target.value });
  };

  const onChangePuerta = (e) => {
    setDatosForm({ ...datosForm, puerta: e.target.value });
  };

  const onChangeCodigoPostal = (e) => {
    setDatosForm({ ...datosForm, codigo_postal: e.target.value });
  };

  const onChangeNumeroSerie = (e) => {
    setDatosForm({ ...datosForm, numero_serie: e.target.value });
  };

  const onChangeCantidad = (e) => {
    setDatosForm({ ...datosForm, cantidad: e.target.value });
  };

  const onChangeFechaVenta = (e) => {
    setdateToShow(e.target.value);
    const dateFormatted = moment(e.target.value).format("DD/MM/YYYY");
    setDatosForm({ ...datosForm, fecha_venta: dateFormatted });
  };

  const onChangeMarca = (e) => {
    setDatosForm({ ...datosForm, marca: e.target.value });
  };

  const onChangeModelo = (e) => {
    setDatosForm({ ...datosForm, modelo: e.target.value });
  };

  const onChangeReferencia = (e) => {
    setDatosForm({ ...datosForm, referencia: e.target.value });
  };

  const onChangeTipoGas = (e) => {
    setDatosForm({ ...datosForm, tipo_gas: e.target.value });
  };

  const fetchProvincias = useCallback(() => {
    client
      .query({
        query: getProvincias,
      })
      .then((res) => {
        setProvincias(res.data.getProvincia);
      });
  }, [client, getProvincias]);

  const onChangeProvincia = (e) => {
    setDatosForm({
      ...datosForm,
      provincia: e.target.options[e.target.selectedIndex].text,
    });
    if (e.target.value) {
      fetchLocalidades(e.target.value);
    }
  };

  const fetchLocalidades = useCallback(
    (e) => {
      client
        .query({
          query: getMunicipiosByProvincia,
          variables: {
            provinciaId: e,
          },
        })
        .then((res) => {
          setLocalidades(res.data.getMunicipio);
        });
    },
    [client, getMunicipiosByProvincia]
  );

  const onChangeMunicipio = (e) => {
    setDatosForm({
      ...datosForm,
      localidad: e.target.options[e.target.selectedIndex].text,
    });
  };

  const fetchCentros = () => {
    client
      .query({
        query: getCentros,
      })
      .then((res) => {
        setCentros(res.data.getCentroProductor);
      });
  };

  const onChangeCentro = (e) => {
    setDatosForm({
      ...datosForm,
      centro_id: e.target.value,
      centro: e.target.options[e.target.selectedIndex].text,
    });
  };

  // FORMATEAR DATOS PARA ENVIAR
  const setMutationString = () => {
    let newObject = datosForm;
    delete newObject.estado_venta;
    delete newObject.estado;
    setDatosForm(newObject);
    return JSON.stringify(datosForm);
  };

  const existsParteB = () => {
    return fileNamesB.length > 0;
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    // Enviar datos del formulario
    const formData = new FormData();
    formData.append("accion", "editarLeroyInstalaciones");
    formData.append("instalacionpropia", e.target.elements.instalacion_propia.checked ? 1 : 0);
    formData.append("devuelto", e.target.elements.devuelto.checked ? 1 : 0);
    formData.append("instalacionId", row.ID);


    const requestOptions = {
      method: "POST",
      body: formData,
    };

    const postVenta = await fetch(
      `${API_INPRONET}/core/controller/LeroyInstalacionesController.php`,
      requestOptions
    );

    fetchVentas();
      toggle();
    
  };

  const documentPath = async (id) => {
    return client
      .query({
        query: getDocumentPath,
        variables: {
          documentId: id,
        },
      })
      .then((res) => {
        console.log(res);
        return res.data.getDocumento[0].RUTA;
      });
  };

  const updateRutaVentaDocumento = async (ventaId, parteB) => {
    return client
      .mutate({
        mutation: updateParteB,
        variables: {
          ventaId: ventaId,
          parteBPath: parteB,
        },
      })
      .then((res) => {
        return res.data.update_ventas_bricomart.affected_rows;
      });
  };

  const updateEstado = (ventaId, estadoId) => {
    return client
      .mutate({
        mutation: updateEstadoVenta,
        variables: {
          ventaId: ventaId,
          estadoId: estadoId,
        },
      })
      .then((res) => {
        return res.data.update_ventas_bricomart.affected_rows;
      });
  };

  useEffect(() => {
    if (datosForm.fecha_venta)
      setDatosForm({
        ...datosForm,
        fecha_venta: row.fecha_venta
          ? row.fecha_venta.split("-").reverse().join("/")
          : null,
      });
    fetchProvincias();
    fetchCentros();
    console.log(row)
  }, []);

  return (
    <Modal isOpen={editVentaModal} toggle={toggle} size="xl">
      <ModalHeader>Editar Registro de Venta</ModalHeader>
      <ModalBody>
        <Form onSubmit={onSubmitForm}>
          <Row form>
          <Col md={5}>
  <FormGroup>
    <Label md={6}>INSTALACION PROPIA</Label>
    <Input
      id="instalacion_propia"
      type="checkbox"
      checked={rowForm.INSTALACION_PROPIA === 1}
      onChange={() => {
        setRowForm({
          ...row,
          INSTALACION_PROPIA: rowForm.INSTALACION_PROPIA === 1 ? 0 : 1,
        });
      }}
    />
  </FormGroup>
</Col>
<Col md={5}>
  <FormGroup>
    <Label md={4}>Devuelto</Label>
    <Input
      id="devuelto"
      type="checkbox"
      checked={rowForm.ESTADO_ID == 5}
      onChange={() => {
        setRowForm({
          ...row,
          ESTADO_ID: rowForm.ESTADO_ID == 5 ? 0 : 1,
        });
      }}
    />
  </FormGroup>
</Col>
            </Row>
          <Row form>
            <Col md={2}>
              {nifInvalido ? (
                <Button type="submit" disabled>
                  Guardar
                </Button>
              ) : (
                <Button color="primary" type="submit">
                  Guardar
                </Button>
              )}
            </Col>
          </Row>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button onClick={toggle} color="primary">
          Cerrar
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditVentaModal;
