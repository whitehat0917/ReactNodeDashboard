import React, { Component } from 'react';
import { Table, Button } from 'reactstrap';
import UserService from "../../services/user.service";

class DataTable extends Component {

    deleteItem = item => {
        let confirmDelete = window.confirm('Delete Server forever?')
        if (confirmDelete) {
            UserService.deleteServer(item.id).then(
                response => {
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
                <tr key={item.id}>
                    <th scope="row">{item.id}</th>
                    <td>{item.address}</td>
                    <td>{item.password}</td>
                    <td>{item.tag}</td>
                    <td>
                        <div>
                            <Button color="danger" onClick={() => this.deleteItem(item)}>Del</Button>
                        </div>
                    </td>
                </tr >
            )
        })

        return (
            <Table responsive hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Address</th>
                        <th>Password</th>
                        <th>Tag</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {items}
                </tbody>
            </Table >
        )
    }
}
export default DataTable