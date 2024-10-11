import React, {useState} from 'react'
import { Link, Redirect } from 'react-router-dom';
//import { Auth } from 'aws-amplify';
import {
    Button, Modal, ModalHeader, ModalBody, ModalFooter,
    Container, Row, Col, Label, FormGroup, Input, Form, FormText
} from 'reactstrap';

const ForgottenPassword = (props) => {
    const [username, setUsername] = useState()

    const onChangeUsername = (e) => {
        console.log(e.target.value)
        setUsername(e.target.value)
    }

    const onSubmit = (e) => {
        e.preventDefault()
        // Auth.forgotPassword(username)
        //   .then(data => {
        //       console.log(data)
        //         props.history.push('/verification-code')
        //   })
        //   .catch(err => {
        //       console.log(err)

        // })
    }

    return (
        <div className="login-centre">
            <Container>
                <Row>
                    <Col sm={6} className="px-2">
                        <FormGroup>
                            <Label>Usuario</Label>
                            <Input type="text" id="username" name="username" onChange={onChangeUsername}></Input>
                        </FormGroup>
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

export default ForgottenPassword
