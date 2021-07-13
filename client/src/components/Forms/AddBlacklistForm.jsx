import React from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { connect } from 'react-redux';
import ToastAlert from '../Toast/Toast';
import UserService from "../../services/user.service";

class AddBlacklistForm extends React.Component {
    state = {
        ID: 0,
        URL: '',
        toastShow: false,
        alertDescription: ""
    }

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value })
    }

    submitFormAdd = e => {
        e.preventDefault()
        UserService.addBlacklist(this.state.URL).then(
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
        UserService.editBlacklist(this.state.ID, this.state.URL).then(
            response => {
                console.log(response);
                if (response.data.status == "success") {
                    this.props.updateState({ ID: this.state.ID, URL: this.state.URL, created_at: this.props.item.created_at })
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
            const { ID, URL } = this.props.item
            this.setState({ ID, URL })
        }
    }

    render() {
        return (
            <div>
                <Form onSubmit={this.props.item ? this.submitFormEdit : this.submitFormAdd}>
                    <FormGroup>
                        <Label for="URL">URL</Label>
                        <Input type="text" name="URL" id="URL" onChange={this.onChange} value={this.state.URL === null ? '' : this.state.URL} />
                    </FormGroup>
                    <Button>Submit</Button>
                </Form>
                <ToastAlert show={this.state.toastShow} description={this.state.alertDescription}></ToastAlert>
            </div>
        );
    }
}
const mapStateToProps = (state) => state.admin;

export default connect(mapStateToProps)(AddBlacklistForm);