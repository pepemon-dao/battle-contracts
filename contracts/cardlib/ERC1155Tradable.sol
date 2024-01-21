import "./ERC1155.sol";
import "./ERC1155MintBurn.sol";
import "./ERC1155Metadata.sol";
import "./Ownable.sol";
import "./MinterRole.sol";
import "./WhitelistAdminRole.sol";
import "./PepemonStats.sol";

pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

/**
 * @title ERC1155Tradable
 * ERC1155Tradable - ERC1155 contract that whitelists an operator address,
 * has create and mint functionality, and supports useful standards from OpenZeppelin,
  like _exists(), name(), symbol(), and totalSupply()
 */
contract ERC1155Tradable is ERC1155, ERC1155MintBurn, ERC1155Metadata, Ownable, MinterRole, WhitelistAdminRole, PepemonStats {

    uint256 private _currentTokenID = 0;
    mapping(uint256 => address) public creators;
    mapping(uint256 => uint256) public tokenSupply;
    mapping(uint256 => uint256) public tokenMaxSupply;
    // Contract name
    string public name;
    // Contract symbol
    string public symbol;
    string public baseMetadataURI;
    
    constructor(
        string memory _name,
        string memory _symbol
    )  {
        name = _name;
        symbol = _symbol;
    }
    function _setBaseMetadataURI(string memory x) internal{
        baseMetadataURI = x;
    }
    function removeWhitelistAdmin(address account) public onlyOwner {
        _removeWhitelistAdmin(account);
    }
    
    function removeMinter(address account) public onlyOwner {
        _removeMinter(account);
    }

    function uri(uint256 _id) public view returns (string memory) {
        require(_exists(_id), "ERC1155Tradable#uri: NONEXISTENT_TOKEN");
        return _getUri(_id);
    }

    /**
     * @dev Returns the total quantity for a token ID
     * @param _id uint256 ID of the token to query
     * @return amount of token in existence
     */
    function totalSupply(uint256 _id) public view returns (uint256) {
        return tokenSupply[_id];
    }

    /**
     * @dev Returns the max quantity for a token ID
     * @param _id uint256 ID of the token to query
     * @return amount of token in existence
     */
    function maxSupply(uint256 _id) public view returns (uint256) {
        return tokenMaxSupply[_id];
    }


    /**
     * @dev Creates a new token type and assigns _initialSupply to an address
     * @param _maxSupply max supply allowed
     * @param _initialSupply Optional amount to supply the first owner
     * @param _uri Optional URI for this token type
     * @param _data Optional data to pass if receiver is contract
     * @return tokenId The newly created token ID
     */
    function create(
        uint256 _maxSupply,
        uint256 _initialSupply,
        string memory _uri,
        bytes memory _data
        
    ) internal  returns (uint256 tokenId) {
        require(_initialSupply <= _maxSupply, "Initial supply cannot be more than max supply");
        uint256 _id = _getNextTokenID();
        _incrementTokenTypeId();
        creators[_id] = msg.sender;

        if (bytes(_uri).length > 0) {
            emit URI(_uri, _id);
        }

        if (_initialSupply != 0) _mint(msg.sender, _id, _initialSupply, _data);
        tokenSupply[_id] = _initialSupply;
        tokenMaxSupply[_id] = _maxSupply;
        return _id;
    }
    function createBattleCard(BattleCardStats calldata _stats,
        uint256 _maxSupply,
        uint256 _initialSupply,
        string calldata _uri,
        bytes calldata _data
    ) external onlyWhitelistAdmin returns(uint256 tokenId){
        uint _id = create(_maxSupply, _initialSupply, _uri, _data);
        setBattleCardStats(_id, _stats);
        return _id;
    }
    
    function createSupportCard(SupportCardStats calldata _stats,
        uint256 _maxSupply,
        uint256 _initialSupply,
        string calldata _uri,
        bytes calldata _data
    ) external onlyWhitelistAdmin returns(uint256 tokenId){
        uint _id = create(_maxSupply, _initialSupply, _uri, _data);
        setSupportCardStats(_id, _stats);
        return _id;
    }

    /**
     * @dev Mints some amount of tokens to an address
     * @param _to          Address of the future owner of the token
     * @param _id          Token ID to mint
     * @param _quantity    Amount of tokens to mint
     * @param _data        Data to pass if receiver is contract
     */
    function mint(
        address _to,
        uint256 _id,
        uint256 _quantity,
        bytes memory _data
    ) public onlyMinter {
        mintPepe(_to, _id, _quantity, _data);
    }
    function mintPepe(
        address _to,
        uint256 _id,
        uint256 _quantity,
        bytes memory _data
    ) internal{
        uint256 tokenId = _id;
        uint256 newSupply = tokenSupply[tokenId]+_quantity;
        require(newSupply <= tokenMaxSupply[tokenId], "Max supply reached");
        _mint(_to, _id, _quantity, _data);
        tokenSupply[_id] = tokenSupply[_id]+_quantity;
    }

    /**
     * @dev Returns whether the specified token exists by checking to see if it has a creator
     * @param _id uint256 ID of the token to query the existence of
     * @return bool whether the token exists
     */
    function _exists(uint256 _id) internal view returns (bool) {
        return creators[_id] != address(0);
    }

    /**
     * @dev calculates the next token ID based on value of _currentTokenID
     * @return uint256 for the next token ID
     */
    function _getNextTokenID() private view returns (uint256) {
        return _currentTokenID+1;
    }

    /**
     * @dev increments the value of _currentTokenID
     */
    function _incrementTokenTypeId() private {
        _currentTokenID++;
    }
}
