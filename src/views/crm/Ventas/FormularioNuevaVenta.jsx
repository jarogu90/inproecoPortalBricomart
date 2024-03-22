import React, { useState, useEffect, useCallback, useContext } from 'react'
import { Col, Row, Form, FormGroup, Label, Input,  Button } from "reactstrap";
import Dropzone from "react-dropzone";
import moment from "moment";

// context
import { GlobalStateContext } from "../../../context/GlobalContext";

//graphql
import { client,getMarcas, getLastId, getProvincias, getMunicipiosByProvincia, getCentros, insertVentaBricomart, getCentroName, getZonaByCentro, getZonaName, getDocumentPath, updateDocumentsPath } from '../../../components/graphql';

// constants
import { API_INPRONET } from '../../../components/constants';

// components
import VentaSuccessModal from '../../../components/common/Modals/VentaSuccessModal';
import VentaErrorDocumentoModal from '../../../components/common/Modals/VentaErrorDocumentoModal';
import { set } from 'lodash';

// Variable Global para FIX de añadir el ID al clicar en submit
let newId;

const FormularioNuevaVenta = ({history}) => {

    const { user } = useContext(GlobalStateContext);  
    const { centroId } = user;

    const [provincias, setProvincias] = useState();
    const [localidades, setLocalidades] = useState();
    const [centros, setCentros] = useState();
    const [datosForm, setDatosForm] = useState({});
    const [nifInvalido, setNifInvalido] = useState();
    const [almacen, setAlmacen] = useState(false);
    const [fecha, setFecha] = useState(false);

    const [marcas, setMarcas] = useState([]);
    const [modelos, setModelos] = useState([]);
    const [allModelos, setAllModelos] = useState([]);
    // MODALES
    const [ventaSuccess, setVentaSuccess] = useState(false);
    const [ventaErrorDocument, setVentaErrorDocument] = useState(false)
    const [linkA, setLinkA] = useState()
    const [linkB, setLinkB] = useState()
    const toggleVentaSuccess = () => {
        setVentaSuccess(!ventaSuccess)
    }

    const toggleVentaErrorDocument = () => {
        setVentaErrorDocument(!ventaErrorDocument)
    }

     // ESTADOS PARA DOCUMENTOS - B para el Parte B
     const [fileNames, setFileNames] = useState([]);
     const [newFiles, setNewFiles] = useState([]);
     const [uploadFiles, setUploadFiles] = useState([]);
     const [fileNamesB, setFileNamesB] = useState([]);
     const [newFilesB, setNewFilesB] = useState([]);
     const [uploadFilesB, setUploadFilesB] = useState([]);

     const [isSaving, setIsSaving] = useState(false)


    const onChangeNif = (e) => {
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
        setDatosForm({...datosForm, nombre: e.target.value})
    }

    const onChangeApellido1 = (e) => {
        setDatosForm({...datosForm, apellido1: e.target.value})
    }

    const onChangeApellido2 = (e) => {
        setDatosForm({...datosForm, apellido2: e.target.value})
    }

    const onChangeRazonSocial = (e) => {
        setDatosForm({...datosForm, razon: e.target.value})
    }

    const onChangeTipoVia = (e) => {
        setDatosForm({...datosForm, tipovia: e.target.value})
    }

    const onChangeNombreVia = (e) => {
        setDatosForm({...datosForm, nombrevia: e.target.value})
    }

    const onChangeNumero = (e) => {
        setDatosForm({...datosForm, numero: e.target.value})
    }

    const onChangePiso = (e) => {
        setDatosForm({...datosForm, piso: e.target.value})
    }

    const onChangePuerta = (e) => {
        setDatosForm({...datosForm, puerta: e.target.value})
    }

    const onChangeCodigoPostal = (e) => {
        setDatosForm({...datosForm, codigopostal: e.target.value})
    }

    const onChangeNumeroSerie = (e) => {
        setDatosForm({...datosForm, numserie: e.target.value})
    }

    const onChangeCantidad = (e) => {
        setDatosForm({...datosForm, cantidad: e.target.value})
    }

    const onChangeFechaVenta = (e) => {
        const dateFormatted = moment(e.target.value).format("DD/MM/YYYY");
        setDatosForm({...datosForm, fechaventa: dateFormatted});
        setFecha(true);
    }

    const onChangeMarca = (e) => {
        setDatosForm({...datosForm, marca: e.target.value})
        const models = allModelos.filter(modelo => modelo.marca === e.target.value)
        setModelos(models)
        //setModelos(modelos.filter(modelo => modelo.marca === e.target.value))
    }

    const onChangeModelo = (e) => {
        const seleccionado = e.target;
        const texto = seleccionado.options[seleccionado.selectedIndex].text;
        setDatosForm({...datosForm, modelo: texto, referencia: e.target.value})

    }

    const onChangeReferencia = (e) => {
        setDatosForm({...datosForm, referencia: e.target.value})
    }

    const onChangeTipoGas = (e) => {
        setDatosForm({...datosForm, tipogas: e.target.value})
    }
    const onChangeEmail = (e) => {
        setDatosForm({...datosForm, email: e.target.value})
    }
    const onChangeTelefono = (e) => {
        setDatosForm({...datosForm, telefono: e.target.value})
    }
    const onChangeTicket = (e) => {
        setDatosForm({...datosForm, ticket: e.target.value})
    }

    const fetchMarcas = useCallback(() => {
        client
            .query({
                query: getMarcas
            })
            .then(res => {
                const marcas = res.data.getLeroyInstalacionesEquipos.reduce((acc, marca) => {
                    const existingMarca = acc.find(item => item.name === marca.MARCA);
                    if (!existingMarca) {
                        acc.push({ name: marca.MARCA, value: marca.REFERENCIA });
                    }
                    return acc;
                }, []);
                setMarcas(marcas)
                const modelos = res.data.getLeroyInstalacionesEquipos.reduce((acc, modelo) => {
                    const existingModelo = acc.find(item => item.name === modelo.MODELO);
                    if (!existingModelo) {
                        acc.push({ name: modelo.MODELO, value: modelo.REFERENCIA, marca: modelo.MARCA});
                    }
                    return acc;
                }, []);
                setAllModelos(modelos)
            })
    }, [client, getMarcas])

     const fetchProvincias = useCallback(() => {
        client
            .query({
                query: getProvincias,
            })
            .then(res => {
                setProvincias(res.data.getProvincia)
            })
    }, [client, getProvincias])

    const onChangeProvincia = (e) => {
        setDatosForm({...datosForm, provincia: e.target.value})
        if(e.target.value) {
            fetchLocalidades(e.target.value)
        }

    };
    
    const fetchLocalidades = useCallback((e) => {
        client
            .query({
                query: getMunicipiosByProvincia ,
                variables: {
                    provinciaId: e,
                }
            })
            .then(res => {
                setLocalidades(res.data.getMunicipio)
            })
    }, [client,getMunicipiosByProvincia])

    const onChangeMunicipio = (e) => {
        setDatosForm({...datosForm, localidad: e.target.value})
    };

    const fetchCentroName = () => {
        client
            .query({
                query: getCentroName,
                variables: {
                    centroId
                }
            })
            .then(res => {
                setDatosForm({...datosForm, centro_id: centroId, tienda:centroId, centro: res.data.getCentrosProductoresView[0].nombre})
            })
    }

    const fetchCentros = () => {
        client
            .query({
                query: getCentros
            })
            .then(res => {
                setCentros(res.data.getCentroProductor)
            })
    }

    /* const fetchZona = (centro) => {
        client
            .query({
                query: getZonaByCentro,
                variables: {
                    centroId: centro
                }
            })
            .then(res => {
                fetchZonaName(res.data.getCentroProductor[0].ZONA_ID)
            })
    }

    const fetchZonaName = (id) => {
        client
            .query({
                query: getZonaName,
                variables: {
                    zonaId: id.toString()
                }
            })
            .then(res => {
                setDatosForm({...datosForm, zona_id: id.toString(), zona: res.data.getZona[0].nombre})
            })
    } */

    const onChangeCentro = (e) => {
        setDatosForm({...datosForm, centro_id: e.target.value, tienda: e.target.value, centro: e.target.options[e.target.selectedIndex].text})
        setAlmacen(true)
        //fetchZona(e.target.value)
    }

    // FORMATEAR DATOS PARA ENVIAR
    const setMutationString = async () => {
        await fetchLastId();
        return JSON.stringify(datosForm);
    }

    const existsParteB = () => {
        return fileNamesB.length > 0
    }

    useEffect(() => {
        /* fetchLastId() */
        !existsParteB() ? setDatosForm({...datosForm, estado_id: 2}) : setDatosForm({...datosForm, estado_id: 3})
    }, [fileNamesB])

    const fetchLastId = async () => {
        await client
            .query({
                query: getLastId,
                fetchPolicy: "no-cache"
            })
            .then(res => {
                newId = res.data.ventas_bricomart[0].id + 1
                setDatosForm({...datosForm, id: res.data.ventas_bricomart[0].id + 1})
            })

    }

    const onSubmitForm = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        // Enviar datos a la API usando FormData con todos los inputs del formulario
        const formData = new FormData();
        formData.append("accion", "guardarRetiradaLeroyInstalaciones");
        // Añadir inputs del formulario
        for (const key in datosForm) {
            formData.append(key, datosForm[key]);
        }
        // Pedimos una respuesta textual
        formData.append("direct", "true");
        


        const requestOptions = {
            method: 'POST',
            body: formData
        };
        fetch(`${API_INPRONET}/core/controller/LeroyInstalacionesController.php`, requestOptions)
          .then(response => response.json())
          .then(data => {
            if(data.resultado === "OK") {
                //uploadDocuments()
                setLinkA(data.linkDocumentoA)
                setLinkB(data.linkDocumentoB)
                setIsSaving(false);
                toggleVentaSuccess()
            } else {
                setIsSaving(false);
                toggleVentaErrorDocument()
            }
          })
          .catch(err => {
              console.log(err)
              if(err){
                toggleVentaErrorDocument()
              }
        }) 
     

        // let queryString = await setMutationString()
        // queryString = JSON.parse(queryString)
        // let ventaId;
        // const parteAId = await saveDocuments(newFiles, fileNames, "Bricomart Parte A")
        // if(!parteAId) {
        //     toggleVentaErrorDocument()
        //     return
        // }
        // let parteBId = "";
        // if(fileNamesB.length > 0) {
        //     parteBId = await saveDocuments(newFilesB, fileNamesB, "Bricomart Parte B")    
        // }
        // //queryString.id = newId
        // await client
        //         .mutate({
        //             mutation: insertVentaBricomart,
        //             variables: {
        //                 fields: queryString
        //             }
        //         })
        //         .then(res => {
        //             ventaId = res.data.insert_ventas_bricomart.returning[0].id
        //         })        
        // const pathParteA = await documentPath(parteAId)
        // let pathParteB;
        // if(parteBId) {
        //     pathParteB = await documentPath(parteBId)
        // }
        // const isUpdated = await updateRutaVentaDocumento(ventaId, pathParteA, pathParteB)
        // if(isUpdated === 1) toggleVentaSuccess()
    }

    const documentPath = async (id) => {
        return client
                .query({
                    query: getDocumentPath,
                    variables: {
                        documentId: id
                    }
                })
                .then(res => {
                    return res.data.getDocumento[0].RUTA
                })
    }

    const updateRutaVentaDocumento = async (ventaId, parteA, parteB) => {
        return client
                .mutate({
                    mutation: updateDocumentsPath,
                    variables: {
                        ventaId: ventaId,
                        parteAPath: parteA,
                        parteBPath: parteB
                    }
                })
                .then(res => {
                    return res.data.update_ventas_bricomart.affected_rows
                })
    }

    const redirectToVentas = () => {
        history.push("/crm/registro-ventas");
      };

     useEffect(() => {
        fetchProvincias()
        fetchCentros()   
        fetchMarcas() 
        if(centroId) {
            fetchCentroName()
            setAlmacen(true)
        }
    }, [])

    return (
        <div>
            <div className="content">
                <section className="box">
                    <div className= "content-body">
                        <h2>Registro Nueva Venta</h2>
                        <Form id="datosVenta" onSubmit={onSubmitForm}>
                            <Row form>
                                <Col md={2}>
                                    <FormGroup>
                                        <Label>NIF/NIE <span style={{ color: 'red' }}>*</span></Label>
                                        <Input
                                        type="text"
                                        onChange={onChangeNif}
                                        maxLength="9"
                                        />
                                        {nifInvalido ? (
                                                    <div>Introduzca un número de identificación válido</div>
                                                ) : (<></>)
                                            }
                                    </FormGroup>
                                </Col>
                                <Col md={4}>
                                    <FormGroup>
                                        <Label>Nombre</Label>
                                        <Input
                                        type="text"
                                        onChange={onChangeFullName}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={3}>
                                    <FormGroup>
                                        <Label>Apellido 1</Label>
                                        <Input
                                        type="text"
                                        onChange={onChangeApellido1}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={3}>
                                    <FormGroup>
                                        <Label>Apellido 2</Label>
                                        <Input
                                        type="text"
                                        onChange={onChangeApellido2}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row form>
                                <Col md={12}>
                                    <FormGroup>
                                        <Label>Razón Social</Label>
                                        <Input
                                        type="text"
                                        onChange={onChangeRazonSocial}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row form>
                                <Col md={12}>
                                    <FormGroup>
                                        <Label>País dirección</Label>
                                        <Input
                                            type="select"
                                            onChange={(e) => setDatosForm({...datosForm, paisDireccion: e.target.value})}
                                        >
                                            <option disabled selected defaultValue> -- Seleccionar -- </option>
                                            <option value="spain">España</option>
                                            <option value="portugal">Portugal</option>
                                            <option value="france">Francia</option>
                                        </Input>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row form>
                                <Col md={3}>
                                    <FormGroup>
                                        <Label>Tipo de Vía <span style={{ color: 'red' }}>*</span></Label>
                                        <Input
                                        type="text"
                                        onChange={onChangeTipoVia}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={4}>
                                    <FormGroup>
                                        <Label>Nombre Vía <span style={{ color: 'red' }}>*</span></Label>
                                        <Input
                                        type="text"
                                        onChange={onChangeNombreVia}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={1}>
                                    <FormGroup>
                                        <Label>Número <span style={{ color: 'red' }}>*</span></Label>
                                        <Input
                                        type="text"
                                        onChange={onChangeNumero}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={1}>
                                    <FormGroup>
                                        <Label>Piso</Label>
                                        <Input
                                        type="text"
                                        onChange={onChangePiso}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={1}>
                                    <FormGroup>
                                        <Label>Puerta</Label>
                                        <Input
                                        type="text"
                                        onChange={onChangePuerta}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={2}>
                                    <FormGroup>
                                        <Label>Código Postal <span style={{ color: 'red' }}>*</span></Label>
                                        <Input
                                        type="text"
                                        onChange={onChangeCodigoPostal}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row form>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label>Email</Label>
                                        <Input
                                        type="email"
                                        onChange={onChangeEmail}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label>Teléfono</Label>
                                        <Input
                                        type="text"
                                        onChange={onChangeTelefono}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row form>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label>Provincia</Label>
                                        <Input
                                        type="select"
                                        onChange= {onChangeProvincia}
                                        >
                                            <option disabled selected defaultValue> -- Seleccionar -- </option>
                                            {provincias && provincias.map(provincia=>{ 
                                                return (
                                                <option key={provincia.ID} value={provincia.ID} >{provincia.NOMBRE}</option>
                                                )
                                            })}
                                        </Input>
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label>Localidad</Label>
                                        <Input
                                        type="select"
                                        onChange={onChangeMunicipio}
                                        >
                                            <option disabled selected defaultValue> -- Seleccionar -- </option>
                                            {localidades && localidades.map(localidad=>{ 
                                                return (
                                                <option key={localidad.ID} value={localidad.ID} >{localidad.NOMBRE}</option>
                                                )
                                            })}
                                        </Input>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row form>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label>Marca <span style={{ color: 'red' }}>*</span></Label>
                                        <Input
                                        type="select"
                                        onChange={onChangeMarca}
                                        >
                                            <option disabled selected defaultValue> -- Seleccionar -- </option>
                                            {marcas && marcas.map(marca=>{ 
                                                return (
                                                <option key={marca.name} value={marca.name} >{marca.name}</option>
                                                )
                                            })}
                                        </Input>
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label>Modelo <span style={{ color: 'red' }}>*</span></Label>
                                        <Input
                                        type="select"
                                        onChange={onChangeModelo}
                                        >
                                            <option disabled selected defaultValue> -- Seleccionar -- </option>
                                            {modelos && modelos.map(modelo=>{ 
                                                return (
                                                <option key={modelo.value} value={modelo.value} >{modelo.name}</option>
                                                )
                                            })}
                                        </Input>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row form>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label>Marca <span style={{ color: 'red' }}>*</span></Label>
                                        <Input
                                        type="text"
                                        required
                                        onChange={onChangeMarca}
                                        value={datosForm.marca}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label>Modelo <span style={{ color: 'red' }}>*</span></Label>
                                        <Input
                                        type="text"
                                        required
                                        onChange={onChangeModelo}
                                        value={datosForm.modelo}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row form>
                                <Col md={3}>
                                    <FormGroup>
                                        <Label>Referencia <span style={{ color: 'red' }}>*</span></Label>
                                        <Input
                                        type="text"
                                        
                                        onChange={onChangeReferencia}
                                        value={datosForm.referencia}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={3}>
                                    <FormGroup>
                                        <Label>Número de Serie</Label>
                                        <Input
                                        type="text"
                                        onChange={onChangeNumeroSerie}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={3}>
                                    <FormGroup>
                                        <Label>Cantidad</Label>
                                        <Input
                                        type="number"
                                        onChange={onChangeCantidad}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={3}>
                                    <FormGroup>
                                        <Label>Tipo Gas</Label>
                                        <Input
                                        type="text"
                                        onChange={onChangeTipoGas}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row form>
                                <Col md={2}>
                                    
                                        <Label>Instalación Leroy <span style={{ color: 'red' }}>*</span></Label>
                                        </Col>
                                        <Col md={1}>
                                        <FormGroup>

                                        <Input
                                        required
                                        type="radio"
                                        name="instalacionpropia"
                                        value="1"
                                        onChange={() => setDatosForm({...datosForm, instalacion_propia: 1})}
                                        />SI
                                        </FormGroup>
                                        </Col>
                                        <Col md={1}>
                                        <FormGroup>
                                        <Input
                                        type="radio"
                                        
                                        name="instalacionpropia"
                                        value="0"
                                        onChange={() => setDatosForm({...datosForm, instalacion_propia: 0})}
                                        />
                                        NO
                                    </FormGroup>
                                </Col>
                                <Col md={3}>
                                    <FormGroup>
                                        <Label>Número de pedido <span style={{ color: 'red' }}>*</span></Label>
                                        <Input
                                                required={datosForm.instalacion_propia == 1}

                                        type="text"
                                        name="numeropedido"
                                        onChange={(e) => setDatosForm({...datosForm, numeropedido: e.target.value})}
                                        />
                                    </FormGroup>
                                </Col>   
                                <Col md={3}>
                                    <FormGroup>
                                        <Label>Ticket</Label>
                                        <Input
                                        type="text"
                                        name="ticket"
                                        onChange={(e) => setDatosForm({...datosForm, ticket: e.target.value})}
                                        />
                                    </FormGroup>
                                </Col>                                 
                            </Row>
                            <Row form >
                                <Col md={3}>
                                    <FormGroup>
                                        <Label>Fecha Venta <span style={{ color: 'red' }}>*</span></Label>
                                        <Input
                                        type="date"
                                        placeholder="date placeholder"
                                        onChange={onChangeFechaVenta}
                                        />
                                         {!fecha ? (
                                                    <div>Por favor, seleccione una fecha</div>
                                                ) : (<></>)
                                            }
                                    </FormGroup>
                                </Col>
                                <Col md={4}>
                                    <FormGroup>
                                        <Label>Tienda <span style={{ color: 'red' }}>*</span></Label>
                                        <Input
                                        type="select"
                                        onChange={onChangeCentro}
                                        >   
                                            {!centroId && (<option disabled selected value> -- Seleccionar -- </option>)}
                                            {centros && centros.map(centro=>{ 
                                                if(centro.ID == centroId) {
                                                    return (<option key={centro.ID} value={centro.ID} selected>{centro.DENOMINACION}</option>)
                                                } 
                                                return (
                                                    <option key={centro.ID} value={centro.ID} >{centro.DENOMINACION}</option>
                                                )
                                            })}
                                        </Input>
                                        {!almacen ? (
                                                    <div>Por favor, seleccione una tienda</div>
                                                ) : (<></>)
                                            }
                                    </FormGroup>
                                </Col>
                                <Col md={4}>
                                    <FormGroup>
                                        <Label sm={4}>Venta telefónica</Label>
                                        <Input
                                        type="checkbox"
                                        name="ventatelefonica"
                                        onChange={(e) => {

                                            if(e.target.value == "on") {
                                                setDatosForm({...datosForm, ventatelefonica: 1})
                                            }
                                        }}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row form>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label>Idioma documentación</Label>
                                        <Input
                                            type="select"
                                            onChange={(e) => setDatosForm({...datosForm, language: e.target.value})}
                                        >
                                            <option disabled selected defaultValue> -- Seleccionar -- </option>
                                            <option value="spa" selected="">Español</option>
                                            <option value="ger">Alemán</option>
                                            <option value="cat">Catalán</option>
                                            <option value="eng">Inglés</option>
                                            <option value="fre">Francés</option>
                                            <option value="por">Portugués</option>
                                        </Input>
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label>Indicar, si fuera necesario, el nº de veces que es necesario replicar el formulario</Label>
                                        <Input
                                        type="text"
                                        name="duplicado"
                                        onChange={(e) => setDatosForm({...datosForm, duplicado: e.target.value})}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            {/* <Row form>
                                <Col md={4}>
                                <Label>Añadir parte A*:</Label>
                                <Dropzone onDrop={onDropA}>
                                    {({
                                        getRootProps,
                                        getInputProps,
                                        isDragActive,
                                        isDragAccept,
                                        isDragReject,
                                    }) => {
                                        const additionalClass = isDragAccept
                                        ? "accept"
                                        : isDragReject
                                        ? "reject"
                                        : "";

                                        return (
                                        <div
                                            {...getRootProps({
                                            className: `dropzone ${additionalClass}`,
                                            })}
                                        >
                                            <input {...getInputProps()} />
                                            <span>{isDragActive ? "📂" : "📁"}</span>
                                        </div>
                                        );
                                    }}
                                </Dropzone>
                                    <div>
                                    {fileNames.length > 0 ? <strong>Documentos:</strong> : <></>}
                                    <ul>
                                        {fileNames.map((fileName) => (
                                        <li key={fileName.NOMBRE}>
                                            <span className="filename-list">{fileName.NOMBRE}</span>

                                            {fileName.IS_NEW && (
                                            <span
                                                className="delete-document"
                                                onClick={() => quitarDocumentoA(fileName)}
                                            >
                                                <Button color="danger">Eliminar</Button>
                                            </span>
                                            )}
                                        </li>
                                        ))}
                                    </ul>
                                    </div>
                                </Col>
                                <Col md={4}>
                                <Label>Añadir parte B:</Label>
                                <Dropzone onDrop={onDropB}>
                                    {({
                                        getRootProps,
                                        getInputProps,
                                        isDragActive,
                                        isDragAccept,
                                        isDragReject,
                                    }) => {
                                        const additionalClass = isDragAccept
                                        ? "accept"
                                        : isDragReject
                                        ? "reject"
                                        : "";

                                        return (
                                        <div
                                            {...getRootProps({
                                            className: `dropzone ${additionalClass}`,
                                            })}
                                        >
                                            <input {...getInputProps()} />
                                            <span>{isDragActive ? "📂" : "📁"}</span>
                                        </div>
                                        );
                                    }}
                                </Dropzone>
                                    <div>
                                    {fileNamesB.length > 0 ? <strong>Documentos:</strong> : <></>}
                                    <ul>
                                        {fileNamesB.map((fileName) => (
                                        <li key={fileName.NOMBRE}>
                                            <span className="filename-list">{fileName.NOMBRE}</span>

                                            {fileName.IS_NEW && (
                                            <span
                                                className="delete-document"
                                                onClick={() => quitarDocumentoB(fileName)}
                                            >
                                                <Button color="danger">Eliminar</Button>
                                            </span>
                                            )}
                                        </li>
                                        ))}
                                    </ul>
                                    </div>
                                </Col>
                            </Row> */}
                            <Row form> 
                                <Col md={2}>
                                    {nifInvalido || !almacen || !fecha || isSaving ? (
                                        <Button type="submit" disabled>
                                                Guardar 
                                        </Button>
                                        ) : (
                                        <Button color="primary" type="submit">
                                            Guardar 
                                        </Button>)
                                    }
                                 </Col>
                            </Row>
                        </Form>
                    </div>
                </section>
            </div>
            {/* MODALES */}
            {ventaSuccess ? (
                    <VentaSuccessModal ventaSuccess={ventaSuccess} toggle={toggleVentaSuccess} redirectToVentas={redirectToVentas} linkA={linkA} linkB={linkB}/>
                ) : (<></>)
            }
            {ventaErrorDocument ? (
                    <VentaErrorDocumentoModal ventaErrorDocument={ventaErrorDocument} toggle={toggleVentaErrorDocument} />
                ) : (<></>)
            }
        </div>
    )
}

export default FormularioNuevaVenta
