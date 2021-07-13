import React, { Component } from 'react'
import { Table, Button } from 'reactstrap';
import ModalForm from '../Modals/BlacklistModal';
import UserService from "../../services/user.service";

class BlacklistDataTable extends Component {

    deleteItem = item => {
        let confirmDelete = window.confirm('Delete URL forever?')
        if (confirmDelete) {
            UserService.deleteBlacklist(item.URL).then(
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
                <tr key={item.ID}>
                    <th scope="row">{item.ID}</th>
                    <td>{item.URL}</td>
                    <td>{new Intl.DateTimeFormat("en-GB", {
                        year: "numeric",
                        month: "long",
                        day: "2-digit"
                    }).format(new Date(item.created_at))}</td>
                    <td>
                        <div className="d-flex justify-content-center">
                            <ModalForm buttonLabel="Edit" item={item} updateState={this.props.updateState} />
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
                        <th>URL</th>
                        <th>Created At</th>
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
export default BlacklistDataTable