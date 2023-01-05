import React, { Component } from 'react';
import {
    Container,
    Stack,
    Row,
    Card,
    Button,
    ButtonGroup,
    ToggleButton,
    InputGroup,
    Popover,
    Overlay, CardGroup
} from "react-bootstrap";
import Form from 'react-bootstrap/Form';

class OrderFormComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            model: {
                type: "Call",
                strikePrice: "",
                premium: "",
                expiration: "",
                tknAmnt: "",
                exercised: "",
                canceled: "",
                id: "",
                costToExercise: "",
                seller: "",
                buyer: "",
                showConnectionError: false,
                target: null
            }
        }
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

    executeOption(event){
        if (this.state.model.strikePrice > 0 &&  this.state.model.premium > 0
            && this.state.model.tknAmnt > 0 && new Date(this.state.model.expiration) > new Date(Date.now()) ){
            this.props.executeOption(this.state.model);
        } else {
            this.setState({showConnectionError: !this.state.showConnectionError, target: event.target});
        }
    }

    constructTransactionMessage(msg, status){
        return (
            <div>
                <p>{msg}</p>
                <p>Transaction Hash: {status}</p>
            </div>);
    }

    render() {
        const myStyle = {marginTop: "1rem", marginBottom: "1rem"}
        const radios = [
            { name: 'Sell Call Option', value: 'Call' },
            { name: 'Sell Put Option', value: 'Put' },
        ];

        const transactionMode = this.props.creationError ? "danger" : this.props.creationSuccess ? "success" : "";
        const transactionMessage = this.props.creationError ? this.constructTransactionMessage(this.props.creationError, this.props.transactionData)
            : this.props.creationSuccess ? this.constructTransactionMessage(this.props.creationSuccess, this.props.transactionData) : "";

        return (
            <Container>
                <Stack gap={3}>
                    <Row>
                        <h1>Provide options to the network</h1>
                    </Row>
                    <Row>
                        <Card bg={this.props.layoutMode}>
                            <Container>
                                <Row>
                                    <Form.Group style={myStyle}>
                                        <ButtonGroup
                                            style={{"width" : "100%"}}>
                                            {radios.map((radio, idx) => (
                                                <ToggleButton
                                                    key={idx}
                                                    id={`radio-${idx}`}
                                                    type="radio"
                                                    variant={idx % 2 ? 'outline-danger' : 'outline-success'}
                                                    name="type"
                                                    value={radio.value}
                                                    checked={this.state.model.type === radio.value}
                                                    onChange={(e) => this.inputChangeHandler(e.target.name, e.target.value)}>
                                                    {radio.name}
                                                </ToggleButton>
                                            ))}
                                        </ButtonGroup>
                                    </Form.Group>

                                    <InputGroup style={myStyle}>
                                        <InputGroup.Text id="inputGroup-sizing">Strike Price in USD</InputGroup.Text>
                                        <Form.Control
                                            aria-describedby="inputGroup-sizing-sm"
                                            placeholder="Enter your desired Strike Price"
                                            type="number"
                                            name="strikePrice"
                                            onChange={(e) => this.inputChangeHandler(e.target.name, e.target.value)}
                                        />
                                    </InputGroup>

                                    <InputGroup style={myStyle}>
                                        <InputGroup.Text id="inputGroup-sizing">Premium</InputGroup.Text>
                                        <Form.Control
                                            aria-describedby="inputGroup-sizing-sm"
                                            placeholder="Enter the desired premium for this offer"
                                            type="number"
                                            name="premium"
                                            onChange={(e) => this.inputChangeHandler(e.target.name, e.target.value)}
                                        />
                                    </InputGroup>

                                    <InputGroup style={myStyle}>
                                        <InputGroup.Text id="inputGroup-sizing">Expiration Date</InputGroup.Text>
                                        <Form.Control
                                            aria-describedby="inputGroup-sizing-sm"
                                            placeholder="Enter the expiration date"
                                            type="date"
                                            name="expiration"
                                            onChange={(e) => this.inputChangeHandler(e.target.name, e.target.value)}
                                        />
                                    </InputGroup>

                                    <InputGroup style={myStyle}>
                                        <InputGroup.Text id="inputGroup-sizing">ETH Amount</InputGroup.Text>
                                        <Form.Control
                                            aria-describedby="inputGroup-sizing-sm"
                                            placeholder="How many ETH do you want in the contract (10^18)"
                                            type="number"
                                            name="tknAmnt"
                                            onChange={(e) => this.inputChangeHandler(e.target.name, e.target.value)}
                                        />
                                    </InputGroup>

                                    <Button
                                        variant="outline-light"
                                        type="submit"
                                        style={myStyle}
                                        onClick={this.executeOption.bind(this)}
                                        disabled={this.props.walletAddress ? null : true}
                                    >
                                        Create {this.state.model.type} Option
                                    </Button>
                                    <Overlay
                                        show={this.state.showConnectionError}
                                        placement="bottom"
                                        containerPadding={20}
                                        target={this.state.target}
                                    >
                                        <Popover id="popover-contained">
                                            <Popover.Header as="h3"><span style={{"color":"black"}}>Request failed</span></Popover.Header>
                                            <Popover.Body >
                                                <p>Enter correct data. This means entering a date in the future, a positive amount of USD, ETH, and Premium</p>
                                            </Popover.Body>
                                        </Popover>
                                    </Overlay>
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
                        </Card>
                    </Row>
                </Stack>
            </Container>
        );
    }
}

export default OrderFormComponent;
