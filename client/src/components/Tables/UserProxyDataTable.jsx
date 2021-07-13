import React, { Component } from 'react'
import { Table, Button } from 'reactstrap'
import ModalForm from '../Modals/AddProxyModal'
import UserService from "../../services/user.service"

class DataTable extends Component {
    constructor(props) {
        super(props)
    }

    deleteItem = item => {
        let confirmDelete = window.confirm('Delete Proxy forever?')
        if (confirmDelete) {
            UserService.deleteUserProxy(item.ID).then(
                response => {
                    console.log(response);
                    if (response.data.status == "success") {
                        this.props.deleteItemFromState(item.ID)
                    } else {
                        console.log('failure')
                    }
                },
                error => {
                    console.log(error)
                }
            );
        }

    }

    render() {
        const items = this.props.items.map(item => {
            return (
                <tr key={item.ID}>
                    <th scope="row">{item.ID}</th>
                    <td>{item.IP}</td>
                    <td>{item.PORT}</td>
                    <td>{item.USERNAME}</td>
                    <td>{item.PASSWORD}</td>
                    <td>{item.DAYS}</td>
                    <td>{new Intl.DateTimeFormat("en-GB", {
                        year: "numeric",
                        month: "numeric",
                        day: "2-digit"
                    }).format(new Date(item.EDATE))}</td>
                    <td>
                        <div>
                            <ModalForm buttonLabel="Edit" item={item} updateState={this.props.updateState} userid={this.props.userid} />
                            {' '}
                            <Button color="danger" onClick={() => this.deleteItem(item)}>Del</Button>
                        </div>
                    </td>
                </tr>
            )
        })

        return (
            <Table responsive hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>IP Address</th>
                        <th>Port</th>
                        <th>Username</th>
                        <th>Password</th>
                        <th>Days</th>
                        <th>Expire Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {items}
                </tbody>
            </Table>
        )
    }
}
export default DataTable