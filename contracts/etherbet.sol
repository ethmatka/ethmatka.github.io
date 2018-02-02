pragma solidity ^0.4.2;

contract Etherbet{
  
  address owner;

  // amount deposited by owner 
  uint poolAmount;

  mapping (address => uint) betAmountsA;
  mapping (address => uint) betAmountsB;

  //total amount bet on events A and B
  uint public totalA;
  uint public totalB;

  //storing addresses of all participants of A and B
  address[] participantsA;
  address[] participantsB;

  //prob of events A & B (used for deciding payoff)
  uint probA;
  uint probB;

  //Max amount of wei someone can bet on events A or B (dynamically updated in updateLimits)
  uint LimitA;
  uint LimitB;

  //border price of ether, bet is on whether price at a said date is above or below this
  uint betPrice;

  //contructor
  function Etherbet(uint price) public{
    owner = msg.sender;
    poolAmount = 0;
    probA = 20;
    probB = 80;
    betPrice = price;
    LimitA = 0;
    LimitB = 0;
  }

  //deposit pool amount
  function deposit() public payable { 
    require(msg.sender == owner);
    poolAmount = poolAmount + msg.value;
    updateLimits();
  }

  //ensures owner can only withdraw amount which is left after paying off in any event
  function withdraw() public payable {
    require(msg.sender == owner);
    uint lockedAmount = max(totalA*100/(probA)+1-totalA-totalB, totalB*100/(probB)+1-totalA-totalB);
    require(lockedAmount <= poolAmount);
    uint freeAmount = poolAmount-lockedAmount;
    //ensure atomicity below
    poolAmount -= freeAmount;
    owner.transfer(freeAmount);
    updateLimits();
  }

  //bet on event A (rise)
  function betA() public payable {
    require(msg.value < LimitA);
    if(betAmountsA[msg.sender] == 0) participantsA.push(msg.sender);
    betAmountsA[msg.sender] = betAmountsA[msg.sender] + msg.value;
    totalA += msg.value;
    updateLimits();
  }

  //bet on event B (drop)
  function betB() public payable {
    require(msg.value < LimitB);
    if(betAmountsB[msg.sender] == 0) participantsB.push(msg.sender);
    betAmountsB[msg.sender] = betAmountsB[msg.sender] + msg.value;
    totalB += msg.value;
    updateLimits();
  }

  // called by owner at said time
  function execute(uint current_price) public {
    require(msg.sender == owner);
    //add a require statement to check time
    if(current_price >= betPrice){
      payA();
    } else{
      payB();
    }
    owner.transfer(this.balance);
    LimitA = 0;
    LimitB = 0;
    poolAmount = 0;
  }

  //limits change with new bets or withdrawal of some ether by owner
  function updateLimits() private {
    LimitA = ((poolAmount+totalA+totalB)*probA - 100*totalA)/(100-probA) + 1;
    LimitB = ((poolAmount+totalA+totalB)*probB - 100*totalB)/(100-probB) + 1;
  }

  function max(uint a, uint b) private pure returns (uint) {
    return a > b ? a : b;
  }

  function payA() private {
    for(uint i = 0; i < participantsA.length; i++){
      uint payout = (betAmountsA[participantsA[i]] * 100) / probA;
      participantsA[i].transfer(payout);
    }
  }

  function payB() private {
    for(uint i = 0; i < participantsB.length; i++){
      uint payout = (betAmountsB[participantsB[i]] * 100) / probB;
      participantsB[i].transfer(payout);
    }

  }

}