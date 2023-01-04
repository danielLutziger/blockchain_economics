import React, {Component} from "react"
import {ListGroup, Badge, Container, Row, Col, Button} from "react-bootstrap";

class OptionItemComponent extends Component{
    buyCallOption(event){
        this.props.buyCallOption(event.target.id);
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
                                <Col xs={3}>Cost: </Col>
                                <Col xs={9}>
                                    {this.props.item.costToExercise} (Call: USDUZH | Put UZHETH)
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={3}>
                            <Row>
                                <Badge bg="danger" pill>
                                    Expiration date:<br /> {this.props.item.expiration}
                                </Badge>
                            </Row>
                            <Row style={{"margin-top" : "20px"}}>
                                <Button onClick={this.buyCallOption.bind(this)} id={this.props.item.id} name={this.props.item.id} variant={"success"}>
                                    Buy
                                </Button>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={3}>

                        </Col>
                        <Col xs={9}>
                            <Row>
                                <Col xs={2}>Seller:</Col>
                                <Col xs={9}>{this.props.item.seller}</Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </ListGroup.Item>
        )
    }

} export default OptionItemComponent;