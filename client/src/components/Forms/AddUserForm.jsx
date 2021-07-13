import React from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { connect } from 'react-redux';
import ToastAlert from '../Toast/Toast';
import UserService from "../../services/user.service";

class AddUserForm extends React.Component {
    state = {
        USERID: 0,
        USERNAME: this.getRandomString(6),
        PASSWORD: this.getRandomString(8),
        toastShow: false,
        alertDescription: ""
    }

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value })
    }

    submitFormAdd = e => {
        e.preventDefault()
        UserService.addUser(this.state.USERNAME, this.state.PASSWORD).then(
            response => {
                console.log(response);
                if (response.data.status == "success") {
                    this.props.addItemToState()
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

    submitFormEdit = e => {
        e.preventDefault()
    }
    getRandomString(length) {
        var randomChars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        var result = '';
        for (var i = 0; i < length; i++) {
            result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
        }
        return result;
    }

    componentDidMount() {
        // if item exists, populate the state with proper data
        if (this.props.item) {
            const { USERID, USERNAME, PASSWORD } = this.props.item
            this.setState({ USERID, USERNAME, PASSWORD })
        }
    }

    render() {
        return (
            <div>
                <Form onSubmit={this.props.item ? this.submitFormEdit : this.submitFormAdd}>
                    <FormGroup>
                        <Label for="USERNAME">Username</Label>
                        <Input type="text" name="USERNAME" id="USERNAME" onChange={this.onChange} value={this.state.USERNAME === null ? '' : this.state.USERNAME} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="PASSWORD">Password</Label>
                        <Input type="text" name="PASSWORD" id="PASSWORD" onChange={this.onChange} value={this.state.PASSWORD === null ? '' : this.state.PASSWORD} />
                    </FormGroup>
                    <Button>Submit</Button>
                </Form>
                <ToastAlert show={this.state.toastShow} description={this.state.alertDescription}></ToastAlert>
            </div>
        );
    }
}
const mapStateToProps = (state) => state.admin;

export default connect(mapStateToProps)(AddUserForm);