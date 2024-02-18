// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract new_contract {
    uint public reserveA;
    uint public reserveB;
    mapping(address => uint) public liquidity;

    uint public totalSupply;
    address public tokenA;
    address public tokenB;

    function addLiquidity(uint amountA, uint amountB) external returns (uint shares) {
        if(totalSupply == 0) {
            shares = amountA + amountB;
        } else {
            shares = ((amountA + amountB) * totalSupply) / (reserveA + reserveB);
        }
        require(shares > 0, "Invalid liquidity provided");
        reserveA += amountA;
        reserveB += amountB;
        totalSupply += shares;
        liquidity[msg.sender] += shares;
        // Transfer tokens to the contract here (not implemented for simplicity)
    }

    function removeLiquidity(uint shares) external returns (uint amountA, uint amountB) {
        require(shares <= liquidity[msg.sender], "Not enough liquidity");
        amountA = (shares * reserveA) / totalSupply;
        amountB = (shares * reserveB) / totalSupply;
        reserveA -= amountA;
        reserveB -= amountB;
        totalSupply -= shares;
        liquidity[msg.sender] -= shares;
        // Transfer tokens back to the liquidity provider here (not implemented for simplicity)
    }

    function swap(uint amountIn, address tokenIn) external returns (uint amountOut) {
        require(tokenIn == tokenA || tokenIn == tokenB, "Invalid token address");
        bool isTokenA = tokenIn == tokenA;
        (uint reserveIn, uint reserveOut) = isTokenA ? (reserveA, reserveB) : (reserveB, reserveA);

        // Implementing x * y = k model
        uint amountInWithFee = amountIn * 997;
        uint numerator = amountInWithFee * reserveOut;
        uint denominator = (reserveIn * 1000) + amountInWithFee;
        amountOut = numerator / denominator;

        // Update reserves
        if(isTokenA) {
            reserveA += amountIn;
            reserveB -= amountOut;
        } else {
            reserveB += amountIn;
            reserveA -= amountOut;
        }
        // Transfer tokens here (not implemented for simplicity)
    }
}