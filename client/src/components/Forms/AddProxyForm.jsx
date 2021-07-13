import React from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { connect } from 'react-redux';
import ToastAlert from '../Toast/Toast';
import UserService from "../../services/user.service";

class AddProxyForm extends React.Component {
    state = {
        ID: 0,
        PORT: this.getRandomPort(),
        DAYS: '',
        COUNT: '1',
        TYPE: false,
        SDATE: '',
        toastShow: false,
        alertDescription: ""
    }

    onChange = e => {
        if (e.target.name == "TYPE") {
            this.setState({ [e.target.name]: e.target.checked })
        } else {
            this.setState({ [e.target.name]: e.target.value })
        }
    }

    submitFormAdd = e => {
        e.preventDefault()
        UserService.addUserProxy(this.props.userid, this.state.PORT, this.state.DAYS, this.state.COUNT, this.state.TYPE, this.state.SDATE).then(
            response => {
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
        UserService.editUserProxy(this.state.ID, this.state.PORT, this.state.DAYS, this.state.TYPE, this.state.SDATE).then(
            response => {
                if (response.data.status == "success") {
                    this.props.addItemToState()
                    this.props.toggle()
                } else {
                    this.props.updateState({ ID: this.state.ID, IP: this.props.item.IP, PORT: this.state.PORT, USERNAME: this.props.item.USERNAME, PASSWORD: this.props.item.PASSWORD, DAYS: this.state.DAYS })
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
            const { ID, PORT, DAYS } = this.props.item
            this.setState({ ID, PORT, DAYS })
        }
    }

    getRandomPort() {
        let port = 0;
        while (port < 10000) {
            port = Math.floor(Math.random() * 16000) + 1;
        }
        return port;
    }

    render() {
        return (
            <div>
                <Form onSubmit={this.props.item ? this.submitFormEdit : this.submitFormAdd}>
                    <FormGroup>
                        <Label for="PORT">Port</Label>
                        <Input type="text" name="PORT" id="PORT" onChange={this.onChange} value={this.state.PORT === null ? '' : this.state.PORT} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="DAYS">Days</Label>
                        <Input type="number" name="DAYS" id="DAYS" onChange={this.onChange} value={this.state.DAYS === null ? '' : this.state.DAYS} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="COUNT">Count</Label>
                        <Input type="number" name="COUNT" id="COUNT" onChange={this.onChange} value={this.state.COUNT === null ? '' : this.state.COUNT} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="TYPE">Specific Date</Label>
                        <Input type="checkbox" className="form-control" style={{ position: 'relative', margin: 0, width: '25px' }} name="TYPE" id="TYPE" onChange={this.onChange} />
                    </FormGroup>
                    {
                        this.state.TYPE == true &&
                        <FormGroup>
                            <Label for="SDATE">Date</Label>
                            <Input type="date" className="form-control" name="SDATE" id="SDATE" onChange={this.onChange} value={this.state.SDATE === null ? '' : this.state.SDATE} />
                        </FormGroup>
                    }
                    <Button>Submit</Button>
                </Form>
                <ToastAlert show={this.state.toastShow} description={this.state.alertDescription}></ToastAlert>
            </div>
        );
    }
}
const mapStateToProps = (state) => state.admin;

export default connect(mapStateToProps)(AddProxyForm);