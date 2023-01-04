import React, { Component } from 'react';
import {Container, Stack, Row, Col, Card, Button, InputGroup, ButtonGroup, CardGroup } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import {usdTokenAddress} from "../utils/Constants"

class USDExchangeComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            model: {
                exchangeAmount: "",
                showConnectionError: false,
                target: null
            }
        }
    }

    constructTransactionMessage(msg, status){
        return (
            <div>
                <p>{msg}</p>
                <p>Transaction Hash: {status}</p>
            </div>);
    }

    inputChangeHandler = (name, value) => {
        var curr_model = { ...this.state.model }
        if (name in curr_model && (value === false || value === '')) {
            delete curr_model[name]
        } else {
            curr_model[name] = value
        }
        this.setState({ model: curr_model })
    }

    executeOrder(event){
        if (this.state.model.exchangeAmount >= 1 ){
            this.props.executeOrder(this.state.model);
        } else {
            this.setState({showConnectionError: !this.state.showConnectionError, target: event.target});
        }
    }

    render() {
        const myStyle = {
            marginTop: "1rem",
            marginBottom: "1rem",
        }
        const transactionMode = this.props.orderError ? "danger" : this.props.orderSuccess ? "success" : "";
        const transactionMessage = this.props.orderError ? this.constructTransactionMessage(this.props.orderError, this.props.transactionData)
            : this.props.orderSuccess ? this.constructTransactionMessage(this.props.orderSuccess, this.props.transactionData) : "";
        return (
            <Container>
                <Stack gap={3}>
                    <Row style={myStyle}>
                        <Col xl>
                            <Card bg={this.props.layoutMode}>
                                <Card.Header><h4>USD Token</h4></Card.Header>
                                <Card.Text>
                                    <Container>
                                        <Row style={myStyle}>
                                            <InputGroup size="lg">
                                                <InputGroup.Text id="inputGroup-sizing-lg">USD Address</InputGroup.Text>
                                                <Form.Control
                                                    aria-label="Large"
                                                    aria-describedby="inputGroup-sizing-sm"
                                                    defaultValue={usdTokenAddress}
                                                    disabled={true}
                                                />
                                            </InputGroup>
                                        </Row>
                                    </Container>
                                </Card.Text>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col xl>
                            <Card bg={this.props.layoutMode}>
                                <Card.Header><h4>USD Exchange</h4></Card.Header>

                                <Card.Text>
                                    <Container>
                                        <Row>
                                            <InputGroup style={myStyle}>
                                                <InputGroup.Text id="inputGroup-sizing" size="lg">Exchange ETH into USDUZH</InputGroup.Text>
                                                <Form.Control
                                                    aria-label="Large"
                                                    aria-describedby="inputGroup-sizing-sm"
                                                    placeholder="Exchange ETH into USDUZH"
                                                    type="number"
                                                    name="exchangeAmount"
                                                    onChange={(e) => this.inputChangeHandler(e.target.name, e.target.value)}
                                                />
                                            </InputGroup>
                                        </Row>
                                        <Row style={myStyle}>
                                            <ButtonGroup>
                                                <Button
                                                    variant={this.props.elementMode}
                                                    className="button is-link is-medium"
                                                    onClick={this.executeOrder.bind(this)}
                                                    size="lg"
                                                    disabled={!this.props.walletAddress}
                                                >
                                                    Exchange Token
                                                </Button>
                                            </ButtonGroup>
                                        </Row>
                                        {
                                            transactionMode &&
                                            <Row style={myStyle}>

                                                <CardGroup>
                                                    <Card bg={transactionMode}>
                                                        <Card.Header><h5>Transaction details</h5></Card.Header>
                                                        <Card.Text>
                                                            {transactionMessage}
                                                        </Card.Text>
                                                    </Card>
                                                </CardGroup>

                                            </Row>

                                        }
                                    </Container>
                                </Card.Text>
                            </Card>
                        </Col>
                    </Row>
                </Stack>
            </Container>

        );
    }
}

export default USDExchangeComponent;
