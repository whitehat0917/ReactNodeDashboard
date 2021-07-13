import React, { Component } from 'react'
import { Container, Row, Col } from 'reactstrap'
import ModalForm from './Modals/BlacklistModal'
import DataTable from './Tables/BlacklistDataTable'
import UserService from "../services/user.service"
import { connect } from 'react-redux'

class BlackList extends Component {
    state = {
        items: []
    }

    getItems() {
        UserService.getBlacklist().then(
            response => {
                if (response.data.status == "success") {
                    this.setState({
                        items: response.data.data
                    });
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

    componentDidMount() {
        this.getItems()
    }

    render() {
        return (
            <Container className="App">
                <Row>
                    <Col>
                        <h1 style={{ margin: "20px 0" }}>BlackList</h1>
                    </Col>
                </Row>
                <Row className="py-2">
                    <Col>
                        <ModalForm buttonLabel="Add Url" addItemToState={this.addItemToState} />
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

export default connect(mapStateToProps)(BlackList);