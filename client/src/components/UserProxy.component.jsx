import React, { Component } from 'react'
import { Container, Row, Col } from 'reactstrap'
import DataTable from './Tables/UserProxyDataTable'
import UserService from "../services/user.service"
import { connect } from 'react-redux'
import { Button } from 'reactstrap'
import ToastAlert from './Toast/Toast'
import ModalForm from './Modals/AddProxyModal'

class UserList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            toastShow: false
        }
    }
    getItems() {
        UserService.getUserProxy(this.props.match.params.id).then(
            response => {
                if (response.data.status == "success") {
                    this.setState({
                        items: response.data.data
                    });
                } else {
                    this.setState({ toastShow: true, alertDescription: response.status })
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
        const itemIndex = this.state.items.findIndex(data => data.ID === item.ID)
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
        const updatedItems = this.state.items.filter(item => item.ID !== id)
        this.setState({ items: updatedItems })
    }

    deleteAllItem = item => {
        let confirmDelete = window.confirm('Delete All Proxy forever?')
        if (confirmDelete) {
            UserService.deleteUserAllProxy(this.props.match.params.id).then(
                response => {
                    console.log(response);
                    if (response.data.status == "success") {
                        this.getItems();
                    } else {
                        console.log('failure')
                    }
                },
                error => {
                    console.log(error)
                }
            );
        }

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
                            <h1 style={{ margin: "20px 0" }}>User Proxy List</h1>
                        </Col>
                    </Row>
                    <Row className="py-2">
                        <Col>
                            <ModalForm buttonLabel="Add Proxy" addItemToState={this.addItemToState} userid={this.props.match.params.id} />
                        </Col>
                        <Col>
                            <Button color="danger" style={{ float: "right" }} onClick={() => this.deleteAllItem()}>Delete All</Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <DataTable items={this.state.items} updateState={this.updateState} deleteItemFromState={this.deleteItemFromState} userid={this.props.match.params.id} />
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