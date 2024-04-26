// function to remove the user with the userID from the list of users
function leaveRoom(userID, chatRoomUsers) {
    return chatRoomUsers.filter((user) => user.id != userID);
}

module.exports = leaveRoom;