import React from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { connect } from 'react-redux';
import ToastAlert from '../Toast/Toast';
import UserService from "../../services/user.service";

class NotesForm extends React.Component {
    state = {
        notes: this.props.notes,
        toastShow: false,
        alertDescription: ""
    }

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value })
    }

    submitFormAdd = e => {
        e.preventDefault()
        UserService.setUserNotes(this.state.notes, this.props.userid).then(
            response => {
                console.log(response);
                if (response.data.status == "success") {
                    this.props.toggle()
                } else {
                    this.setState({ toastShow: true, alertDescription: response.data.status })
                    // this.props.toggle()
                }
            },
            error => {
                console.log(error)
            }
        );
    }

    render() {
        return (
            <div>
                <Form onSubmit={this.submitFormAdd}>
                    <FormGroup>
                        <Label for="notes">Edit Notes</Label>
                        <Input type="text" name="notes" id="notes" onChange={this.onChange} value={this.state.notes} />
                    </FormGroup>
                    <Button>Submit</Button>
                </Form>
                <ToastAlert show={this.state.toastShow} description={this.state.alertDescription}></ToastAlert>
            </div>
        );
    }
}
const mapStateToProps = (state) => state.admin;

export default connect(mapStateToProps)(NotesForm);