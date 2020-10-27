pragma solidity >=0.4.0 <6.0.0;

/**
    @dev Contract for user rating dapp
 */
contract Rating {

    struct User {
        address userAddress;
        uint256[] ratings;
        address[] ratingsUsers;
        bool registered;
    }
    // Mapping of registered users
    mapping(address => User) public userRegister;
    
    address[] public registeredUsers;

    constructor() public {}

   /**
        @dev Checks if the sender is registered
     */
    modifier onlyRegistered() {
        require(
            userRegister[msg.sender].registered == true, 
            "SENDER_NOT_REGISTERED"
        );
        _;
    }

    /**
        @dev Registers the msg.sender as a user in the Ratings dapp
     */
    function registerUser() external {
        User memory user;
        user.userAddress = msg.sender;
        user.registered = true;
        userRegister[msg.sender] = user;
        registeredUsers.push(msg.sender);
    }

    /**
        @dev Rates a registred user
        @param userToRate The address of the user being rated 
        @param rating The rating being given by the sender
     */
    function rateUser(
        address userToRate,
        uint256 rating
    ) 
        external 
        onlyRegistered()
    {
        require(
            userRegister[userToRate].registered == true,
            "USER_NOT_REGISTERED"
        );
        User storage user = userRegister[userToRate];
        user.ratingsUsers.push(msg.sender);
        user.ratings.push(rating);
        userRegister[userToRate] = user;
    }
 
    /**
        @dev Retrieves the ratings given for a specific user
     */
    function getRatings(
        address registeredUser
    ) 
        external
        view
        returns (address[] memory, uint256[] memory)
    {
        User memory user = userRegister[registeredUser];
        return(user.ratingsUsers, user.ratings);
    }

    /**
        @dev Retrieves all registered users
     */
     function getUsers() external view returns (address[] memory) {
         return registeredUsers;
     }
}