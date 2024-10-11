import React, {useState, useContext} from "react";
import { Link, Redirect } from 'react-router-dom';
import {
    Button, Modal, ModalHeader, ModalBody, ModalFooter,
    Container, Row, Col, Label, FormGroup, Input, Form, FormText
} from 'reactstrap';

import { GlobalDispatchContext } from "../../../context/GlobalContext";
import { API_INPRONET } from "../../../components/constants";

const Login = (props) => {
  const dispatch = useContext(GlobalDispatchContext);
    const [username, setUsername] = useState()
    const [password, setPassword] = useState()
    const [userInvalid, setUserInvalid] = useState()

    const onChangeUsername = (e) => {
      setUsername(e.target.value)
    }

    const onChangePassword = (e) => {
      setPassword(e.target.value)
    }

    const onSubmit = (e) => {
        e.preventDefault()
        
        const docData = new FormData();
        docData.append("auth", "true")
        docData.append("username", username)
        docData.append("password", password)              
        const requestOptions = {
          method: 'POST',
          body: docData
        };
        fetch(`${API_INPRONET}/auth.php`, requestOptions)
        //Auth.signIn(username, password)
          .then(response => response.text())
          .then(user => {
            user = JSON.parse(user)
            if(user != "ERRORUSER_PASS" && 
              (user.rolDesc === "BRICOMART_CENTRO" ||
              user.rolDesc === "BRICOMART_CORPORATIVO" ||
              user.rolDesc === "BRICOMART_INPROECO" ||
              user.rolDesc === "BRICOMART_INPROECO_CENTRO")
            ) {
              dispatch(
                { type: "SET_ALLOWED", payload: { isAllowed: true } }); 
              dispatch({
                type: "SET_LOGIN",
                payload: { token: user.mail, user: user },
              });
              if(user.rolDesc == "BRICOMART_INPROECO" || user.rolDesc === "BRICOMART_INPROECO_CENTRO") props.history.push("/crm/nueva-venta");
              else props.history.push("/crm/registro-ventas");           
            } else {
              props.history.push("/login");
            }
          })
          .catch(err => {
              console.log(err)
              if(err){
                setUserInvalid(true)
              }
        }) 
    }

    return (
      <div className="home">
      <img className="img" src="/ilustracion-login.png" />

      <div className="login">
        <img src="/circulo bienvenida.png" />
        <p className="title-login">BIENVENIDO</p>

        <form className="form">
          <div>
            <input className="input" placeholder="Usuario" type="text" id="username" name="username" onChange={onChangeUsername} />
          </div>

          <div>
            <input className="input" placeholder="Contraseña" type="password" id="password" name="password" onChange={onChangePassword}/>
          </div>
          {/* <div className="contraseña">
            Recordar mi contraseña
            <input type="checkbox" className="input-checkbox" />
          </div> */}
          {userInvalid ? (<p>El usuario o la contraseña son incorrectos.</p>) : (<></>)}
          <button className="button-login" onClick={onSubmit}>
            ENTRAR
          </button>
        </form>

        <Link className="regis-login" to="/forgotten-password">
            ¿Has olvidado tu contraseña?
        </Link>
      </div>
    </div>
      
    )
}

export default Login