import React, {useState, useContext} from "react";
import { Link, Redirect } from 'react-router-dom';
import { Auth } from 'aws-amplify';
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
              (user.rolDesc === "LEROY_INSTALACIONES_CENTRO" ||
              user.rolDesc === "LEROY_INSTALACIONES_CORPORATIVO" ||
              user.rolDesc === "INPROECO" ||
              user.rolDesc === "LEROY_INSTALACIONES_ZONA")
            ) {
              dispatch(
                { type: "SET_ALLOWED", payload: { isAllowed: true } }); 
              dispatch({
                type: "SET_LOGIN",
                payload: { token: user.mail, user: user },
              });
              if(user.rolDesc == "INPROECO" || user.rolDesc === "LEROY_INSTALACIONES_CENTRO") props.history.push("/crm/nueva-venta");
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
      <div class="home">
      <img class="img" src="/ilustracion-login.png" />

      <div class="login">
        <img src="/circulo bienvenida.png" />
        <p class="title-login">BIENVENIDO</p>

        <form class="form">
          <div>
            <input class="input" placeholder="Usuario" type="text" id="username" name="username" onChange={onChangeUsername} />
          </div>

          <div>
            <input class="input" placeholder="Contraseña" type="password" id="password" name="password" onChange={onChangePassword}/>
          </div>
          {/* <div class="contraseña">
            Recordar mi contraseña
            <input type="checkbox" class="input-checkbox" />
          </div> */}
          {userInvalid ? (<p>El usuario o la contraseña son incorrectos.</p>) : (<></>)}
          <button class="button-login" onClick={onSubmit}>
            ENTRAR
          </button>
        </form>

        <Link class="regis-login" to="/forgotten-password">
            ¿Has olvidado tu contraseña?
        </Link>
      </div>
    </div>
      
    )
}

export default Login