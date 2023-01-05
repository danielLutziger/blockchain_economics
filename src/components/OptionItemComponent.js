import React, {Component} from "react"
import {ListGroup, Badge, Container, Row, Col, Button} from "react-bootstrap";

class OptionItemComponent extends Component{

    actionOption(event){
        // cannot buy your own option
        this.props.actionOption(event.target.id, event.target.name, this.props.item.amount);
    }


    render(){
        const myStyle = { textAlign: "left"}
        return(
            <ListGroup.Item
                as="li"
                className="d-flex justify-content-between align-items-start"
                variant={this.props.layoutMode}
            >
                <Container style={myStyle}>
                    <Row>
                        <Col style={myStyle}>
                            <div className="fw-bold">{this.props.item.type}-option</div>
                        </Col>
                        <Col xs={6}>
                            <Row>
                                <Col xs={3}>Strike: </Col>
                                <Col xs={9}>
                                    {this.props.item.strike} USDUZH
                                </Col>
                            </Row>
                            <Row style={myStyle}>
                                <Col xs={3}>Amount: </Col>
                                <Col xs={9}>
                                    {this.props.item.amount}
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={3}>Premium: </Col>
                                <Col xs={9}>
                                    {this.props.item.premium} USDUZH
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={3}>Expiration: </Col>
                                <Col xs={9}>
                                    {this.props.item.expiration}
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={3}>
                            <Row>
                                {
                                    Object.entries(this.props.itemStates).filter(e => e[1].bool).map((e) => {
                                        return (
                                            <div>
                                                <Badge bg={e[1].color} pill>
                                                    {e[1].text}
                                                </Badge>
                                            </div>
                                        )
                                    })
                                }
                            </Row>
                            <Row style={{"margin-top" : "20px"}}>
                                {!this.props.disabled &&
                                <span className="d-inline-block">
                                    <Button onClick={this.actionOption.bind(this)} id={this.props.item.id} name={this.props.item.type} variant={"success"} disabled={this.props.disabled} style={{"width": "100%"}}>
                                    {this.props.buttonText}
                                    </Button>
                                </span>
                                }
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={3}>

                        </Col>
                        <Col xs={9}>
                            {this.props.seller &&
                                <Row>
                                    <Col xs={2}>Seller:</Col>
                                    <Col xs={9}>{this.props.item.seller}</Col>
                                </Row>
                            }
                            {!this.props.seller &&
                                <Row>
                                    <Col xs={2}>Buyer:</Col>
                                    <Col xs={9}>{this.props.item.buyer}</Col>
                                </Row>
                            }
                        </Col>
                    </Row>
                </Container>
            </ListGroup.Item>
        )
    }

} export default OptionItemComponent;