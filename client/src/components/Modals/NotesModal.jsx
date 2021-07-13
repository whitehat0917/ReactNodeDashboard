import React, { Component } from 'react'
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap'
import NotesForm from '../Forms/NotesForm'

class NotesModalForm extends Component {
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
                onClick={this.toggle}>{label}
            </Button>
            title = 'Edit Item'
        } else {
            button = <Button
                color="warning"
                onClick={this.toggle}>{label}
            </Button>
            title = 'Notes'
        }

        return (
            <div style={{display: "inline-block"}}>
                {button}
                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle} close={closeBtn}>{title}</ModalHeader>
                    <ModalBody>
                        <NotesForm
                            userid={this.props.userid}
                            notes={this.props.notes}
                            toggle={this.toggle} />
                    </ModalBody>
                </Modal>
            </div>
        )
    }
}

export default NotesModalForm
