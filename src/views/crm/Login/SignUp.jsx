import React, {useState} from 'react'
import { Link, Redirect } from 'react-router-dom';
//import { Auth } from 'aws-amplify';
import {
    Button, Modal, ModalHeader, ModalBody, ModalFooter,
    Container, Row, Col, Label, FormGroup, Input, Form, FormText
} from 'reactstrap';

const SignUp = () => {
    const [username, setUsername] = useState()
    const [password, setPassword] = useState()
    const [email, setEmail] = useState()
    const [name, setName] = useState()

    const onChangeUsername = (e) => {
        setUsername(e.target.value)
    }

    const onChangePassword = (e) => {
        setPassword(e.target.value)
    }

    const onChangeEmail = (e) => {
        setEmail(e.target.value)
    }

    const onChangeName = (e) => {
        setName(e.target.value)
    }

    const onSubmit = (e) => {
        console.log(username)
        e.preventDefault()

              
    }

    return (
        <Container>
            <Row>
                <Col sm={6} className="px-2">
                    <FormGroup>
                        <Label>Email</Label>
                        <Input type="email" id="email" name="email" onChange={onChangeEmail}></Input>
                    </FormGroup>
                    <FormGroup>
                        <Label>Nombre</Label>
                        <Input type="text" id="name" name="name" onChange={onChangeName}></Input>
                    </FormGroup>
                    <FormGroup>
                        <Label>Usuario</Label>
                        <Input type="text" id="username" name="username" onChange={onChangeUsername}></Input>
                    </FormGroup>
                    <FormGroup>
                        <Label>Contraseña</Label>
                        <Input type="password" id="password" name="password" onChange={onChangePassword}></Input>
                    </FormGroup>
                </Col>
            </Row>
            <Button color="primary" onClick={onSubmit}>Registrarse</Button>
        </Container>
    )
}

export default SignUp
