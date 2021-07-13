import React, { Component } from 'react'
import { Container, Row, Col } from 'reactstrap'
import DataTable from './Tables/ServerDataTable'
import UserService from "../services/user.service"
import { connect } from 'react-redux'
import ToastAlert from './Toast/Toast'
import ModalForm from './Modals/AddServerModal'

class ServerList extends Component {
    state = {
        items: [],
        toastShow: false
    }

    getItems() {
        UserService.getServers().then(
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

    updateState = (item) => {
        const itemIndex = this.state.items.findIndex(data => data.id === item.id)
        const newArray = [
            // destructure all items from beginning to the indexed item
            ...this.state.items.slice(0, itemIndex),
            // add the updated item to the array
            item,
            // add the rest of the items to the array from the index after the replaced item
            ...this.state.items.slice(itemIndex + 1)
        ]
        this.setState({ items: newArray })
    }

    deleteItemFromState = (id) => {
        const updatedItems = this.state.items.filter(item => item.id !== id)
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
                            <h1 style={{ margin: "20px 0" }}>Server List</h1>
                        </Col>
                    </Row>
                    <Row className="py-2">
                        <Col>
                            <ModalForm buttonLabel="Add Server" addItemToState={this.addItemToState} />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <DataTable items={this.state.items} updateState={this.updateState} deleteItemFromState={this.deleteItemFromState} />
                        </Col>
                    </Row>
                </Container>
                <ToastAlert show={this.state.toastShow} description={this.state.alertDescription}></ToastAlert>
            </div>
        )
    }
}

const mapStateToProps = (state) => state.admin;

export default connect(mapStateToProps)(ServerList);