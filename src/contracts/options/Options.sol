//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";
import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";

// Create an interface for the USDUZH contract
// This is needed to interact with the USDUZH contract
interface USDUZH {

    function totalSupply() external view returns (uint256);
    function balanceOf(address tokenOwner) external view returns (uint);
    function transfer(address receiver, uint numTokens) external returns (bool);
    function allowance(address owner, address delegate) external view returns (uint);
    function transferFrom(address owner, address buyer, uint numTokens) external returns (bool);

}

contract Options is ChainlinkClient, ConfirmedOwner{

    // ChainLink specific parameters:
    using Chainlink for Chainlink.Request;
    LinkTokenInterface internal LINK;
    uint256 public ethPrice;
    bytes32 private requestId;
    bytes32 private jobId;
    uint256 private fee;

    // For initalizing the USDUZH contract:
    address _usduzhAddress = 0xec38C5e4CeaE2c030D0f43A47289AA7b47FE7a68;
    USDUZH usduzh;
    address payable contractAddr;


    //Mapping used for the requests:
    mapping (bytes32 => address) ethrequest;

    // Create a constructor for the BuyUZH contract
    constructor () ConfirmedOwner(msg.sender){
        // Initialize the USDUZH contract:
        usduzh = USDUZH(_usduzhAddress);
        // Specific to ChainLink:
        LINK = LinkTokenInterface(0x48120Eb14AB6EBe2C4F937c3c4915ae1DaF96736);
        contractAddr = payable(address(this));
        setChainlinkToken(0x48120Eb14AB6EBe2C4F937c3c4915ae1DaF96736);
        setChainlinkOracle(0xdE97E401A4443202e66BEDCbe27cc3D02fF9be6a);
        jobId = "92302b0cfcbb41ea8b32481b2dd4d86e";
        fee = (1 * LINK_DIVISIBILITY) / 10;
    }

    /// Functions specifically for buying USDUZH tokens with ETH using ChainLink //
    // Create a function to buy UZH tokens
    function buyUZH() public payable{
        // Require the payment to be at least 1 ETH:
        require(msg.value >= 1 ether, "You need to pay at least 1 ETH");
        requestId = getEthereumPrice();
        ethrequest[requestId] = msg.sender;
    }

    // Ethereum cost call:
    function getEthereumPrice() public returns (bytes32 requestId) {
        Chainlink.Request memory req_eth = buildChainlinkRequest(
            jobId,
            address(this),
            this.fullfillETH.selector
        );
        req_eth.add(
            "get",
            "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=ETH&tsyms=USD"
        );
        req_eth.add("path", "RAW,ETH,USD,PRICE");

        // Multiply the result by 1000000000000000000 to remove decimals
        int256 timesAmount = 10**18;
        req_eth.addInt("times", timesAmount);

        // Sends the request
        return sendChainlinkRequest(req_eth, fee);
        }

    function fullfillETH(bytes32 _requestId,uint256 _ethPrice) public recordChainlinkFulfillment(_requestId) {
        ethPrice = _ethPrice;
        address beneficiary = ethrequest[_requestId];
        usduzh.transferFrom(address(this), payable(beneficiary), ethPrice);

    }

    //// Functions for the Options Contract ////
    // Option stuct for call and put options:
    struct option {
        uint strike; //Price in USD (18 decimal places) option allows buyer to purchase tokens at
        uint premium; //Fee in contract token that option writer charges
        uint expiry; //Unix timestamp of expiration time
        uint tknAmt; //Amount of tokens the option contract is for
        bool exercised; //Has option been exercised
        bool canceled; //Has option been canceled
        uint id; //Unique ID of option, also array index
        uint costToExercise; //Helper to show last updated cost to exercise
        address payable seller; //Issuer of option
        address payable buyer; //Buyer of option
    }

    // Arrays to store the options:
    option[] public callOpts;
    option[] public putOpts;

    // Events:
    event OptionCreated(uint id);
    event OptionCanceled(uint id);
    event OptionBought(uint id);
    event OptionExercised(uint id);

    // Get all call options:
    function getCallOpts() public view returns (option[] memory) {
        return callOpts;
    }

    // Get all put options:
    function getPutOpts() public view returns (option[] memory) {
        return putOpts;
    }

    // Sell a call option:
    function sellCall(uint strike, uint premium, uint expiry, uint tknAmt) public payable {
        // Require, that the expiry is in the future:
        require(expiry > block.timestamp, "You need to have an expiry in the future");
        // Require the minumum tknAmt to be 1 ETH:
        require(tknAmt >= 1*10**18, "You need to have a option with at least 1 ETH");
        // Assert, that the payable amount is equal to the tknAmt:
        require(msg.value == tknAmt, "You need to pay the correct amount of Ethereum");
        // Cost to exercise the option = strike * tknAmt in USDUZH:
        uint costToExercise = strike * tknAmt/10**18;
        callOpts.push(option(strike, premium, expiry, tknAmt, false, false, callOpts.length, costToExercise, payable(msg.sender), payable(address(0))));
        emit OptionCreated(callOpts.length - 1);
    }

    // Sell a put option:
    function sellPut(uint strike, uint premium, uint expiry, uint tknAmt) public {
        uint costToExercise = strike * tknAmt/10**18;
        // Require, that the expiry is in the future:
        require(expiry > block.timestamp, "You need to have an expiry in the future");
        // Require the minumum tknAmt to be 1 ETH:
        require(tknAmt >= 10**18, "You need to have a option with at least 1 ETH");
        // Require, that the user has enough USDUZH:
        require(usduzh.balanceOf(msg.sender) >= costToExercise, "You need to have enough USDUZH");
        // Push the option to the array:
        putOpts.push(option(strike, premium, expiry, tknAmt, false, false, putOpts.length, costToExercise, payable(msg.sender), payable(address(0))));
        // Transfer the USDUZH collateral to the contract:
        usduzh.transferFrom(msg.sender, address(this), costToExercise);
        emit OptionCreated(putOpts.length - 1);
    }

    // Cancel call option:
    function cancelCall(uint id) public {
        // Require, that the option is not exercised:
        require(callOpts[id].exercised == false, "You can't cancel an exercised option");
        // Require, that the option is not canceled:
        require(callOpts[id].canceled == false, "You can't cancel an already canceled option");
        // Require, that the option is written by the user:
        require(callOpts[id].seller == msg.sender, "You can't cancel an option that you didn't write");
        // Require, that the option is not bought or the option is bought but the time is expired:
        require(callOpts[id].buyer == address(0) || (callOpts[id].buyer != address(0) && callOpts[id].expiry < block.timestamp), "You can't cancel an option that is already bought");
        // Set the option to canceled:
        callOpts[id].canceled = true;
        // Transfer the collateral ETH back from the contract to the writer:
        callOpts[id].seller.transfer(callOpts[id].tknAmt);
        emit OptionCanceled(id);
    }

    // Cancel put option:
    function cancelPut(uint id) public {
        // Require, that the option is not exercised:
        require(putOpts[id].exercised == false, "You can't cancel an exercised option");
        // Require, that the option is not canceled:
        require(putOpts[id].canceled == false, "You can't cancel an already canceled option");
        // Require, that the option is written by the user:
        require(putOpts[id].seller == msg.sender, "You can't cancel an option that you didn't write");
        // Require, that the option is not bought or the option is bought but the time is expired:
        require(putOpts[id].buyer == address(0) || (putOpts[id].buyer != address(0) && putOpts[id].expiry < block.timestamp), "You can't cancel an option that is already bought");
        // Set the option to canceled:
        putOpts[id].canceled = true;
        // Transfer the collateral USDUZH back from the contract to the writer:
        usduzh.transfer(putOpts[id].seller, putOpts[id].costToExercise);
        emit OptionCanceled(id);
    }

    // Buy call option:
    function buyCall(uint id) public {
        // Require, that the option is not exercised:
        require(callOpts[id].exercised == false, "You can't buy an exercised option");
        // Require, that the option is not canceled:
        require(callOpts[id].canceled == false, "You can't buy an already canceled option");
        // Require, that the option is not expired:
        require(callOpts[id].expiry > block.timestamp, "You can't buy an expired option");
        // Require, that the is not written by the user:
        require(callOpts[id].seller != msg.sender, "You can't buy an option that you wrote");
        // Require, that the option is not already bought:
        require(callOpts[id].buyer == address(0), "You can't buy an option that is already bought");
        // Require, that the user pays the correct amount of USDUZH:
        require(usduzh.balanceOf(msg.sender) >= callOpts[id].premium, "You need to have enough USDUZH");
        // Set the buyer of the option:
        callOpts[id].buyer = payable(msg.sender);
        // Transfer the premium from the buyer to the writer:
        usduzh.transferFrom(msg.sender, callOpts[id].seller, callOpts[id].premium);
        emit OptionBought(id);
    }

    // Buy put option:
    function buyPut(uint id) public {
        // Require, that the option is not exercised:
        require(putOpts[id].exercised == false, "You can't buy an exercised option");
        // Require, that the option is not canceled:
        require(putOpts[id].canceled == false, "You can't buy an already canceled option");
        // Require, that the option is not expired:
        require(putOpts[id].expiry > block.timestamp, "You can't buy an expired option");
        // Require, that the option is not written by the user:
        require(putOpts[id].seller != msg.sender, "You can't buy an option that you wrote");
        // Require, that the option is not already bought:
        require(putOpts[id].buyer == address(0), "You can't buy an option that is already bought");
        // Require, that the user pays the correct amount of USDUZH:
        require(usduzh.balanceOf(msg.sender) >= callOpts[id].premium, "You need to have enough USDUZH");
        // Set the buyer of the option:
        putOpts[id].buyer = payable(msg.sender);
        // Transfer the premium from the buyer to the writer:
        usduzh.transferFrom(msg.sender, callOpts[id].seller, callOpts[id].premium);
        emit OptionBought(id);
    }

    // Exercise call option:
    function exerciseCall(uint id) public {
        // Require, that the option is not exercised:
        require(callOpts[id].exercised == false, "You can't exercise an exercised option");
        // Require, that the option is not canceled:
        require(callOpts[id].canceled == false, "You can't exercise an already canceled option");
        // Require, that the option is not expired:
        require(callOpts[id].expiry > block.timestamp, "You can't exercise an expired option");
        // Require, that the msg.sender = buyer:
        require(callOpts[id].buyer == msg.sender, "You can't exercise an option that you didn't buy");
        // Require, that the user pays the correct amount of USDUZH:
        require(usduzh.balanceOf(msg.sender) >= (callOpts[id].costToExercise), "You need to have enough USDUZH");
        // Set the option to exercised:
        callOpts[id].exercised = true;
        // Transfer the collateral ETH from the contract to the buyer:
        callOpts[id].buyer.transfer(callOpts[id].tknAmt);
        // Transfer the tknAmt * strike USDUZH from the msg.sender (buyer) to the seller:
        usduzh.transferFrom(msg.sender, callOpts[id].seller, callOpts[id].costToExercise);
        emit OptionExercised(id);
    }

    // Exercise put option:
    function exercisePut(uint id) public payable {
        // Require, that the option is not exercised:
        require(putOpts[id].exercised == false, "You can't exercise an exercised option");
        // Require, that the option is not canceled:
        require(putOpts[id].canceled == false, "You can't exercise an already canceled option");
        // Require, that the option is not expired:
        require(putOpts[id].expiry > block.timestamp, "You can't exercise an expired option");
        // Require, that the caller is the buyer:
        require(callOpts[id].buyer == msg.sender, "You can't exercise an option that you didn't buy");
        // Require, that the user pays the correct amount of ETH:
        require(msg.value == putOpts[id].tknAmt, "You need to have enough ETH");
        // Set the option to exercised:
        putOpts[id].exercised = true;
        // Transfer the Ethereum from the contract to the writer:
        putOpts[id].seller.transfer(msg.value);
        // Transfer the collateral USDUZH from the contract to the buyer:
        usduzh.transfer(putOpts[id].buyer, putOpts[id].costToExercise);
        // Emit the event:
        emit OptionExercised(id);
    }

}