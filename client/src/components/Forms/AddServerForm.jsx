import React from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { connect } from 'react-redux';
import ProgressButton from 'react-progress-button';
import ToastAlert from '../Toast/Toast';
import UserService from "../../services/user.service";
import '../../../node_modules/react-progress-button/react-progress-button.css';

class AddServerForm extends React.Component {
    state = {
        id: 0,
        address: '',
        password: '',
        tag: '',
        toastShow: false,
        buttonState: '',
        alertDescription: ""
    }

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value })
    }

    submitFormAdd = e => {
        e.preventDefault()
        this.setState({ buttonState: 'loading' });
        UserService.addServer(this.state.address, this.state.password, this.state.tag).then(
            response => {
                if (response.data.status == "success") {
                    this.props.addItemToState()
                    this.props.toggle()
                    this.setState({ buttonState: 'success' })
                } else {
                    this.setState({ buttonState: 'error' })
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
        UserService.editServer(this.state.id, this.state.address, this.state.password, this.state.tag).then(
            response => {
                if (response.data.status == "success") {
                    this.props.updateState({ id: this.state.id, address: this.state.address, password: this.state.password })
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

    componentDidMount() {
        // if item exists, populate the state with proper data
        if (this.props.item) {
            const { id, address, password, tag } = this.props.item
            this.setState({ id, address, password, tag })
        }
    }

    render() {
        return (
            <div>
                <Form onSubmit={this.props.item ? this.submitFormEdit : this.submitFormAdd}>
                    <FormGroup>
                        <Label for="address">Address</Label>
                        <Input type="text" name="address" id="address" onChange={this.onChange} value={this.state.address === null ? '' : this.state.address} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="password">Password</Label>
                        <Input type="text" name="password" id="password" onChange={this.onChange} value={this.state.password === null ? '' : this.state.password} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="tag">Tag</Label>
                        <Input type="text" name="tag" id="tag" onChange={this.onChange} value={this.state.tag === null ? '' : this.state.tag} />
                    </FormGroup>
                    <ProgressButton state={this.state.buttonState}>
                        Submit
                    </ProgressButton>
                </Form>
                <ToastAlert show={this.state.toastShow} description={this.state.alertDescription}></ToastAlert>
            </div>
        );
    }
}
const mapStateToProps = (state) => state.admin;

export default connect(mapStateToProps)(AddServerForm);