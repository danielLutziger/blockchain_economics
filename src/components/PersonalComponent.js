/**
 * similar component to offerlistcomponent => show bought and sold options
 *
 * 2 tabs => bought | sold
 * bought: show all bought options
 * for calls:
 *  - cost to exercise
 * - exercise button
 * for puts:
 * - token amount
 * - exercise button
 */

import React, {Component} from "react";
import {Col, Container, ListGroup, Row, Stack, Modal, Button} from "react-bootstrap";
import {ethers} from "ethers";
import OptionItemComponent from "./OptionItemComponent";
import {emptyAddress} from "../utils/Constants";

class PersonalComponent extends Component{

    executeOption(id, type, amount, premium, costToExercise){
        this.props.executeOption(id, type, amount, premium, costToExercise);
    }

    cancelOption(id, type){
        this.props.cancelOption(id, type);
    }

    objectOfInterest(e, type){
        return {
            buyer: e.buyer,
            canceled: e.canceled,
            costToExercise: e.costToExercise,
            exercised: e.exercised,
            expiry: e.expiry,
            id: e.id,
            premium: e.premium,
            seller: e.seller,
            strike: e.strike,
            tknAmt: e.tknAmt,
            type: type
        }
    }

    render() {
        const filteredSellsCalls = this.props.allCallOptions.filter(e => e.seller.toLowerCase() === this.props.walletAddress.toLowerCase()).map(e => this.objectOfInterest(e, "Call"));
        const filteredSellsPuts = this.props.allPutOptions.filter(e => e.seller.toLowerCase() === this.props.walletAddress.toLowerCase()).map(e => this.objectOfInterest(e, "Put"));
        const filteredBuysCalls = this.props.allCallOptions.filter(e => e.buyer.toLowerCase() === this.props.walletAddress.toLowerCase()).map(e => this.objectOfInterest(e, "Call"));
        const filteredBuysPuts = this.props.allPutOptions.filter(e => e.buyer.toLowerCase() === this.props.walletAddress.toLowerCase()).map(e => this.objectOfInterest(e, "Put"));
        const sells = filteredSellsCalls.concat(filteredSellsPuts);
        const buys = filteredBuysCalls.concat(filteredBuysPuts);


        return (
            <Container>
                <Stack gap={3}>
                    <Row>
                        <Col>
                            <h1> Options sold </h1>
                        </Col>
                        <Col>
                            <h1> Options bought </h1>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <ListGroup>
                                {
                                    sells.map((option) => {

                                        const  date = new Date(option.expiry.toNumber() * 1000).toISOString().split('T')
                                        let day = date[0]
                                        let time = date[1].split(':', 2)

                                        const item = {
                                            id: option.id.toNumber(),
                                            type: option.type,
                                            buyer : option.buyer,
                                            costToExercise: ethers.utils.formatEther(option.costToExercise),
                                            premium: ethers.utils.formatEther(option.premium),
                                            strike: ethers.utils.formatEther(option.strike),
                                            amount: ethers.utils.formatEther(option.tknAmt),
                                            seller: option.seller,
                                            expiration: day +' - ' + time[0] + ':' + time[1],
                                            exercised: option.exercised
                                        }

                                        const itemStates = {
                                            expired: {
                                                bool: new Date(option.expiry.toNumber() * 1000) < Date.now(),
                                                text: "Expired",
                                                color: new Date(option.expiry.toNumber() * 1000) < Date.now() ? "success" : "info"
                                            },
                                            cancelled: {
                                                bool: option.canceled,
                                                text: "Cancelled",
                                                color: option.canceled ? "success" : "info"
                                            },
                                            exercised: {
                                                bool: option.exercised,
                                                text: "Exercised",
                                                color: option.exercised ? "danger" : "info"
                                            },
                                            buyer: {
                                                bool: item.buyer && !option.exercised,
                                                text: item.buyer === emptyAddress ? "No buyer" : "Bought",
                                                color: item.buyer === emptyAddress ? "info" : new Date(option.expiry.toNumber() * 1000) < Date.now() ? "success" : "warning"
                                            }
                                        }

                                        const disabled = (item.buyer !== emptyAddress && new Date(option.expiry.toNumber() * 1000) > Date.now()) || option.canceled || item.exercised
                                        const validationMsg = "You cannot cancel the option because: \n- The option already bought\n- The option was already cancelled\n- The option's expiration date is in the past"
                                        return (<OptionItemComponent itemStates={itemStates} date={option.expiry.toNumber() * 1000} seller={false} item={item} key={item.id} validationMsg={validationMsg} layoutMode={this.props.layoutMode} actionOption={this.cancelOption.bind(this)} walletAddress={this.props.walletAddress} buttonText={"Cancel"} disabled={disabled}/>)
                                    })
                                }
                            </ListGroup>
                        </Col>
                        <Col>

                            <ListGroup>
                                {
                                    buys.map((option) => {

                                        const  date = new Date(option.expiry.toNumber() * 1000).toISOString().split('T')
                                        let day = date[0]
                                        let time = date[1].split(':', 2)

                                        const item = {
                                            id: option.id.toNumber(),
                                            type: option.type,
                                            buyer : option.buyer,
                                            costToExercise: ethers.utils.formatEther(option.costToExercise),
                                            premium: ethers.utils.formatEther(option.premium),
                                            strike: ethers.utils.formatEther(option.strike),
                                            amount: ethers.utils.formatEther(option.tknAmt),
                                            seller: option.seller,
                                            expiration: day +' - ' + time[0] + ':' + time[1],
                                            exercised: option.exercised
                                        }

                                        const validationMsg = "You cannot execute the option because: \n- The option already expired\n- The option was already exercised"

                                        const itemStates = {
                                            expired: {
                                                bool: new Date(option.expiry.toNumber() * 1000) < Date.now(),
                                                text: "Expired",
                                                color: new Date(option.expiry.toNumber() * 1000) < Date.now() ? "danger" : "info"
                                            },
                                            cancelled: {
                                                bool: option.canceled,
                                                text: "Cancelled",
                                                color: "info"
                                            },
                                            exercised: {
                                                bool: option.exercised,
                                                text: "Exercised",
                                                color: option.exercised ? "danger" : "info"
                                            },
                                            buyer: {
                                                bool: item.buyer === emptyAddress,
                                                text: "No buyer",
                                                color: item.buyer === emptyAddress ? "info" : new Date(option.expiry.toNumber() * 1000) < Date.now() ? "success" : "warning"
                                            },
                                            funds: {
                                                bool: new Date(option.expiry.toNumber() * 1000) > Date.now() && !option.exercised && parseInt(this.props.usdBalance, 10) < parseInt(ethers.utils.formatEther(option.strike), 10),
                                                text: "Not enough funds",
                                                color: "warning"
                                            },
                                        }
                                        const disabled = new Date(option.expiry.toNumber() * 1000) < Date.now() || item.exercised || parseInt(this.props.usdBalance, 10) < parseInt(ethers.utils.formatEther(option.strike), 10)
                                        return (<OptionItemComponent itemStates={itemStates} date={option.expiry.toNumber() * 1000} seller={true} item={item} key={item.id} layoutMode={this.props.layoutMode} validationMsg={validationMsg} actionOption={this.executeOption.bind(this)} walletAddress={this.props.walletAddress} buttonText={"Exercise"} disabled={disabled}/>)
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
} export default PersonalComponent;