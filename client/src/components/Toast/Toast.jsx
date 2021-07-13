import React, { Component, useState } from 'react'
import { Container, Row, Col } from 'reactstrap'
import Toast from 'react-bootstrap/Toast'
// import ToastHeader from 'react-bootstrap/ToastHeader'
// import ToastBody from 'react-bootstrap/ToastBody'
// import { useState } from 'react-dom'
class ToastAlert extends Component {
    constructor(props) {
        super(props)
        this.state = {
            show: true
        }
    }

    toggle = () => {
        this.setState({ show: false })
    }

    render() {
        let show = this.props.show;
        if (this.state.show == false)
            show = false;
        return (
            <div className="container fixed-top ml-0" style={{ left: 0 }} >
                <Toast onClose={this.toggle} show={show} delay={100000} autohide >
                    <Toast.Header >
                        <strong className="mr-auto" > Alert </strong>
                    </Toast.Header>
                    <Toast.Body > {this.props.description} </Toast.Body>
                </Toast >
            </div>
        )
    }
}

export default ToastAlert;