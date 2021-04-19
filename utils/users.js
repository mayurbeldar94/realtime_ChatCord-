const users = []

//join user to chat

function userjoin(id,username,room)
{
    const user = {id, username, room}

    users.push(user)
    return user;
}
//Get currunt user

function getCurruntUser(id){
    return users.find(user => user.id === id)
}

//user leave the chat
function userLeave(id)
{
    const index = users.findIndex(user => user.id === id)

    if(index !== -1){
        return users.splice(index, 1)[0]
    }
}
//get room users
function getRoomUsers(room){
    return users.filter(user => user.room === room)
}
module.exports = {
    userjoin,
    getCurruntUser,
    userLeave,
    getRoomUsers
}