// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract AIControlledVault is AccessControl {
    bytes32 public constant AI_AGENT_ROLE = keccak256("AI_AGENT_ROLE");
    IERC20 public token;

    event TokensWithdrawn(address indexed agent, address indexed to, uint256 amount);

    constructor(address _tokenAddress) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        token = IERC20(_tokenAddress);
    }

    function withdrawTokens(address to, uint256 amount) external onlyRole(AI_AGENT_ROLE) {
        require(to != address(0), "Invalid recipient address");
        require(amount > 0, "Amount must be greater than zero");
        require(token.balanceOf(address(this)) >= amount, "Insufficient balance");
        
        token.transfer(to, amount);
        emit TokensWithdrawn(msg.sender, to, amount);
    }

    function grantAIAgentRole(address agent) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(AI_AGENT_ROLE, agent);
    }

    function revokeAIAgentRole(address agent) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(AI_AGENT_ROLE, agent);
    }
}
