import React, { useState, useEffect, useCallback, useContext } from 'react';
import { FilteringState, IntegratedFiltering } from "@devexpress/dx-react-grid";

//constants
import { REGISTRO_VENTAS_COLUMNS, REGISTRO_VENTAS_EXPORT_COLUMNS } from '../../../components/constants';

//graphql
import { client, getVentasByCentro, getVentasAllCentros } from '../../../components/graphql';

// context
import { GlobalStateContext } from "../../../context/GlobalContext";

//components
import Layout from '../../../components/common/Layout/Layout'

const RegistroVentas = () => {
    const { user } = useContext(GlobalStateContext);  
    const { centroId } = user; 
    const columns = REGISTRO_VENTAS_COLUMNS;
    const [ventas, setVentas] = useState(null)
    const [lastQuery, setLastQuery] = useState();

    const fetchVentas = () => {
        if(user.rolDesc === "LEROY_INSTALACIONES_CENTRO" || user.rolDesc === "INPROECO") fetchVentasRoleCentro()
        else fetchVentasRoleCorporativo()
    }

    const fetchVentasRoleCentro = useCallback(() => {
        client
            .query({
                query: getVentasByCentro,
                fetchPolicy: "no-cache",
                variables: {
                    limit: 500,
                    centroId: centroId
                }
            })
            .then(res => {
                //console.log(res)
                setVentas(setEstadoName(res.data.getLeroyInstalacionesView))
            })
    }, [client, getVentasByCentro])
    console.log(lastQuery)
    const fetchVentasRoleCorporativo = useCallback(() => {
        client
            .query({
                query: getVentasAllCentros,
                fetchPolicy: "no-cache",
                variables: {
                    limit: 2000,
                    fields: lastQuery
                  },
            })
            .then(res => {
                setVentas(res.data.getLeroyInstalacionesView)
            })
    }, [client, getVentasAllCentros])

    const setEstadoName = (ventas) => {
        let results = []
        for(let i = 0; i < ventas.length; i++){
            if(ventas[i].estado_venta) ventas[i].estado = ventas[i].estado_venta.nombre
            results.push(ventas[i])
        }
        return results;
    }

    /* const setFechaFormatted = (ventas) => {
        let results = []
        for(let i = 0; i < ventas.length; i++){
            if(ventas[i].fecha_venta) ventas[i].fecha_venta = ventas[i].fecha_venta
            results.push(ventas[i])
        }
        console.log(results)
        return results;
    } */


    useEffect(() => {
        fetchVentas()
    }, [])

    return (
        <Layout
            title="Registro de ventas"
            rows={ventas}
            setRows={setVentas}
            columns={columns}
            columnsToExport={REGISTRO_VENTAS_EXPORT_COLUMNS}
            fetchVentas={fetchVentas}
            setEstadoName={setEstadoName}
            user={user}
            lastQuery={lastQuery}
            setLastQuery={setLastQuery}
        >
            {/* <FilteringState defaultFilters={[]} />
            <IntegratedFiltering /> */}
        </Layout>
    )
}

export default RegistroVentas
