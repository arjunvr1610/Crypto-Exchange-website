pragma solidity ^0.5.16;

import "./Token.sol";

contract EthSwap {
    string public name = "Eswap";
    Token public token;
    uint public rate = 100;

    constructor(Token _token) public {
        token = _token;
    }

    event TokenPurchased(
        address account, 
        address token,
        uint amount,
        uint rate
    );

    event TokenSold(
        address account,
        address token,
        uint amount,
        uint rate
    );

    function buyTokens() public payable {
        // Calculate the number of tokens to buy
        uint tokenAmount = rate * msg.value;

        require(tokenAmount <= token.balanceOf(address(this)));
        token.transfer(msg.sender, tokenAmount);

        // Emit an event
        emit TokenPurchased(msg.sender, address(token), tokenAmount, rate);
    }

    function sellTokens(uint _amount) public payable {
        // calculate cost of tokens
        uint etherAmount = _amount / rate;
        
        // Require that EthSwap has enough Ether
        require(address(this).balance >= etherAmount);

        // User can't sell more tokens than they have
        require(_amount <= token.balanceOf(msg.sender));
        
        msg.sender.transfer(etherAmount);
        token.transferFrom(msg.sender, address(this), _amount);

        // Emit an event
        emit TokenSold(msg.sender, address(token), _amount, rate);
    }
}