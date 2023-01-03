import React, { Component } from 'react';
import {Container, Stack, Row, Col, Card, Button, InputGroup, ButtonGroup, CardGroup } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import { linkTokenAddress } from "../utils/Constants"

class FaucetComponent extends Component {
    constructTransactionMessage(msg, status){
        return (
            <div>
                <p>{msg}</p>
                <p>Transaction Hash: {status}</p>
            </div>);
    }
    render() {
        const myStyle = {
            marginTop: "1rem",
            marginBottom: "1rem",
        }
        const transactionMode = this.props.withdrawError ? "danger" : this.props.withdrawSuccess ? "success" : "";
        const transactionMessage = this.props.withdrawError ? this.constructTransactionMessage(this.props.withdrawError, this.props.transactionData)
            : this.props.withdrawSuccess ? this.constructTransactionMessage(this.props.withdrawSuccess, this.props.transactionData) : "";
        return (
            <Container>
                <Stack gap={3}>
                    <Row style={myStyle}>
                        <Col xl>
                            <Card bg={this.props.layoutMode}>
                                <Card.Header><h4>LINK Token</h4></Card.Header>
                                <Card.Text>
                                    <Container>
                                        <Row style={myStyle}>
                                            <InputGroup size="lg">
                                                <InputGroup.Text id="inputGroup-sizing-lg">LINK Address</InputGroup.Text>
                                                <Form.Control
                                                    aria-label="Large"
                                                    aria-describedby="inputGroup-sizing-sm"
                                                    defaultValue={linkTokenAddress}
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
                                <Card.Header><h4>Faucet</h4></Card.Header>

                                <Card.Text>
                                    <Container>
                                        <Row>
                                            <InputGroup size="lg">
                                                <InputGroup.Text id="inputGroup-sizing-lg">Your Address</InputGroup.Text>
                                                <Form.Control
                                                    aria-label="Large"
                                                    aria-describedby="inputGroup-sizing-sm"
                                                    placeholder="Enter your wallet address (0x...) or connect your wallet"
                                                    defaultValue={this.props.walletAddress}
                                                />
                                        </InputGroup>
                                        </Row>
                                        <Row style={myStyle}>
                                            <ButtonGroup>
                                                <Button
                                                    variant={this.props.elementMode}
                                                    className="button is-link is-medium"
                                                    onClick={this.props.getOCTHandler}
                                                    size="lg"
                                                    disabled={!this.props.walletAddress}
                                                >
                                                    GET TOKENS
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

export default FaucetComponent;
