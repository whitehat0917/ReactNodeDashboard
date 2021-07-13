import React, { Component } from 'react'
import { Container, Row, Col, Button } from 'reactstrap'
import ModalForm from './Modals/AvailableIpModal'
import MaxModalForm from './Modals/MaxIpModal'
import DataTable from './Tables/AvailableIpDataTable'
import UserService from "../services/user.service"
import { connect } from 'react-redux';
import { setMultiIp } from '../store/actions'

class AvailableIpList extends Component {
    state = {
        items: []
    }

    getItems() {
        UserService.getAvailableIpList().then(
            response => {
                if (response.data.status == "success") {
                    this.setState({
                        items: response.data.data.data
                    });
                    this.props.dispatch(setMultiIp(response.data.data.mul));
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
        this.getItems();
        // this.setState(prevState => ({
        //     items: [...prevState.items, item]
        // }))
    }

    setMaxIpCount = (item) => {
        this.getItems();
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
        this.getItems();
        // const updatedItems = this.state.items.filter(item => item.IPID !== id)
        // this.setState({ items: updatedItems })
    }

    deleteAllItem = item => {
        let confirmDelete = window.confirm('Delete All IPs forever?')
        if (confirmDelete) {
            UserService.deleteAllIp().then(
                response => {
                    console.log(response);
                    if (response.data.status == "success") {
                        setTimeout(() => {
                            this.getItems();
                        }, 1000);
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
            <Container className="App">
                <Row>
                    <Col>
                        <h1 style={{ margin: "20px 0" }}>Available IP Address List</h1>
                    </Col>
                </Row>
                <Row className="py-2">
                    <Col>
                        <ModalForm buttonLabel="Add IP" addItemToState={this.addItemToState} />
                    </Col>
                    <Col>
                        <Button color="danger" style={{ float: "right" }} onClick={() => this.deleteAllItem()}>Delete All</Button>
                        <MaxModalForm style={{ float: "right", marginRight: "10px;" }} buttonLabel="Set Max IP Count" addItemToState={this.setMaxIpCount} />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <DataTable items={this.state.items} updateState={this.updateState} deleteItemFromState={this.deleteItemFromState} />
                    </Col>
                </Row>
            </Container>
        )
    }
}

const mapStateToProps = (state) => state.admin;

export default connect(mapStateToProps)(AvailableIpList);