// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "./ERC721A.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract NFTCollection is ERC721A {

    bytes32 public immutable WHITELIST_HASH_ROOT;
  
    modifier isWhitelist(bytes32[] memory proof){
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
        bool success =  MerkleProof.verify(proof, WHITELIST_HASH_ROOT, leaf);
        require(success, "You are not in the whitelist for minting or wrong Proof");
        _;
    }

    constructor(string memory name, string memory symbol, bytes32 root) ERC721A(name, symbol){
        WHITELIST_HASH_ROOT = root;
    }

    function mint(bytes32[] memory _proof, uint256 _amount) public isWhitelist(_proof){
        _mint(msg.sender, _amount);
    }

}