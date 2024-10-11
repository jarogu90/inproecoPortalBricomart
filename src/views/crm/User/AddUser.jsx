import React, {useState} from 'react';
import {
    Button, Modal, ModalHeader, ModalBody, ModalFooter,
    Container, Row, Col, Label, FormGroup, Input, Form, FormText
} from 'reactstrap';


const AddUser = ({isOpen, toggle, userModal, setUserModal, setNewUserCreated}) => {
    const [user, setUser] = useState()
    const [password, setPassword] = useState()
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [ip, setIP] = useState('')
    const [notificable, setNotificable] = useState(true)
    const [focoEmision, setFocoEmision] = useState(false)
    const [medioAmbiente, setMedioAmbiente] = useState(false)
    const [isCheckedNotificable, setIsCheckedNotificable] = useState(true)

    const onChangeNotificable = (e) => {
        setIsCheckedNotificable(!isCheckedNotificable)
        setNotificable(!notificable)
    }

    const onSubmit = (e) => {
        e.preventDefault()
        let notificableBooleanString = notificable ? "true" : "false"
        let focoEmisionBooleanString = focoEmision ? "true" : "false"
        let medioAmbienteBooleanString = medioAmbiente ? "true" : "false"

        console.log(user, password, name, email, ip, notificableBooleanString, focoEmisionBooleanString, medioAmbienteBooleanString)


            setUserModal(!userModal)
    }

    return (
        <Modal isOpen={isOpen} toggle={toggle}>
            <ModalHeader toggle={toggle}>Añadir usuario</ModalHeader>
            <ModalBody>
                <Row>
                    <Col sm={6} className="px-2">
                        <FormGroup>
                            <Label>Usuario</Label>
                            <Input type="text" name="user" id="user" onChange={(e)=>setUser(e.target.value)}/>                                          
                        </FormGroup>
                    </Col>
                    <Col sm={6} className="px-2">
                        <FormGroup>
                            <Label>Contraseña</Label>
                            <Input type="password" name="password" id="password" onChange={(e)=>setPassword(e.target.value)}/>                                          
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col sm={6} className="px-2">
                        <FormGroup>
                            <Label>Nombre</Label>
                            <Input type="text" name="name" id="name" onChange={(e)=>setName(e.target.value)}/>                                          
                        </FormGroup>
                    </Col>
                    <Col sm={6} className="px-2">
                        <FormGroup>
                            <Label>Email</Label>
                            <Input type="email" name="email" id="email" onChange={(e)=>setEmail(e.target.value)}/>                                          
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col sm={12} className="px-2">
                        <FormGroup>
                            <Label>Filtro por IP</Label>
                            <Input type="text" name="ips" id="ips" onChange={(e)=>setIP(e.target.value)}/>                                          
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col sm={12} className="px-2">
                        <FormGroup>
                            <Label sm={6}>Acciones notificables</Label>
                            <Input type="checkbox" name="notificable" id="notificable" checked={isCheckedNotificable} onClick={onChangeNotificable}>
                            </Input>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col sm={12} className="px-2">
                        <FormGroup>
                            <Label sm={6}>Visible foco emisión</Label>
                            <Input type="checkbox" name="focoEmision" id="focoEmision" onClick={()=>setFocoEmision(!focoEmision)}>
                            </Input>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col sm={12} className="px-2">
                        <FormGroup>
                            <Label sm={6}>Visible Medio Ambiente</Label>
                            <Input type="checkbox" name="medioAmbiente" id="medioAmbiente" onClick={()=>setMedioAmbiente(!medioAmbiente)}>
                            </Input>
                        </FormGroup>
                    </Col>
                </Row>
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={onSubmit}>Guardar</Button>
                <Button onClick={() => setUserModal(!userModal)}>Cancelar</Button>
            </ModalFooter>
        </Modal>
    )
}

export default AddUser;
