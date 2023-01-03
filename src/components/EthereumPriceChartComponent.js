import React, { Component } from "react";
import Chart from "react-apexcharts";

class EthereumPriceChartComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            options : {
                theme: {
                    mode: 'dark',
                },
                chart: {
                    id: "basic-bar",
                },
                xaxis: {
                    type: 'datetime'
                },
                yaxis: {
                    tooltip: {
                        enabled: true
                    }
                },
            },
        }
    }

    render() {
        return (
            <Chart
                options={this.state.options}
                series={this.props.ethPriceData}
                width="500"
                type={"candlestick"}
                style={{"color":"black"}}
            />
        );
    }
}

export default EthereumPriceChartComponent;