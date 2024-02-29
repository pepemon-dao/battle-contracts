import "./WhitelistAdminRole.sol";
import "./Base64.sol";

pragma experimental ABIEncoderV2;


contract PepemonStats is WhitelistAdminRole{
    
    struct BattleCardStats {
        uint16 element;
        uint16 hp;
        uint16 speed;
        uint16 intelligence;
        uint16 defense;
        uint16 attack;
        uint16 specialAttack;
        uint16 specialDefense;
        uint16 level;
        string name;
        string description;
        string ipfsAddr;
        string rarity;
    }

    struct SupportCardStats {
        bytes32 currentRoundChanges;
        bytes32 nextRoundChanges;
        uint256 specialCode;
        uint16 modifierNumberOfNextTurns;
        bool isOffense;
        bool isNormal;
        bool isStackable;
        string name;
        string description;
        string ipfsAddr;
        string rarity;
    }
    
    struct elementWR{
        uint16 weakness;
        uint16 resistance;
    }

    mapping(uint => BattleCardStats) public battleCardStats;
    mapping(uint => SupportCardStats) public supportCardStats;
    mapping (uint16 => string) public elementDecode;
    mapping (uint16 => elementWR) public weakResist;
    
    constructor(){
        elementDecode[1]="Fire";
        elementDecode[2]="Grass";
        elementDecode[3]="Water";
        elementDecode[4]="Lighting";
        elementDecode[5]="Wind";
        elementDecode[6]="Poison";
        elementDecode[7]="Ghost";
        elementDecode[8]="Fairy";
        elementDecode[9]="Earth";
        elementDecode[10]="Unknown";
        weakResist[1] = elementWR(3,2);
        weakResist[2] = elementWR(1,3);
        weakResist[3] = elementWR(4,1);
        weakResist[4] = elementWR(9,5);
        weakResist[5] = elementWR(6,9);
        weakResist[6] = elementWR(8,2);
        weakResist[7] = elementWR(8,6);
        weakResist[8] = elementWR(7,8);
        weakResist[9] = elementWR(2,7);
        weakResist[10] = elementWR(0,0);
    }
    
    function setBattleCardStats(uint id, BattleCardStats calldata x) public onlyWhitelistAdmin{
        battleCardStats[id] = x;
    }
    function setSupportCardStats(uint id, SupportCardStats calldata x) public onlyWhitelistAdmin{
        supportCardStats[id] = x;
    }
    function setWeakResist(uint16 element, elementWR calldata x) public onlyWhitelistAdmin{
        weakResist[element] = x;
    }
    function setElementDecode(uint16 element, string calldata x) public onlyWhitelistAdmin{
        elementDecode[element] = x;
    }

    function batchGetBattleCardStats(uint minId, uint maxId) public view returns (BattleCardStats[] memory) {
        require(minId <= maxId, "minId must be less than or equal to maxId");
        BattleCardStats[] memory results = new BattleCardStats[](maxId - minId + 1);

        for (uint256 i = minId; i <= maxId; i++) {
            results[i - minId] = battleCardStats[i];
        }

        return results;
    }

    //Pos 0-7 = hp, spd, int, def, atk, sp atk, sp def
    //Pos 8-13 = same but for opponent
    function deconvert(bytes32 num) public pure returns(int16[14] memory){
        int16[14] memory arr;
        for (uint i =0 ; i < 14; i++){
            arr[i] = int16(uint16(bytes2(num << 240))); 
            num = num >> 16;
        } 
        return arr;
    }
    function uint2str(uint256 value) internal pure returns (string memory) {
        // Inspired by OraclizeAPI's implementation - MIT licence
        // https://github.com/oraclize/ethereum-api/blob/b42146b063c7d6ee1358846c198246239e9360e8/oraclizeAPI_0.4.25.sol

        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
    
    function convert(int16[14] calldata arr) public pure returns (bytes32){
        bytes32 num;
        for (uint i = 0 ; i < 14; i++ ){
            num |= (bytes32(uint256(uint16(arr[i])))<<(16*i));
        }
        return num;
    }
    
    //spaghetti code ahead :(
        
    function getSupportType(SupportCardStats memory s) internal pure returns(string memory){
        string memory  x ="Defense ";
        string memory  y="(Special)";
        if (s.isOffense){
            x = "Offense ";
        }
        if (s.isNormal){
            y = "(Normal)";
        }
        return string(abi.encodePacked(x, y));
    }
    function _URIForSupport(uint id) internal view returns (bytes memory){
        SupportCardStats memory s = supportCardStats[id];
        return abi.encodePacked(
        "{\"pool\": {\"name\": \"root\",\"points\": 1},\"external_url\": \"https://pepemon.world/\",\"image\": \"", 
        s.ipfsAddr, 
        "\",\"name\": \"",
        s.name, 
        "\",\"description\": \"",
        s.description,
        "\",\"attributes\": [{\"trait_type\": \"Set\",\"value\": \"Pepemon Support\"},{\"trait_type\": \"Rarity\",\"value\": \"",
        s.rarity, 
        "\"},{\"trait_type\": \"Type\",\"value\": \"", 
        getSupportType(s), 
        "\"}]}");
    }


    function _URIForBattle(uint id) internal view returns (bytes memory){
        BattleCardStats memory b = battleCardStats[id];
        uint16 e = b.element;
        return abi.encodePacked("{\"pool\": {\"name\": \"root\",\"points\": 1},\"external_url\": \"https://pepemon.world/\",\"image\": \"",
        b.ipfsAddr, 
        "\",\"name\": \"", 
        b.name, 
        "\",\"description\": \"", 
        b.description, 
        "\",\"attributes\":[{\"trait_type\":\"Set\",\"value\":\"Pepemon Battle\"},{\"trait_type\":\"Level\",\"value\":", 
        uint2str(b.level),
        "},{\"trait_type\":\"Element\",\"value\":\"", 
        elementDecode[e], 
         "\"},{\"trait_type\":\"Weakness\",\"value\":\"");
    }
    function _URIForBattle3(uint id) internal view returns (bytes memory){
        BattleCardStats memory b = battleCardStats[id];
        uint16 e = b.element;
        return abi.encodePacked(
            elementDecode[weakResist[e].weakness], 
            "\"},{\"trait_type\":\"Resistance\",\"value\":\"",
            elementDecode[weakResist[e].resistance], 
            "\"},{\"trait_type\":\"HP\",\"value\":", 
            uint2str(b.hp));
    }
    function _URIForBattle2(uint id) internal view returns (bytes memory){
        BattleCardStats memory b = battleCardStats[id];
        return abi.encodePacked("},{\"trait_type\":\"Speed\",\"value\":"
        , uint2str(b.speed)
        , "},{\"trait_type\":\"Intelligence\",\"value\":"
        , uint2str(b.intelligence)
        , "},{\"trait_type\":\"Defense\",\"value\":"
        , uint2str(b.defense));
    }
    function _URIForBattle4(uint id) internal view returns (bytes memory){
        BattleCardStats memory b = battleCardStats[id];
        return abi.encodePacked("},{\"trait_type\":\"Attack\",\"value\":",
        uint2str(b.attack),
        "},{\"trait_type\":\"Special Attack\",\"value\":", 
        uint2str(b.specialAttack), 
        "},{\"trait_type\":\"Special Defense\",\"value\":", 
        uint2str(b.specialDefense), 
        "}]}");
    }
    
    function _getUri2(uint id) internal view returns(bytes memory){
        if (battleCardStats[id].hp==0){
            return _URIForSupport(id);
        }else{
            return abi.encodePacked(_URIForBattle(id), _URIForBattle3(id), _URIForBattle2(id), _URIForBattle4(id));
        }
    }
    function _getUri(uint id) internal view returns (string memory){
        return string(abi.encodePacked("data:application/json;base64\r\n\r\n", Base64.encode(_getUri2(id))));
    }
    
}
