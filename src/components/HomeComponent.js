import { Component } from "react";
import {Container, Table, Row} from "react-bootstrap"
import "../App.css";


class Home extends Component {
    render() {
        const myStyle={marginTop: "2rem"}
        return (
            <Container>
                <Row>
                    <div><h1>Statement of intent</h1></div>
                </Row>
                <Row style={myStyle}>
                    <div>
                        This blockchain project focuses on utilizing Chainlink, a decentralized oracle network, to incorporate external data
                        sources into decentralized finance (DeFi) platforms. DeFi platforms provide alternative financial services without
                        the need for traditional intermediaries and are made possible through the integration of blockchain technology in
                        the financial sector. To achieve this goal, the project plans to set up a Chainlink node using Docker technology
                        and deploy its native token, Link, on the UZHETH network. A faucet contract will also be created to allow users
                        to obtain Link tokens, which can be used in future projects. Using these tokens, the project will develop a smart
                        contract for options trading that enables users to speculate on the price movements of ETHUZH. The smart contract
                        will feature a user-friendly interface and utilize a stablecoin called USDUZH, which is pegged to the US dollar and
                        collateralized by UZHETH. The project’s ultimate objective is to demonstrate the potential of Chainlink in DeFi
                        applications, specifically through developing a decentralized options trading platform and implementing a Chainlink
                        oracle to incorporate real-world data.
                    </div>
                </Row>
                <Row style={myStyle}>
                    <div>
                        <Table striped bordered hover variant="dark">
                            <thead>
                            <tr>
                                <th>Student #</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>17-706-706</td>
                                <td>Dennis</td>
                                <td>Shushack</td>
                            </tr>
                            <tr>
                                <td>15-703-341</td>
                                <td>Venusan</td>
                                <td>Velrajah</td>
                            </tr>
                            <tr>
                                <td>18-648-642</td>
                                <td>Daniel</td>
                                <td>Lutziger</td>
                            </tr>
                            </tbody>
                        </Table>
                    </div>
                </Row>


            </Container>
        );
    }
}

export default Home;
