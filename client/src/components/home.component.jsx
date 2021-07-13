import React, { Component } from "react";
import { Row, Col } from 'react-bootstrap';
import { StatsCard } from "./StatsCard/StatsCard.jsx";
import { Card } from "./Card/Card.jsx";
import ChartistGraph from "react-chartist";
import { connect } from 'react-redux';
import '../css/_cards.scss';
import "../sass/light-bootstrap-dashboard-react.scss?v=1.3.0";
import { FiRefreshCw, FiDatabase } from 'react-icons/fi';
import { FaEuroSign, FaUserAlt, FaClipboardList } from 'react-icons/fa';
import { Select, Form, FormGroup, Label, Input } from 'reactstrap';
import UserService from "../services/user.service";


class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: {},
            isVisible: false,
            months: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec"
            ],
            maxPrice: 0,
            prices: [],
            servers: []
        };
    }

    getServers() {
        UserService.getServers().then(
            response => {
                if (response.data.status == "success") {
                    this.setState({
                        servers: response.data.data
                    });
                }
            },
            error => {
                this.setState({
                    content:
                        (error.response && error.response.data) ||
                        error.message ||
                        error.toString()
                });
            }
        );
    }

    updateModal(isVisible) {
        this.state.isVisible = isVisible;
        this.forceUpdate();
    }

    onChangeServer = e => {
        localStorage.setItem('server', e.target.value);
        alert(localStorage.getItem('server'));
        this.getDashboardData();
        this.getServers();
    }

    componentDidMount() {
        this.getDashboardData();
        this.getServers();
    }

    getDashboardData() {
        UserService.getDashboardData().then(
            response => {
                this.setState({
                    content: response.data.data
                });
                let tempCount = 0;
                let tempArray = [];
                let maxPrice = 0;
                for (let i = 0; i < this.state.months.length; i++) {
                    if (response.data.data.price_list.length > 0) {
                        if (this.state.months[i] == response.data.data.price_list[tempCount].month) {
                            if (parseInt(response.data.data.price_list[tempCount].amount) > parseInt(maxPrice))
                                maxPrice = response.data.data.price_list[tempCount].amount;
                            tempArray.push(parseFloat(response.data.data.price_list[tempCount].amount));
                            tempCount++;
                            if (tempCount >= response.data.data.price_list.length)
                                break;
                        } else {
                            tempArray.push(0);
                        }
                    } else {
                        tempArray.push(0);
                    }
                }
                this.setState({ prices: tempArray, maxPrice: maxPrice });
            },
            error => {
                this.setState({
                    content:
                        (error.response && error.response.data) ||
                        error.message ||
                        error.toString()
                });
            }
        );
    }

    createLegend(json) {
        var legend = [];
        for (var i = 0; i < json["names"].length; i++) {
            var type = "fa fa-circle text-" + json["types"][i];
            legend.push(<i className={type} key={i} />);
            legend.push(" ");
            legend.push(json["names"][i]);
        }
        return legend;
    }

    render() {
        var dataSales = {
            labels: this.state.months,
            series: [
                this.state.prices
            ]
        };
        var optionsSales = {
            low: 0,
            high: this.state.maxPrice,
            showArea: false,
            height: "245px",
            axisX: {
                showGrid: false
            },
            axisY: {
                offset: 80,
                labelInterpolationFnc: function (value) {
                    return '€ ' + value
                },
                scaleMinSpace: 15
            },
            lineSmooth: true,
            showLine: true,
            showPoint: true,
            fullWidth: true,
            chartPadding: {
                right: 50
            }
        };
        var responsiveSales = [
            [
                "screen and (max-width: 640px)",
                {
                    axisX: {
                        labelInterpolationFnc: function (value) {
                            return value[0];
                        }
                    }
                }
            ]
        ];
        const servers = this.state.servers.map(item => {
            return (
                <option value={item.address}>{item.address}</option>
            )
        })
        return (
            <div className="container">
                <header className="jumbotron py-0">
                    <Row>
                        <FormGroup className="one-row col-lg-12">
                            <Label for="server" className="mr-20">Select Server</Label>
                            <Input type="select" name="server" id="server" className="width-60" onChange={this.onChangeServer}>
                                {servers}
                            </Input>
                        </FormGroup>
                    </Row>
                    <Row>
                        <Col lg={3} sm={6}>
                            <StatsCard
                                bigIcon={<FiDatabase className="d-flex text-warning" />}
                                statsText="Used Proxies"
                                statsValue={this.state.content.proxy_count}
                                statsIcon={<FiRefreshCw />}
                                statsIconText="Updated Now"
                            />
                        </Col>
                        <Col lg={3} sm={6}>
                            <StatsCard
                                bigIcon={<FaEuroSign className="d-flex text-success" />}
                                statsText="Total Amount"
                                statsValue={"€" + this.state.content.total_price}
                                statsIcon={<FiRefreshCw />}
                                statsIconText="Updated Now"
                            />
                        </Col>
                        <Col lg={3} sm={6}>
                            <StatsCard
                                bigIcon={<FaUserAlt className="d-flex text-danger" />}
                                statsText="Users"
                                statsValue={this.state.content.user_count}
                                statsIcon={<FiRefreshCw />}
                                statsIconText="Updated Now"
                            />
                        </Col>
                        <Col lg={3} sm={6}>
                            <StatsCard
                                bigIcon={<FaClipboardList className="d-flex text-info" />}
                                statsText="Available IPs"
                                statsValue={this.state.content.ip_count}
                                statsIcon={<FiRefreshCw />}
                                statsIconText="Updated Now"
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            <Card
                                statsIcon="fa fa-history"
                                id="chartHours"
                                title="Proxy Total Amount"
                                content={
                                    <div className="ct-chart">
                                        <ChartistGraph
                                            data={dataSales}
                                            type="Line"
                                            options={optionsSales}
                                            responsiveOptions={responsiveSales}
                                        />
                                    </div>
                                }
                            />
                        </Col>
                    </Row>
                </header>
            </div>
        );
    }
}

const mapStateToProps = (state) => state.admin;

export default connect(mapStateToProps)(Home);