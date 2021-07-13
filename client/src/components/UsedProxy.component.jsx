import React, { Component } from 'react'
import { Container, Row, Col } from 'reactstrap'
import DataTable from './Tables/UsedProxyDataTable'
import UserService from "../services/user.service"
import { connect } from 'react-redux';

class UsedProxy extends Component {
    state = {
        items: []
    }

    getItems() {
        UserService.getUsedProxy().then(
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

    componentDidMount() {
        this.getItems()
    }

    render() {
        return (
            <Container className="App">
                <Row>
                    <Col>
                        <h1 style={{ margin: "20px 0" }}>Used Proxy List</h1>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <DataTable items={this.state.items} />
                    </Col>
                </Row>
            </Container>
        )
    }
}

const mapStateToProps = (state) => state.admin;

export default connect(mapStateToProps)(UsedProxy);