import FormularioNuevaVenta from '../views/crm/Ventas/FormularioNuevaVenta';
import RegistroVentas from '../views/crm/Ventas/RegistroVentas';
import SubirParteB from '../views/crm/Ventas/SubirParteB';

var BASEDIR = process.env.REACT_APP_BASEDIR;

var dashRoutes = [ 
    { path: BASEDIR+"/crm/nueva-venta", name: "Nueva Venta", component: FormularioNuevaVenta},
    { path: BASEDIR+"/crm/registro-ventas", name: "Registro Ventas", component: RegistroVentas},
    { path: BASEDIR+"/crm/subir-parte-b", name: "Gestiones otras tiendas", component: SubirParteB},

];
export default dashRoutes;
