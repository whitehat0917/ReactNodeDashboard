import React, { Component } from 'react';
import { Table, Button } from 'reactstrap';
import { Link } from "react-router-dom";
import UserService from "../../services/user.service";
import NotesModalForm from '../Modals/NotesModal'

class DataTable extends Component {

    deleteItem = item => {
        let confirmDelete = window.confirm('Delete User forever?')
        if (confirmDelete) {
            UserService.deleteUser(item.USERID).then(
                response => {
                    if (response.data.status == "success") {
                        this.props.deleteItemFromState(item.USERID)
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

    downloadFile = userid => {
        UserService.downloadFile(userid);
    }

    

    render() {
        const items = this.props.items.map(item => {
            return (
                <tr key={item.USERID}>
                    <th scope="row">{item.USERID}</th>
                    <td>{item.USERNAME}</td>
                    <td>{item.PASSWORD}</td>
                    <td>{item.TYPE == 'R' ? 'Random' : 'Manual'}</td>
                    <td>{item.PROXY_COUNT}</td>
                    <td>
                        <div>
                            <Link to={'/userProxy/' + item.USERID}>
                                <Button color="success">Show</Button>
                            </Link>
                            {' '}
                            <Button color="danger" onClick={() => this.deleteItem(item)}>Del</Button>
                            {' '}
                            <Button color="info" onClick={() => this.downloadFile(item.USERID)}>Export</Button>
                            {' '}
                            <NotesModalForm buttonLabel="Notes" userid={item.USERID} notes={item.NOTES} />
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
                        <th>Username</th>
                        <th>Password</th>
                        <th>User Type</th>
                        <th>Proxy Count</th>
                        <th>Actions</th>
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