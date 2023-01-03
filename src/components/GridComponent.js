import { Component } from "react";
import { Container, Nav, Navbar, Button, Overlay, Popover } from "react-bootstrap";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// components
import HomeComponent from "./HomeComponent";
import FaucetComponent from "./FaucetComponent";
import OfferListComponent from "./OfferListComponent";
import OrderFormComponent from "./OrderFormComponent";
// contracts abi
import faucet from "../contracts/faucet/faucet";
import "../App.css";
import UZHBlockchain from '../UZHBlockchain.png'
import {ethers} from "ethers";


class Grid extends Component {

    constructor(props) {
        super(props);

        this.state = {
            layoutMode: "dark",
            elementMode: "outline-light",
            walletAddress: "",
            signer: "",
            faucet: null,
            withdrawError: "",
            withdrawSuccess: "",
            transactionData: "",
            showConnectionError: false,
            target: null
        };
    }

    async connectToWallet(event) {
        if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
            try {
                // get provider
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                // get accounts
                const accounts = await provider.send("eth_requestAccounts", []);
                // set values in the state
                this.setState({signer: provider.getSigner(), walletAddress: accounts[0], faucet: faucet(provider)});
            } catch (err) {
                console.error(err.message);
                this.setState({showConnectionError: !this.state.showConnectionError, target: event.target});
            }
        } else {
            /* MetaMask is not installed */
            console.log("Please install MetaMask");
            this.setState({showConnectionError: !this.state.showConnectionError, target: event.target});
        }
    }

    async getCurrentConnectedWallet(){
        if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
            try {
                // get provider
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                // get accounts
                const accounts = await provider.send("eth_requestAccounts", []);
                // set values in the state
                if (accounts.length > 0) {
                    this.setState({signer: provider.getSigner(), walletAddress: accounts[0], faucet: faucet(provider)});
                } else {
                    console.log("Connect to MetaMask using the Connect Wallet button")
                }
            } catch (err) {
                console.error(err.message);
            }
        } else {
            /* MetaMask is not installed */
            console.log("Please install MetaMask");
        }
    }

    componentDidMount (){
        if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
            window.ethereum.on("accountsChanged", (accounts) => {
                this.getCurrentConnectedWallet();
                this.setState({walletAddress: accounts[0]});
            });
        } else {
            /* MetaMask is not installed */
            this.setState({walletAddress: ""})
            console.log("Please install MetaMask");
        }
    };

    async getOCTHandler () {
        this.setState({withdrawError: "", withdrawSuccess: ""});
        try {
            const fcContractWithSigner = this.state.faucet.connect(this.state.signer);
            const resp = await fcContractWithSigner.requestTokens();
            console.log(resp.hash);
            this.setState({transactionData: resp.hash, withdrawSuccess: "Operation succeeded - it might take a minute or two but enjoy your tokens!"});
        } catch (err) {
            this.setState({withdrawError: err.message});
        }
    };

    render() {
        return (
            <Router>
                <div className="App">
                    <Navbar bg="dark" variant={this.state.layoutMode} expand="lg" sticky="top">
                        <Container>
                            <Navbar.Brand href="/">
                                <img
                                    alt="UZH Blockchain"
                                    src={UZHBlockchain}
                                    width="60"
                                    height="50"
                                    className="d-inline-block align-top" />{' '}
                            </Navbar.Brand>
                            <Navbar.Toggle aria-controls="basic-navbar-nav" />
                            <Navbar.Collapse id="basic-navbar-nav">
                                <Nav className="mr-auto">
                                    <Nav.Link href="/">Home</Nav.Link>
                                    <Nav.Link href="/faucet">Faucet</Nav.Link>
                                    <Nav.Link href="/order">Buy / sell options</Nav.Link>
                                    <Nav.Link href="/list">All Options</Nav.Link>
                                </Nav>
                            </Navbar.Collapse>
                            <Button className="justify-content-end" variant={this.state.elementMode} onClick={this.connectToWallet.bind(this)}>
                                Connect to you Wallet
                            </Button>
                            {/* handling exceptions when connecting */}
                            <Overlay
                                show={this.state.showConnectionError}
                                placement="bottom-end"
                                containerPadding={20}
                                target={this.state.target}
                            >
                                <Popover id="popover-contained">
                                    <Popover.Header as="h3"><span style={{"color":"black"}}>Connection failed</span></Popover.Header>
                                    <Popover.Body >
                                        <a href="https://metamask.zendesk.com/hc/en-us/articles/360015489471-How-to-Install-MetaMask-Manually"><strong>Install MetaMask</strong></a>
                                        <br /><p>Check this info.</p>

                                    </Popover.Body>
                                </Popover>
                            </Overlay>
                        </Container>
                    </Navbar>
                    <Routes>
                        <Route exact path='/' element={<HomeComponent />} />
                        <Route exact path='/faucet' element={<FaucetComponent faucet={this.state.faucet} withdrawError={this.state.withdrawError} withdrawSuccess={this.state.withdrawSuccess} walletAddress={this.state.walletAddress} getOCTHandler={this.getOCTHandler.bind(this)} transactionData={this.state.transactionData} elementMode={this.state.elementMode} layoutMode={this.state.layoutMode}/>} />
                        <Route exact path='/order' element={<OrderFormComponent />} />
                        <Route exact path='/list' element={<OfferListComponent />} />
                    </Routes>

                </div>
            </Router>
        );
    }
}

export default Grid;
