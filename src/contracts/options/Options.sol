//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";
import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";

// Covered Call and Covered Put Smart Contract:
contract Options is ChainlinkClient, ConfirmedOwner {

    // Used to Make Oracle Requests:
    using Chainlink for Chainlink.Request;

    // Needed for the Contract to hold Link Tokens:
    LinkTokenInterface internal LINK;

    // Price:
    uint256 public ethPrice;

    // Chainlink specific:
    bytes32 private jobId;
    uint256 private fee;
    bytes32 private requestId;

    // Hashes needed for String comparison:
    bytes32 callHash = keccak256(abi.encodePacked("call"));
    bytes32 putHash = keccak256(abi.encodePacked("put"));
    address payable contractAddr;

    //Mapping used for the requests:
    mapping (bytes32 => uint) ethrequest;

    //Option stored in arrays of structs
    struct option {
        uint strikePrice;
        uint premium;
        uint experation;
        uint tknAmt;
        bool exercised;
        bool canceled;
        uint id;
        uint costToExercise;
        address payable seller;
        address payable buyer;
    }

    // Arrays to store call and put options:
    option[] public callOpts;
    option[] public putOpts;

    // Events:
    // event when option is created/sold
    event OptionCreated(string optiontype, uint strike, uint premium, uint expiry, uint tknAmt, uint id);
    // event when option bought
    event OptionBought(uint id, string optiontype);
    // event when option is exercised
    event OptionExercised(uint id, string optiontype);
    // event when option is canceled
    event OptionCanceled(uint id, string optiontype);

    // Constructor: Oracle specific + Linktoken specific:
    constructor() ConfirmedOwner(msg.sender) {
        LINK = LinkTokenInterface(0x48120Eb14AB6EBe2C4F937c3c4915ae1DaF96736);
        contractAddr = payable(address(this));
        setChainlinkToken(0x48120Eb14AB6EBe2C4F937c3c4915ae1DaF96736);
        setChainlinkOracle(0xdE97E401A4443202e66BEDCbe27cc3D02fF9be6a);
        jobId = "92302b0cfcbb41ea8b32481b2dd4d86e";
        fee = (1 * LINK_DIVISIBILITY) / 10;
    }

    ///////////////////////// Getter Functions /////////////////////////

    // Return all Call Options:
    function getCallOpts() public view returns (option[] memory) {
        return callOpts;
    }

    // Returns all Put Options:
    function getPutOpts() public view returns (option[] memory) {
        return putOpts;
    }

    ///////////////////////// Option Functions /////////////////////////

     // Writes a call option:
    function sellOption(string memory optiontype, uint strike, uint premium, uint expiry, uint tknAmt) public payable {

        bytes32 optionhash = keccak256(abi.encodePacked(optiontype));
        // Covered Call is choosen: Seller accepts the obligation
        // to sell x amount of tokens at the strike price
        // Seller will need to deposit x amount of tokens
        if (optionhash == callHash) {
                require(msg.value == tknAmt, "Incorrect amount of ETH supplied");
                // Cost to exercise the call option:
                uint costToExercise = tknAmt * strike;
                callOpts.push(option(strike, premium, expiry, tknAmt, false, false, callOpts.length, costToExercise, payable(msg.sender), payable(address(0))));
                // Emit event:
                emit OptionCreated(optiontype, strike, premium, expiry, tknAmt, callOpts.length);
        }
        // Covered Put is choosen: Seller accepts the obligation
        // to buy x amount of tokens at the strike price
        // Seller will need to deposit x amount of tokens
        // This serves as a collateral for the buyer of the put option:
        else {
                require(msg.value == tknAmt, "Incorrect amount of ETH supplied");
                // Cost to exercise the put option:
                uint costToExercise = tknAmt * strike;
                putOpts.push(option(strike, premium, expiry, tknAmt, false, false, putOpts.length, costToExercise, payable(msg.sender), payable(address(0))));
                // Emit event:
                emit OptionCreated(optiontype, strike, premium, expiry, tknAmt, putOpts.length);
        }

    }

    // Function to buy a call option or a put option:
    function buyOption(uint id, string memory optiontype) public payable {
        bytes32 optionhash = keccak256(abi.encodePacked(optiontype));

        if (optionhash == callHash) {
            require(msg.value == callOpts[id].premium, "Incorrect amount of ETH supplied");
            require(callOpts[id].exercised == false, "Option already exercised");
            require(callOpts[id].canceled == false, "Option already canceled");
            require(callOpts[id].experation > block.timestamp, "Option expired");
            require(callOpts[id].buyer == payable(address(0)), "Option already sold");
            callOpts[id].buyer = payable(msg.sender);

            // Transfer the premium to the seller:
            callOpts[id].seller.transfer(callOpts[id].premium);
            // Emit event:
            emit OptionBought(id, optiontype);
        }
        else {
            require(msg.value == putOpts[id].premium, "Incorrect amount of ETH supplied");
            require(putOpts[id].exercised == false, "Option already exercised");
            require(putOpts[id].canceled == false, "Option already canceled");
            require(putOpts[id].experation > block.timestamp, "Option expired");
            require(putOpts[id].buyer == payable(address(0)), "Option already sold");
            putOpts[id].buyer = payable(msg.sender);

            // Transfer the premium to the seller:
            putOpts[id].seller.transfer(putOpts[id].premium);
            // Emit event:
            emit OptionBought(id, optiontype);
        }

    }

    // Cancel a call option or a put option:
    function cancelOption(uint id, string memory optiontype) public payable {
        bytes32 optionhash = keccak256(abi.encodePacked(optiontype));
        if (optionhash == callHash) {
            require(callOpts[id].seller == msg.sender, "You do not own this option");
            require(callOpts[id].exercised == false, "Option already exercised");
            require(callOpts[id].canceled == false, "Option already canceled");
            require(callOpts[id].experation > block.timestamp, "Option expired");
            require(callOpts[id].buyer == payable(address(0)), "Option already sold");
            callOpts[id].canceled = true;
            // Refund the the amount of tokens to the seller:
            callOpts[id].seller.transfer(callOpts[id].tknAmt);
            // Emit event:
            emit OptionCanceled(id, optiontype);
        }
        else {
            require(putOpts[id].seller == msg.sender, "You do not own this option");
            require(putOpts[id].exercised == false, "Option already exercised");
            require(putOpts[id].canceled == false, "Option already canceled");
            require(putOpts[id].experation > block.timestamp, "Option expired");
            require(putOpts[id].buyer == payable(address(0)), "Option already sold");
            putOpts[id].canceled = true;
            // Refund the premium to the seller:
            putOpts[id].seller.transfer(putOpts[id].tknAmt);
            // Emit event:
            emit OptionCanceled(id, optiontype);
        }
    }
}