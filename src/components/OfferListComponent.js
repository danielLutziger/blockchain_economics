import React, { Component } from 'react';
import {Col, ListGroup, Container, Row, Stack} from "react-bootstrap";
import {ethers} from "ethers";
import OptionItemComponent from "./OptionItemComponent";
import {emptyAddress} from "../utils/Constants";

class OfferListComponent extends Component {

    buyCallOption(id){
        this.props.buyCallOption(id);
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
                                        return (<OptionItemComponent item={item} key={item.id} layoutMode={this.props.layoutMode} buyCallOption={this.buyCallOption.bind(this)}/>)
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
}

export default OfferListComponent;
