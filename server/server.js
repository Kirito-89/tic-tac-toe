import { createServer } from "http";
import { Server } from "socket.io";


const httpServer = createServer();
const io = new Server(httpServer, {
  cors:"http://localhost:5173/",
});

const allUsers=[];
const allRooms=[];

io.on("connection", (socket) => {
    
  // ...
//   console.log(socket); 
// console.log("New user joined "+socket.id);
allUsers[socket.id]={socket:socket,online:true}
// allUsers.push({socket:socket,online:true})

socket.on("request to play",(data)=>{ 
    // console.log(data);
    const currentUser=allUsers[socket.id]
    currentUser.playerName=data.playerName;
    console.log(currentUser)

    let opponentPlayer;
    for (const key in allUsers) {
        const user=allUsers[key];
        if(user.online && !user.playing && socket.id!==key){
            opponentPlayer=user;
            break;
        }
    }
    if(opponentPlayer){
        allRooms.push({
            player1:opponentPlayer,
            player2:currentUser
        })
        // console.log("opponent found");
        opponentPlayer.socket.emit("opponentFound",{
            opponentName:currentUser.playerName,
            playingAs:"circle"
        })
        currentUser.socket.emit("opponentFound",{
            opponentName:opponentPlayer.playerName,
             playingAs:"cross"
        })

        currentUser.socket.on("playerMoveFromClient",(data)=>{
            // console.log(data)
            opponentPlayer.socket.emit("playerMoveFromServer",{
               ...data
            })
        })
        opponentPlayer.socket.on("playerMoveFromClient",(data)=>{
            currentUser.socket.emit("playerMoveFromServer",{
               ...data
             })
        })

        
    }else{
  currentUser.socket.emit("opponentNotFound");
        
    }
})
socket.on("disconnect",()=>{
    // for(let index=0;index<allUsers.length;index++){
    //     const user=allUsers[index];
    //     if(user.id===socket.id){
    //         user.online=false;
    //     }
    // }
    // allUsers[socket.id]={
    //     socket:{...socket,online:false}
    // }
    const currentUser=allUsers[socket.id];
    currentUser.online=false;
    currentUser.playing=false;

    for (let index = 0; index < allRooms.length; index++) {
        const {player1,player2} = allRooms[index];
        if(player1.socket.id===socket.id){
            player2.socket.emit("opponentLeftMatch")
            break;
        }
        if(player2.socket.id===socket.id){
            player1.socket.emit("opponentLeftMatch")
            break;
        }
        
    }
})
});


httpServer.listen(3000);