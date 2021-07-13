import React, { Component } from 'react'
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap'
import AddProxyForm from '../Forms/AddProxyForm'

class ProxyModalForm extends Component {
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
            title = 'Edit Proxy'
        } else {
            button = <Button
                color="success"
                onClick={this.toggle}
                style={{ float: "left", marginRight: "10px" }}>{label}
            </Button>
            title = 'Add Proxy'
        }


        return (
            <div>
                {button}
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle} close={closeBtn}>{title}</ModalHeader>
                    <ModalBody>
                        <AddProxyForm
                            addItemToState={this.props.addItemToState}
                            updateState={this.props.updateState}
                            toggle={this.toggle}
                            userid={this.props.userid}
                            item={this.props.item} />
                    </ModalBody>
                </Modal>
            </div>
        )
    }
}

export default ProxyModalForm
