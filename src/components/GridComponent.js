import { Component } from "react";
import { Container, Nav, Navbar, Button, Overlay, Popover } from "react-bootstrap";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// components
import HomeComponent from "./HomeComponent";
import FaucetComponent from "./FaucetComponent";
import OfferListComponent from "./OfferListComponent";
import OrderFormComponent from "./OrderFormComponent";
import USDExchangeComponent from "./USDExchangeComponent";
import PersonalComponent from "./PersonalComponent";
// contracts abi
import options from "../contracts/options/options"
import faucet from "../contracts/faucet/faucet";
import "../App.css";
import UZHBlockchain from '../UZHBlockchain.png'
import {ethers} from "ethers";
import axios from "axios";
import usdUZHContract from "../contracts/usduzh/usduzh";


class Grid extends Component {

    constructor(props) {
        super(props);

        this.state = {
            layoutMode: "dark",
            elementMode: "outline-light",
            walletAddress: "",
            signer: "",
            faucet: null,
            options: null,
            withdrawError: "",
            withdrawSuccess: "",
            creationError: "",
            creationSuccess: "",
            orderError: "",
            buttonConnection: "Connect to you Wallet",
            orderSuccess: "",
            transactionData: "",
            showConnectionError: false,
            ethPriceData: [],
            allCallOptions: [],
            allPutOptions: [],
            currentUSDETHPrice: 0,
            balance: 0,
            target: null,
            showModal: false,
            modalMsg: ""
        };
    }

    getDateForSeries(subDays){
        let date = new Date();
        date.setDate(date.getDate() - subDays);
        return date.toISOString().split('T')[0];
    }

    async connectToWallet(event) {
        if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
            try {
                // get provider
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                // get accounts
                const accounts = await provider.send("eth_requestAccounts", []);
                // set values in the state
                const optionsContractWithSigner = options(provider).connect(provider.getSigner());
                await optionsContractWithSigner.getCallOpts().then(e => this.setState({allCallOptions : e}));
                const usduzh = usdUZHContract(provider).connect(provider.getSigner());
                await usduzh.balanceOf(accounts[0]).then(e => this.setState({balance : e}));
                this.setState({signer: provider.getSigner(), walletAddress: accounts[0], faucet: faucet(provider), options: options(provider), usdContract: usdUZHContract(provider), buttonConnection: "Connected"});
            } catch (err) {
                console.error(err.message);
                this.setState({showConnectionError: !this.state.showConnectionError, target: event.target, buttonConnection: "Connect to you Wallet"});
            }
        } else {
            console.log("Please install MetaMask");
            this.setState({showConnectionError: !this.state.showConnectionError, target: event.target});
        }
    }

    async getAllOptions(contract, signer){
        const optionsContractWithSigner = contract.connect(signer);
        await optionsContractWithSigner.getCallOpts().then(e => this.setState({allCallOptions : e}));
        await optionsContractWithSigner.getPutOpts().then(e => this.setState({allPutOptions : e}));
    }

    async getUSDUZHBalance(contract, signer){
        const usduzh = contract.connect(signer);
        await usduzh.balanceOf(this.state.walletAddress.toLowerCase()).then(e => {
            this.setState({balance : ethers.utils.formatEther(e)})
            console.log(ethers.utils.formatEther(e))
        });
    }

    async getCurrentConnectedWallet(){
        if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
            try {
                // get provider
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                // get accounts
                const accounts = await provider.send("eth_requestAccounts", []);
                // set values in the state
                this.getAllOptions(options(provider), provider.getSigner());
                this.getUSDUZHBalance(usdUZHContract(provider), provider.getSigner());
                if (accounts.length > 0) {
                    this.setState({signer: provider.getSigner(), walletAddress: accounts[0], faucet: faucet(provider), options: options(provider), buttonConnection: "Connected"});
                } else {

                }
            } catch (err) {
                console.error(err.message);
            }
        } else {
            console.log("Please install MetaMask");
        }
    }

    componentDidMount (){
        if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
            this.getCurrentConnectedWallet();
            window.ethereum.on("accountsChanged", (accounts) => {
                this.getCurrentConnectedWallet();
                this.setState({walletAddress: accounts[0]});
            });
        } else {
            this.setState({walletAddress: ""})
            console.log("Please install MetaMask");
        }

        const ethData = JSON.parse(window.localStorage.getItem('ethData'));
        if (ethData && this.getDateForSeries(1) === new Date(ethData[0].data[ethData[0].data.length-1].x).toISOString().split('T')[0]) {
            this.setState({ethPriceData: ethData});
        } else {
            const options = {
                "headers": {'X-CoinAPI-Key': '0B18330A-C219-46D0-9550-4D61C25EDEDC'}
            }
            axios.get(`https://rest.coinapi.io/v1/exchangerate/ETH/USD/history?period_id=1DAY&time_start=${this.getDateForSeries(30)}T00:00:00&time_end=${this.getDateForSeries(0)}T00:00:00`, options)
                .then(res => {
                    let dataPoints = []
                    res.data.forEach(e => {
                        let datapointEntry = {
                            x: e.time_period_start,
                            y: [e.rate_open, e.rate_high, e.rate_low, e.rate_close]
                        }
                        dataPoints.push(datapointEntry);
                    });

                    this.setState({ethPriceData: [{data: dataPoints}]});
                    window.localStorage.setItem('ethData', JSON.stringify([{data: dataPoints}]));
                });
        }
    };

    async getFaucetOCTHandler () {
        this.setState({withdrawError: "", withdrawSuccess: ""});
        try {
            const fcContractWithSigner = this.state.faucet.connect(this.state.signer);
            const resp = await fcContractWithSigner.requestTokens();
            this.setState({transactionData: resp.hash, withdrawSuccess: "Operation succeeded - it might take a minute or two but enjoy your tokens!"});
        } catch (err) {
            this.setState({withdrawError: err.message});
        }
    };

    async getOptionsOCTHandler (option) {
        this.setState({withdrawError: "", withdrawSuccess: ""});
        try {

            const optionsContractWithSigner = this.state.options.connect(this.state.signer);
            const valueInWei = ethers.utils.parseEther(option.tknAmnt.toString());
            const tokenAmountInWei = ethers.utils.parseEther(option.tknAmnt.toString());
            const type = option.type;
            const strikePriceInWei = ethers.utils.parseEther(option.strikePrice.toString());
            const premiumInWei = ethers.utils.parseEther(option.premium.toString());
            let date = new Date(option.expiration);
            date.setHours(option.expirationTime.split(':')[0]);
            date.setMinutes(option.expirationTime.split(':')[1]);
            date = date.getTime() / 1000;
            console.log(date);
            let resp;
            if (type === "Call"){
                resp = await optionsContractWithSigner.sellCall(strikePriceInWei, premiumInWei, date, tokenAmountInWei, {value: valueInWei})
                    .then(e => {return e.hash});
            } else {
                resp = await optionsContractWithSigner.sellPut(strikePriceInWei, premiumInWei, date, tokenAmountInWei)
                    .then(e => {return e.hash});
            }
            this.setState({transactionData: resp, creationSuccess: `order was created`});
        } catch (err) {
            this.setState({orderError: err.message});
        }
    };


    async getUSDOCTHandler (option) {
        this.setState({orderError: "", orderSuccess: ""});

        try {
            const currentUSDETHPrice= await axios.get("https://min-api.cryptocompare.com/data/pricemultifull?fsyms=ETH&tsyms=USD").then(e => {return e.data.RAW.ETH.USD.PRICE})
            const optionsContractWithSigner = this.state.options.connect(this.state.signer);
            const exchangeAmountInWei = ethers.utils.parseEther(option.exchangeAmount.toString());
            const resp = await optionsContractWithSigner.buyUZH({value: exchangeAmountInWei})
                    .then(e => {return e.hash});
            this.setState({currentUSDETHPrice: currentUSDETHPrice, transactionData: resp, orderSuccess: `Order was created`});
        } catch (err) {
            this.setState({orderError: err.message});
        }
    };

    async buyOptionOCTHandler (id, type) {
        this.setState({orderError: "", orderSuccess: ""});
        try {
            const optionsContractWithSigner = this.state.options.connect(this.state.signer);
            let resp;
            if (type === "Call"){
                resp = await optionsContractWithSigner.buyCall(id, {gasLimit: 300000}).then(e => {
                    return e.hash});
            } else {
                resp = await optionsContractWithSigner.buyPut(id, {gasLimit: 300000}).then(e => {
                    return e.hash});
            }
            this.setState({transactionData: resp, modalMsg: `${type} was bought`, showModal: true});
        } catch (err) {
            this.setState({modalMsg: err.message, showModal: true});
        }
    };

    async executeOptionOCTHandler (id, type, amount) {
        try {
            const optionsContractWithSigner = this.state.options.connect(this.state.signer);
            let resp;
            if (type === "Call"){
                resp = await optionsContractWithSigner.exerciseCall(id, {gasLimit: 300000}).then(e => {
                    return e.hash});
            } else {
                const valueInWei = ethers.utils.parseEther(amount.toString());
                resp = await optionsContractWithSigner.exercisePut(id, {value: valueInWei, gasLimit: 300000}).then(e => {
                    return e.hash});
            }
            this.setState({transactionData: resp, modalMsg: `${type} was executed`, showModal: true});
        } catch (err) {
            console.log(err)
            this.setState({modalMsg: err.message, showModal: true});
        }
    };

    async cancelOptionOCTHandler (id, type) {
        try {
            const optionsContractWithSigner = this.state.options.connect(this.state.signer);
            let resp;
            if (type === "Call"){
                resp = await optionsContractWithSigner.cancelCall(id, {gasLimit: 300000}).then(e => {
                    return e.hash});
            } else {
                resp = await optionsContractWithSigner.cancelPut(id, {gasLimit: 300000}).then(e => {
                    return e.hash});
            }
            this.setState({transactionData: resp, modalMsg: `${type} was cancelled`, showModal: true});
        } catch (err) {
            console.log(err)
            this.setState({modalMsg: err.message, showModal: true});
        }
    };

    handleClose(){
        this.setState({showModal : false});
    }

    /**
     * TODO: check the usd balance in offerlist component (usd contract required)
     * TODO: execute put options
     */

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
                                    <Nav.Link href="/order">Sell Options</Nav.Link>
                                    <Nav.Link href="/list">Buy Options</Nav.Link>
                                    <Nav.Link href="/boughtAndSold">Your Options</Nav.Link>
                                    <Nav.Link href="/usdExchange">Exchange To USD</Nav.Link>
                                </Nav>
                            </Navbar.Collapse>
                            <Button className="justify-content-end" variant={this.state.elementMode} onClick={this.connectToWallet.bind(this)} disabled={this.state.buttonConnection === "Connected"}>
                                {this.state.buttonConnection}
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
                        <Route exact path='/faucet' element={<FaucetComponent faucet={this.state.faucet} withdrawError={this.state.withdrawError} withdrawSuccess={this.state.withdrawSuccess} walletAddress={this.state.walletAddress} getOCTHandler={this.getFaucetOCTHandler.bind(this)} transactionData={this.state.transactionData} elementMode={this.state.elementMode} layoutMode={this.state.layoutMode}/>} />
                        <Route exact path='/order' element={<OrderFormComponent executeOption={this.getOptionsOCTHandler.bind(this)} creationError={this.state.creationError} creationSuccess={this.state.creationSuccess} walletAddress={this.state.walletAddress} transactionData={this.state.transactionData} elementMode={this.state.elementMode} layoutMode={this.state.layoutMode} ethPriceData={this.state.ethPriceData} />} />
                        <Route exact path='/usdExchange' element={<USDExchangeComponent executeOrder={this.getUSDOCTHandler.bind(this)} currentUSDETHPrice={this.state.currentUSDETHPrice} orderError={this.state.orderError} orderSuccess={this.state.orderSuccess} walletAddress={this.state.walletAddress} transactionData={this.state.transactionData} elementMode={this.state.elementMode} layoutMode={this.state.layoutMode} ethPriceData={this.state.ethPriceData} />} />
                        <Route exact path='/list' element={<OfferListComponent showModal={this.state.showModal} transactionData={this.state.transactionData} modalMsg={this.state.modalMsg} hideModal={this.handleClose.bind(this)} buyCallOption={this.buyOptionOCTHandler.bind(this)} usdBalance={this.state.balance} allCallOptions={this.state.allCallOptions} allPutOptions={this.state.allPutOptions} layoutMode={this.state.layoutMode} walletAddress={this.state.walletAddress} />} />
                            <Route exact path='/boughtAndSold' element={<PersonalComponent showModal={this.state.showModal} transactionData={this.state.transactionData} modalMsg={this.state.modalMsg} hideModal={this.handleClose.bind(this)} executeOption={this.executeOptionOCTHandler.bind(this)} cancelOption={this.cancelOptionOCTHandler.bind(this)} allCallOptions={this.state.allCallOptions} allPutOptions={this.state.allPutOptions} layoutMode={this.state.layoutMode} walletAddress={this.state.walletAddress} />} />
                    </Routes>

                </div>
            </Router>
        );
    }
}

export default Grid;
