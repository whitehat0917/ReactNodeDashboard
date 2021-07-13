import React, { Component } from 'react'
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap'
import MaxIpForm from '../Forms/MaxIpForm'

class MaxModalForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modal: false
        }
    }

    toggle = () => {
        this.setState(prevState => ({
            modal: !prevState.modal
        }))
    }

    render() {
        const closeBtn = <button className="close" onClick={this.toggle}>&times;</button>

        const label = this.props.buttonLabel

        let button = ''
        let title = ''

        if (label === 'Edit') {
            button = <Button
                color="warning"
                onClick={this.toggle}
                style={{ float: "right", marginRight: "10px" }}>{label}
            </Button>
            title = 'Edit Item'
        } else {
            button = <Button
                color="info"
                onClick={this.toggle}
                style={{ float: "right", marginRight: "10px" }}>{label}
            </Button>
            title = 'Set Max Ip Count'
        }


        return (
            <div>
                {button}
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle} close={closeBtn}>{title}</ModalHeader>
                    <ModalBody>
                        <MaxIpForm
                            addItemToState={this.props.addItemToState}
                            toggle={this.toggle} />
                    </ModalBody>
                </Modal>
            </div>
        )
    }
}

export default MaxModalForm
