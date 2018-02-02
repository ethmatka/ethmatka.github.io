var MyContract = web3.eth.contract([
    {
      "constant": false,
      "inputs": [],
      "name": "betA",
      "outputs": [],
      "payable": true,
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "withdraw",
      "outputs": [],
      "payable": true,
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "betB",
      "outputs": [],
      "payable": true,
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "deposit",
      "outputs": [],
      "payable": true,
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "current_price",
          "type": "uint256"
        }
      ],
      "name": "execute",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    }]);
var ContractInstance = MyContract.at("0x7b9d55c589bf92456e6e107810bcc3ecc8e59b95");

$(document).ready(function(){
  $("#risebtn").on('click',function(ev){
    var bet_amount = $("#riseinput").val();
    ContractInstance.betA({
      gas: 300000,
      from: web3.eth.accounts[0],
      value: web3.toWei(bet_amount, 'ether')
    },function(err, result){
      console.log(result);
    });
  });  
  $("#dropbtn").on('click',function(ev){
    var bet_amount = $("#dropinput").val();
    ContractInstance.betB({
      gas: 300000,
      from: web3.eth.accounts[0],
      value: web3.toWei(bet_amount, 'ether')
    },function(err, result){
      console.log(result);
    });
  });
});

