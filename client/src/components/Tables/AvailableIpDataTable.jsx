import React, { Component } from 'react'
import { Table, Button } from 'reactstrap';
import ModalForm from '../Modals/AvailableIpModal';
import UserService from "../../services/user.service";

class DataTable extends Component {

    deleteItem = item => {
        let confirmDelete = window.confirm('Delete item forever?')
        if (confirmDelete) {
            UserService.deleteIp(item.IPADDRESS, 1, item.SUBNET).then(
                response => {
                    console.log(response);
                    if (response.data.status == "success") {
                        this.props.deleteItemFromState(item.id)
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
                <tr key={item.IPID}>
                    <th scope="row">{item.IPID}</th>
                    <td>{item.IPADDRESS}</td>
                    <td>{item.SUBNET}</td>
                    <td>{item.MUL}</td>
                    <td>{item.FREE_IP}</td>
                    <td>
                        <div>
                            {/* <ModalForm buttonLabel="Edit" item={item} updateState={this.props.updateState} /> */}
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
                        <th>Subnet IP Address</th>
                        <th>Multi Amount</th>
                        <th>Available Amount</th>
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