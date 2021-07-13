import React from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { connect } from 'react-redux';
import ToastAlert from '../Toast/Toast';
import UserService from "../../services/user.service";

class MaxIpForm extends React.Component {
    state = {
        maxIp: this.props.multiIp,
        toastShow: false,
        alertDescription: ""
    }

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value })
    }

    submitFormAdd = e => {
        e.preventDefault()
        UserService.setMaxIp(this.state.maxIp).then(
            response => {
                console.log(response);
                if (response.data.status == "success") {
                    this.props.addItemToState({ maxIp: this.state.maxIp })
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
                        <Label for="maxIp">Max Ip Count</Label>
                        <Input type="number" name="maxIp" id="maxIp" onChange={this.onChange} value={this.state.maxIp} />
                    </FormGroup>
                    <Button>Submit</Button>
                </Form>
                <ToastAlert show={this.state.toastShow} description={this.state.alertDescription}></ToastAlert>
            </div>
        );
    }
}
const mapStateToProps = (state) => state.admin;

export default connect(mapStateToProps)(MaxIpForm);