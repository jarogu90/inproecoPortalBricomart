import React, {useState} from 'react';
import Datatable from 'react-bs-datatable';
import {
    Button, Modal, ModalHeader, ModalBody, ModalFooter,
    Container, Row, Col, Label, FormGroup, Input, Form, FormText
} from 'reactstrap';

import AddUser from './AddUser';

const User = () => {
    const [userModal, setUserModal] = useState(false)
    const [newUserCreated, setNewUserCreated] = useState(false)

    const toggleAddUserModal = () => {
        setUserModal(!userModal)
    }

    const NewUserMessage = () => {
        if(newUserCreated){
            return <p>El nuevo usuario se ha creado con éxito.</p>
        } else {
            return <></>
        }
    }

    if(newUserCreated){
        setTimeout(()=>{
            setNewUserCreated(false)
        },3000)
    }

    return(
        <div>
            <div className="content">
                <Row>
                    <Col xs={12} md={12}>
                        <div className="page-title">
                            <div className="float-left">
                                <h1 className="title">Usuarios</h1>
                            </div>
                        </div>
                        <div className="col-12">
                            <section className="box ">
                                <header className="panel_header">
                                    {/* <h2 className="title float-left">All Users</h2> */} 
                                    <Button color="primary" onClick={toggleAddUserModal}>Añadir usuario</Button>     
                                </header>
                                <div className="content-body">
                                    <div className="row">
                                        {/* <div className="col-lg-12 dt-disp">                          
                                            <Datatable
                                            tableHeader={header}
                                            tableBody={body}
                                            keyName="userTable"
                                            tableClass="striped table-hover table-responsive"
                                            rowsPerPage={10}
                                            rowsPerPageOption={[5, 10, 15, 20]}
                                            initialSort={{prop: "id", isAscending: true}}
                                            onSort={onSortFunction}
                                            labels={customLabels}
                                            />
                                        </div> */}
                                        <NewUserMessage />
                                    </div>
                                </div>
                            </section>
                        </div>
                    </Col>
                </Row>
            </div>
            <AddUser isOpen={userModal} toggle={toggleAddUserModal} userModal={userModal} setUserModal={setUserModal} setNewUserCreated={setNewUserCreated}/>
        </div>
            
    )
}

/* class User extends React.Component{
    
    render(){
        return (
            <div>
                <div className="content">
                    <Row>
                        <Col xs={12} md={12}>
                            <div className="page-title">
                                <div className="float-left">
                                    <h1 className="title">Users</h1>
                                </div>
                            </div>
                            <div className="col-12">
                                <section className="box ">
                                    <header className="panel_header">
                                        <h2 className="title float-left">All Users</h2>      
                                    </header>
                                    <div className="content-body">
                                        <div className="row">
                                            <div className="col-lg-12 dt-disp">                          
                                                <Datatable
                                                tableHeader={header}
                                                tableBody={body}
                                                keyName="userTable"
                                                tableClass="striped table-hover table-responsive"
                                                rowsPerPage={10}
                                                rowsPerPageOption={[5, 10, 15, 20]}
                                                initialSort={{prop: "id", isAscending: true}}
                                                onSort={onSortFunction}
                                                labels={customLabels}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
} */

export default User;
