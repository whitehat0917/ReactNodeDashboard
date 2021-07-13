import React, { Component } from 'react'
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap'
import AddServerForm from '../Forms/AddServerForm'

class ServerModalForm extends Component {
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
                style={{ float: "left", marginRight: "10px" }}>{label}
            </Button>
            title = 'Edit Server'
        } else {
            button = <Button
                color="success"
                onClick={this.toggle}
                style={{ float: "left", marginRight: "10px" }}>{label}
            </Button>
            title = 'Add Server'
        }


        return (
            <div>
                {button}
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle} close={closeBtn}>{title}</ModalHeader>
                    <ModalBody>
                        <AddServerForm
                            addItemToState={this.props.addItemToState}
                            updateState={this.props.updateState}
                            toggle={this.toggle}
                            item={this.props.item} />
                    </ModalBody>
                </Modal>
            </div>
        )
    }
}

export default ServerModalForm
