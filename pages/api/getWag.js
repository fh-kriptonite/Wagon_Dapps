var Web3 = require("web3")
import erc20ABI from "../../public/ABI/erc20.json";
import { isClaimableController, UpdateClaimsController } from "../../controllers/db_faucet_controllers";

const web3 = new Web3(process.env.ALCHEMY_PROVIDER_HTTPS);
var wagContract = new web3.eth.Contract(erc20ABI, process.env.WAG_ADDRESS);

async function verifyCaptcha(token) {
    try {
        const response = await fetch('https://hcaptcha.com/siteverify', {
            method: 'POST',
            body: `response=${token}&secret=${process.env.HCAPTCHA_SECRETKEY}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
    
        const data = await response.json();
        return data;
    } catch (error) {
        console.log("Error verify captcha: ", error)
        throw error;
    }
}

async function sendWag(address) {
    var id;
    var response;
    try {
        // check address last redeem
        id = await isClaimableController(address);

        const query = wagContract.methods.transfer(address, "100000000000000000000");
        const encodedABI = query.encodeABI();
        
        const gas = await web3.eth.estimateGas({
            from: process.env.WALLET_FAUCET_ADDRESS,
            to: process.env.WAG_ADDRESS,
            data: encodedABI
        })

        const block = await web3.eth.getBlock('latest');
        const next_gas_price = Math.ceil(block.baseFeePerGas * 2);

        const signedTx = await web3.eth.accounts.signTransaction(
            {
                data: encodedABI,
                from: process.env.WALLET_FAUCET_ADDRESS,
                gas: gas,
                to: process.env.WAG_ADDRESS,
                maxFeePerGas: next_gas_price,
                maxPriorityFeePerGas: next_gas_price
            },
            process.env.WALLET_FAUCET_KEY,
            false,
        )

        response = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    } catch (error) {
        console.log("Error send WAG: ")
        console.log(error)
        await UpdateClaimsController("", 2, id);
        throw error;
    }
        
    await UpdateClaimsController(response.transactionHash, 1, id);
    return(response);
}

export default async function handler(req, res) {
    if(req.method === 'GET') {
        res.status(200).json({message: "Hello"})
    }
    if (req.method === 'POST') {
        const address = req.body.address;
        const token = req.body.token;
        if (address == "") {
            res.status(200).json({status: "failed", message: "No address found"})
        }
        if (token == "") {
            res.status(200).json({status: "failed", message: "Please do the captcha"})
        }
        
        try {
            const verifyData = await verifyCaptcha(token);
            if(!verifyData.success) {
                res.status(200).json({status: "failed", message: "Fail to verify captcha, please try again."})
            }
        } catch (error) {
            res.status(200).json({status: "failed", message: "Fail to verify captcha, please verify again."})
        }

        try {
            const tx = await sendWag(address)
            res.status(200).json({status: "success", transactionHash: tx.transactionHash});    
        } catch (error) {
            console.log("error handler: ")
            console.log(error)
            res.status(200).json({status: "failed", message: error.toString()})
        }
        
    }
}