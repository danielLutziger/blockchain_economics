// Local instance of the faucet contract
import { ethers } from "ethers";

const optionsAddress = "0x6c870F545507aaebfB76085Cc07844925fC2E3E0";
const optionsAbi = [
    {
        "inputs": [],
        "name": "acceptOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "buyUZH",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            }
        ],
        "name": "cancelCall",
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
            }
        ],
        "name": "cancelPut",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
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
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "_requestId",
                "type": "bytes32"
            },
            {
                "internalType": "uint256",
                "name": "_ethPrice",
                "type": "uint256"
            }
        ],
        "name": "fullfillETH",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getEthereumPrice",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "requestId",
                "type": "bytes32"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
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
        "inputs": [
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
        "name": "sellCall",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
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
        "name": "sellPut",
        "outputs": [],
        "stateMutability": "nonpayable",
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
                "name": "writer",
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
        "name": "getBalance",
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
                        "name": "writer",
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
                        "name": "writer",
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
                "name": "writer",
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
    }
]

const optionsContract = (provider) => {
    return new ethers.Contract(optionsAddress, optionsAbi, provider);

}

export default optionsContract;