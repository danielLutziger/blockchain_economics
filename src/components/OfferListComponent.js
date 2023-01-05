import React, { Component } from 'react';
import {Col, ListGroup, Container, Row, Stack, Modal, Button} from "react-bootstrap";
import {ethers} from "ethers";
import OptionItemComponent from "./OptionItemComponent";
import {emptyAddress} from "../utils/Constants";

class OfferListComponent extends Component {

    buyCallOption(id, type){
        this.props.buyCallOption(id, type);
    }
    render() {
        const filteredCalls = this.props.allCallOptions.filter(e => {return (e.buyer === emptyAddress && !e.canceled && !e.exercised && new Date(e.expiry.toNumber() * 1000) > Date.now())});
        const filteredPuts = this.props.allPutOptions.filter(e => {return (e.buyer === emptyAddress && !e.canceled && !e.exercised && new Date(e.expiry.toNumber() * 1000) > Date.now())});
        return (
            <Container>
                <Stack gap={3}>
                    <Row>
                        <Col>
                            <h1> Call Options for Sale </h1>
                        </Col>
                        <Col>
                            <h1> Put Options for Sale </h1>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <ListGroup>
                                {
                                    filteredCalls.map((option) => {
                                        const item = {
                                            id: option.id.toNumber(),
                                            type: "Call",
                                            buyer : option.buyer,
                                            costToExercise: ethers.utils.formatEther(option.costToExercise),
                                            premium: ethers.utils.formatEther(option.premium),
                                            strike: ethers.utils.formatEther(option.strike),
                                            amount: ethers.utils.formatEther(option.tknAmt),
                                            seller: option.seller,
                                            expiration: new Date(option.expiry.toNumber() * 1000).toISOString().split('T')[0]
                                        }
                                        const disabled = this.props.walletAddress.toLowerCase() === item.seller.toLowerCase() //|| this.props.usdBalance < this.props.item.premium

                                        return (<OptionItemComponent item={item} key={item.id} layoutMode={this.props.layoutMode} walletAddress={this.props.walletAddress} actionOption={this.buyCallOption.bind(this)} buttonText={"Buy"} disabled={disabled}/>)
                                    })
                                }
                            </ListGroup>
                        </Col>
                        <Col>

                            <ListGroup>
                                {
                                    filteredPuts.map((option) => {
                                        const item = {
                                            id: option.id.toNumber(),
                                            type: "Put",
                                            buyer : option.buyer,
                                            costToExercise: ethers.utils.formatEther(option.costToExercise),
                                            premium: ethers.utils.formatEther(option.premium),
                                            strike: ethers.utils.formatEther(option.strike),
                                            amount: ethers.utils.formatEther(option.tknAmt),
                                            seller: option.seller,
                                            expiration: new Date(option.expiry.toNumber() * 1000).toISOString().split('T')[0]
                                        }
                                        const disabled = this.props.walletAddress.toLowerCase() === item.seller.toLowerCase() //|| this.props.usdBalance < this.props.item.premium
                                        return (<OptionItemComponent item={item} key={item.id} layoutMode={this.props.layoutMode} walletAddress={this.props.walletAddress} usdBalance={this.props.usdBalance} actionOption={this.buyCallOption.bind(this)} buttonText={"Buy"} disabled={disabled}/>)
                                    })
                                }
                            </ListGroup>
                        </Col>
                    </Row>
                </Stack>
                <Modal show={this.props.showModal} onHide={this.props.hideModal} style={{"color": "black"}}>
                    <Modal.Header closeButton>
                        <Modal.Title>Transaction</Modal.Title>
                    </Modal.Header><Modal.Body><p>{this.props.modalMsg}</p>
                    <p>This is the transaction hash: <span style={{"font-size" : "13px"}}>{this.props.transactionData}</span></p></Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.props.hideModal}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>

        );
    }
}

export default OfferListComponent;
