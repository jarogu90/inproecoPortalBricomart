import React, {useState} from 'react'
import { Link, Redirect } from 'react-router-dom';
import {
    Button, Modal, ModalHeader, ModalBody, ModalFooter,
    Container, Row, Col, Label, FormGroup, Input, Form, FormText
} from 'reactstrap';

const VerificationCode = (props) => {
    const [code, setCode] = useState()
    const [username, setUsername] = useState()
    const [password, setPassword] = useState()
    const [confirmPassword, setConfirmPassword] = useState()
    const [invalidForm, setInvalidForm] = useState(false)

    const onChangeCode = (e) => {
        console.log(e.target.value)
        setCode(e.target.value)
    }

    const onChangeUsername = (e) => {
        setUsername(e.target.value)
    }

    const onChangePassword = (e) => {
        setPassword(e.target.value)
    }

    const onChangeConfirmPassword = (e) => {
        setConfirmPassword(e.target.value)
    }

    const onSubmit = (e) => {
        e.preventDefault()
        if(password !== confirmPassword){
            setInvalidForm(true)
            return
        }
        console.log(username,code,password)

        props.history.push('/login')
    }

    return (
        <div className="login-centre">
            <Container>
                <Row>
                    <Col sm={6} className="px-2">
                        <FormGroup>
                            <Label>Introduzca su código  de verificación</Label>
                            <Input type="text" id="username" name="username" onChange={onChangeCode}></Input>
                        </FormGroup>
                        <FormGroup>
                            <Label>Introduzca su nombre de usuario</Label>
                            <Input type="text" id="username" name="username" onChange={onChangeUsername}></Input>
                        </FormGroup>
                        <FormGroup>
                            <Label>Introduzca su contraseña nueva</Label>
                            <Input type="password" id="password" name="password" onChange={onChangePassword}></Input>
                        </FormGroup>
                        <FormGroup>
                            <Label>Confirme su contraseña</Label>
                            <Input type="password" id="confirmPassword" name="confirmPassword" onChange={onChangeConfirmPassword}></Input>
                        </FormGroup>
                        {invalidForm ? (<FormText color="danger">Las contraseñas introducidas no coinciden</FormText>) : (<></>)}                 
                    </Col>
                </Row>
                <Button color="primary" onClick={onSubmit}>Confirmar usuario</Button>
                <Link to="/login">
                    ¡Ya me acuerdo!
                </Link>
            </Container>
        </div>
    )
}

export default VerificationCode