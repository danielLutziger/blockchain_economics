import React, { Component } from 'react';
import {Container, Stack, Row, Card} from "react-bootstrap";
import EthereumPriceChartComponent from "./EthereumPriceChartComponent";

import axios from "axios";

class OrderFormComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ethPriceData : []
        }
    }

    componentDidMount() {
        const ethData = JSON.parse(window.localStorage.getItem('ethData'));
        if (ethData && this.getDateForSeries(1) === new Date(ethData[0].data[ethData[0].data.length-1].x).toISOString().split('T')[0]) {
            this.setState({ethPriceData: ethData});
        } else {
            const options = {
                "headers": {'X-CoinAPI-Key': '0B18330A-C219-46D0-9550-4D61C25EDEDC'}
            }
            axios.get(`https://rest.coinapi.io/v1/exchangerate/ETH/USD/history?period_id=1DAY&time_start=${this.getDateForSeries(100)}T00:00:00&time_end=${this.getDateForSeries(0)}T00:00:00`, options)
                .then(res => {
                    let dataPoints = []
                    res.data.forEach(e => {
                        let datapointEntry = {
                            x: e.time_period_start,
                            y: [e.rate_open, e.rate_high, e.rate_low, e.rate_close]
                        }
                        dataPoints.push(datapointEntry);
                    });

                    this.setState({ethPriceData: [{data: dataPoints}]});
                    window.localStorage.setItem('ethData', JSON.stringify([{data: dataPoints}]));
            });
        }
    }

    getDateForSeries(subDays){
        let date = new Date();
        date.setDate(date.getDate() - subDays);
        return date.toISOString().split('T')[0];
    }

    render() {
        return (
            <Container>
                <Stack gap={3}>
                    <Row>
                        <Card bg={this.props.layoutMode}>
                            <EthereumPriceChartComponent ethPriceData={this.state.ethPriceData}/>
                        </Card>
                    </Row>
                </Stack>
            </Container>
        );
    }
}

export default OrderFormComponent;
