import React, { Component } from 'react'
import { Table, Button } from 'reactstrap';

class DataTable extends Component {
    render() {
        const items = this.props.items.map(item => {
            return (
                <tr key={item.id}>
                    <th scope="row">{item.id}</th>
                    <td>{item.username}</td>
                    <td>{item.content}</td>
                    <td>{item.type}</td>
                    <td>
                        {new Intl.NumberFormat("en-GB", {
                            style: "currency",
                            currency: "EUR"
                        }).format(item.amount)}
                    </td>
                    <td>
                        {new Intl.DateTimeFormat("en-GB", {
                            year: "numeric",
                            month: "long",
                            day: "2-digit"
                        }).format(new Date(item.created_at))}
                    </td>
                </tr>
            )
        })

        return (
            <Table responsive hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>User Name</th>
                        <th>Content</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Created Date</th>
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