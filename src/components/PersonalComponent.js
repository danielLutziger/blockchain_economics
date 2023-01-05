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
import {Col, Container, ListGroup, Row, Stack} from "react-bootstrap";
import {ethers} from "ethers";
import OptionItemComponent from "./OptionItemComponent";

class PersonalComponent extends Component{

    buyCallOption(id){
        this.props.buyCallOption(id);
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
                                        const item = {
                                            id: option.id.toNumber(),
                                            type: option.type,
                                            buyer : option.buyer,
                                            costToExercise: ethers.utils.formatEther(option.costToExercise),
                                            premium: ethers.utils.formatEther(option.premium),
                                            strike: ethers.utils.formatEther(option.strike),
                                            amount: ethers.utils.formatEther(option.tknAmt),
                                            seller: option.seller,
                                            expiration: new Date(option.expiry.toNumber() * 1000).toISOString().split('T')[0]
                                        }
                                        return (<OptionItemComponent item={item} key={item.id} layoutMode={this.props.layoutMode} buyCallOption={this.buyCallOption.bind(this)}/>)
                                    })
                                }
                            </ListGroup>
                        </Col>
                        <Col>

                            <ListGroup>
                                {
                                    buys.map((option) => {
                                        const item = {
                                            id: option.id.toNumber(),
                                            type: option.type,
                                            buyer : option.buyer,
                                            costToExercise: ethers.utils.formatEther(option.costToExercise),
                                            premium: ethers.utils.formatEther(option.premium),
                                            strike: ethers.utils.formatEther(option.strike),
                                            amount: ethers.utils.formatEther(option.tknAmt),
                                            seller: option.seller,
                                            expiration: new Date(option.expiry.toNumber() * 1000).toISOString().split('T')[0]
                                        }
                                        return (<OptionItemComponent item={item} key={item.id} layoutMode={this.props.layoutMode} buyCallOption={this.buyCallOption.bind(this)}/>)
                                    })
                                }
                            </ListGroup>
                        </Col>
                    </Row>
                </Stack>
            </Container>

        );
    }
} export default PersonalComponent;