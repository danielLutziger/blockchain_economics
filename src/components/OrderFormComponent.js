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
    Overlay
} from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import EthereumPriceChartComponent from "./EthereumPriceChartComponent";

class OrderFormComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            model: {
                type: "CALL",
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
            && this.state.model.tknAmnt > 0 && this.state.model.expiration > Date.now() ){
            this.props.executeOption();
        } else {
            this.setState({showConnectionError: !this.state.showConnectionError, target: event.target});
        }
    }

    render() {
        const myStyle = {marginTop: "1rem", marginBottom: "1rem"}
        const radios = [
            { name: 'Sell Call Option', value: 'CALL' },
            { name: 'Sell Put Option', value: 'PUT' },
        ];

        return (
            <Container>
                <Stack gap={3}>
                    <Row>
                        <h1>Provide options to the network</h1>
                    </Row>
                    <Row>
                        <Card bg={this.props.layoutMode}>
                            <Form.Group style={myStyle}>
                                <ButtonGroup
                                    style={{"width" : "100%"}}>
                                    {radios.map((radio, idx) => (
                                        <ToggleButton
                                            key={idx}
                                            id={`radio-${idx}`}
                                            type="radio"
                                            variant={idx % 2 ? 'outline-warning' : 'outline-info'}
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
                                />
                            </InputGroup>

                            <InputGroup style={myStyle}>
                                <InputGroup.Text id="inputGroup-sizing">Premium</InputGroup.Text>
                                <Form.Control
                                    aria-describedby="inputGroup-sizing-sm"
                                    placeholder="Enter the desired premium for this offer"
                                    type="number"
                                />
                            </InputGroup>

                            <InputGroup style={myStyle}>
                                <InputGroup.Text id="inputGroup-sizing">Expiration Date</InputGroup.Text>
                                <Form.Control
                                    aria-describedby="inputGroup-sizing-sm"
                                    placeholder="Enter the expiration date"
                                    type="date"
                                />
                            </InputGroup>

                            <InputGroup style={myStyle}>
                                <InputGroup.Text id="inputGroup-sizing">ETH Amount</InputGroup.Text>
                                <Form.Control
                                    aria-describedby="inputGroup-sizing-sm"
                                    placeholder="How many ETH do you want in the contract (10^18)"
                                    type="number"
                                />
                            </InputGroup>

                            <Button variant="primary" type="submit" style={myStyle} onClick={this.executeOption.bind(this)}>
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
                        </Card>
                    </Row>
                    <Row>
                        <Card bg={this.props.layoutMode}>
                            <EthereumPriceChartComponent ethPriceData={this.props.ethPriceData}/>
                        </Card>
                    </Row>
                </Stack>
            </Container>
        );
    }
}

export default OrderFormComponent;
