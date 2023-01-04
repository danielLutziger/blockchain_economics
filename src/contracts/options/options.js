// Local instance of the faucet contract
import { ethers } from "ethers";

const optionsAddress = "0xD235205D5B2d6d2Ed0CC05c422A880342dB2d79b";
const optionsAbi = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "id",
                "type": "bytes32"
            }
        ],
        "name": "ChainlinkCancelled",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "id",
                "type": "bytes32"
            }
        ],
        "name": "ChainlinkFulfilled",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "id",
                "type": "bytes32"
            }
        ],
        "name": "ChainlinkRequested",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "optiontype",
                "type": "string"
            }
        ],
        "name": "OptionBought",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "optiontype",
                "type": "string"
            }
        ],
        "name": "OptionCanceled",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "string",
                "name": "optiontype",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "strike",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "premium",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "expiry",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "tknAmt",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            }
        ],
        "name": "OptionCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "optiontype",
                "type": "string"
            }
        ],
        "name": "OptionExercised",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferRequested",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "acceptOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "optiontype",
                "type": "string"
            }
        ],
        "name": "buyOption",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "callOpts",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "strikePrice",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "premium",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "experation",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "tknAmt",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "exercised",
                "type": "bool"
            },
            {
                "internalType": "bool",
                "name": "canceled",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "costToExercise",
                "type": "uint256"
            },
            {
                "internalType": "address payable",
                "name": "seller",
                "type": "address"
            },
            {
                "internalType": "address payable",
                "name": "buyer",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "optiontype",
                "type": "string"
            }
        ],
        "name": "cancelOption",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "ethPrice",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getCallOpts",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "strikePrice",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "premium",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "experation",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "tknAmt",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "exercised",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "canceled",
                        "type": "bool"
                    },
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "costToExercise",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address payable",
                        "name": "seller",
                        "type": "address"
                    },
                    {
                        "internalType": "address payable",
                        "name": "buyer",
                        "type": "address"
                    }
                ],
                "internalType": "struct Options.option[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getPutOpts",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "strikePrice",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "premium",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "experation",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "tknAmt",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "exercised",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "canceled",
                        "type": "bool"
                    },
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "costToExercise",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address payable",
                        "name": "seller",
                        "type": "address"
                    },
                    {
                        "internalType": "address payable",
                        "name": "buyer",
                        "type": "address"
                    }
                ],
                "internalType": "struct Options.option[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "putOpts",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "strikePrice",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "premium",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "experation",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "tknAmt",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "exercised",
                "type": "bool"
            },
            {
                "internalType": "bool",
                "name": "canceled",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "costToExercise",
                "type": "uint256"
            },
            {
                "internalType": "address payable",
                "name": "seller",
                "type": "address"
            },
            {
                "internalType": "address payable",
                "name": "buyer",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "retrieve",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "retrieveExpiration",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "retrieveOptionType",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "retrievePremium",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "retrievePrice",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "retrieveTknAmnt",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "optiontype",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "strike",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "premium",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "expiry",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "tknAmt",
                "type": "uint256"
            }
        ],
        "name": "sellOption",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "optiontype",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "strike",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "prem",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "expiry",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "tkn",
                "type": "uint256"
            }
        ],
        "name": "store",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

const optionsContract = (provider) => {
    return new ethers.Contract(optionsAddress, optionsAbi, provider);

}

export default optionsContract;