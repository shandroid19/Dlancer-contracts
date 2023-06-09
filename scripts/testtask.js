require("@nomicfoundation/hardhat-toolbox");

const fs = require('fs')
const ADDRESS_FILE ='./constants.js';
const ADDRESSES = "../frontend/constants/addresses.json";
const ABI_FILE = "../frontend/constants/abi.json";
const {getLatestAddress,getBusdAddress} = require('../helpers')

task("create", "creates a task")
  .addParam("employee","employee wallet address")
  .addParam("amount", "reward amount in USD")
  .addParam("deadline", "deadline") 
  .addParam("employer", "employer wallet address")
  .addParam("description", "task description")
  .addParam("name", "task name")
  .setAction(async (args, hre) => {
    const TaskContract = await hre.ethers.getContractFactory("TaskContract");
    const amount = ethers.utils.parseUnits(args.amount)
    // const deadline = Math.floor(Date.now() / 1000) + 3600*
    // console.log(args.deadline, typeof args.deadline, parseInt(args.deadline)+3600)
    const deadline = Math.floor(Date.now() / 1000) + 3600*parseInt(args.deadline)
    const name = args.name;
    const description=args.description;
    console.log(`employee:, ${args.employee}, amount:, ${args.amount}, deadline:, ${args.deadline}, employer:, ${args.employer}, taskDescription:, ${args.description}, taskname: ${args.name}`);
    const {deployer,freelancer,hirer} = await hre.getNamedAccounts();
    const busd = getBusdAddress();
    const taskContract = await TaskContract.deploy(
        freelancer, // employee wallet address
        amount, // reward amount in USD
        deadline, //deadline 
        hirer, //employer wallet address
        name,//name of the task
        description, // task description
        busd // BUSD contract address
      );
      await taskContract.deployed();
    // console.log("TaskContract deployed to:", '0xF674dCc2312998b77D6859056b9fA3283a52ddfb');
    console.log("TaskContract deployed to:", taskContract.address);


      // console.log("TaskContract deployed to:", taskContract.address);
    // fs.writeFileSync(ADDRESS_FILE,JSON.stringify("0xB35B57f55d8188460AC223E430Af3E463a691b4e"))
      
    //   const task = await ethers.getContractAt("TaskContract",getLatestAddress(),hirer)
      
    //   const activated = await task.isActivated();
    //   await updateContractAdresses(taskContract.address);
    //   await updateAbi(TaskContract.interface.format(ethers.utils.FormatTypes.json));
    //   console.log(activated);
    });


async function updateAbi(abi){
    // const contract  = await ethers.getContract("TaskContract");
    // fs.writeFileSync(ABI_FILE, contract.interface.format(ethers.utils.FormatTypes.json));
    fs.writeFileSync(ABI_FILE, abi);
    console.log("done");
  }
  
  async function updateContractAdresses(address){
    const addresses = JSON.parse(fs.readFileSync(ADDRESSES,'utf-8'))
    console.log(addresses)
    const chainId = network.config.chainId.toString();
    if(chainId in addresses){
        if(!addresses[chainId].includes(address))
            addresses[chainId].push(address)
    }else  {
        addresses[chainId] = [address]
        console.log(address);
    }
      fs.writeFileSync(ADDRESSES,JSON.stringify(addresses))
  }