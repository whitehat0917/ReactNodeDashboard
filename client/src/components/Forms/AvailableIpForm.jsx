import React from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { connect } from 'react-redux';
import UserService from "../../services/user.service";

class AddEditForm extends React.Component {
    state = {
        IPID: 0,
        IPADDRESS: '',
        count: '',
        subnet: ''
    }

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value })
    }

    submitFormAdd = e => {
        e.preventDefault()
        UserService.addIp(this.state.IPID, this.state.IPADDRESS, this.state.count, this.state.subnet).then(
            response => {
                console.log(response);
                if (response.data.status == "success") {
                    this.props.addItemToState({ IPID: this.state.IPID, IPADDRESS: this.state.IPADDRESS, SUBNET: this.state.subnet, MUL: this.props.multiIp, FREE_IP: this.props.multiIp })
                    this.props.toggle()
                } else {
                    // this.setState({ toastShow: true, alertDescription: response.data.status })
                    this.props.toggle()
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

    componentDidMount() {
        // if item exists, populate the state with proper data
        if (this.props.item) {
            const { IPID, IPADDRESS, SUBNET } = this.props.item
            this.setState({ IPID, IPADDRESS, SUBNET })
        }
    }

    render() {
        return (
            <Form onSubmit={this.props.item ? this.submitFormEdit : this.submitFormAdd}>
                <FormGroup>
                    <Label for="IPADDRESS">Start IP Address</Label>
                    <Input type="text" name="IPADDRESS" id="IPADDRESS" onChange={this.onChange} value={this.state.IPADDRESS === null ? '' : this.state.IPADDRESS} />
                </FormGroup>
                <FormGroup>
                    <Label for="count">Count</Label>
                    <Input type="number" name="count" id="count" onChange={this.onChange} />
                </FormGroup>
                <FormGroup>
                    <Label for="subnet">Subnet Address</Label>
                    <Input type="text" name="subnet" id="subnet" onChange={this.onChange} value={this.state.SUBNET === null ? '' : this.state.SUBNET} />
                </FormGroup>
                <Button>Submit</Button>
            </Form>
        );
    }
}
const mapStateToProps = (state) => state.admin;

export default connect(mapStateToProps)(AddEditForm);