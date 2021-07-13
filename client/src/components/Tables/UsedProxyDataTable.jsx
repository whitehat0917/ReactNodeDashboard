import React, { Component } from 'react'
import { Table, Button } from 'reactstrap';

class DataTable extends Component {
    render() {
        const items = this.props.items.map(item => {
            return (
                <tr key={item.ID}>
                    <th scope="row">{item.ID}</th>
                    <td>{item.IP}</td>
                    <td>{item.PORT}</td>
                    <td>{item.USERNAME}</td>
                    <td>{item.PASSWORD}</td>
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