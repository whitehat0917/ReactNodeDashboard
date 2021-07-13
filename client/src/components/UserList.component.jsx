import React, { Component } from 'react'
import { Container, Row, Col } from 'reactstrap'
import DataTable from './Tables/UserDataTable'
import UserService from "../services/user.service"
import { connect } from 'react-redux'
import ToastAlert from './Toast/Toast'
import ModalForm from './Modals/AddUserModal'

class UserList extends Component {
    state = {
        items: [],
        toastShow: false
    }

    getItems() {
        UserService.getUsers().then(
            response => {
                if (response.data.status == "success") {
                    this.setState({
                        items: response.data.data
                    });
                } else {
                    this.setState({ toastShow: true, alertDescription: response.data.status })
                }
            },
            error => {
                this.setState({
                    content:
                        (error.response && error.response.data) ||
                        error.message ||
                        error.toString()
                });
            }
        );
    }

    addItemToState = (item) => {
        this.getItems()
    }

    deleteItemFromState = (id) => {
        const updatedItems = this.state.items.filter(item => item.USERID !== id)
        this.setState({ items: updatedItems })
    }

    componentDidMount() {
        this.getItems()
    }

    render() {
        return (
            <div>
                <Container className="App">
                    <Row>
                        <Col>
                            <h1 style={{ margin: "20px 0" }}>User List</h1>
                        </Col>
                    </Row>
                    <Row className="py-2">
                        <Col>
                            <ModalForm buttonLabel="Add User" addItemToState={this.addItemToState} />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <DataTable items={this.state.items} deleteItemFromState={this.deleteItemFromState} />
                        </Col>
                    </Row>
                </Container>
                <ToastAlert show={this.state.toastShow} description={this.state.alertDescription}></ToastAlert>
            </div>
        )
    }
}

const mapStateToProps = (state) => state.admin;

export default connect(mapStateToProps)(UserList);