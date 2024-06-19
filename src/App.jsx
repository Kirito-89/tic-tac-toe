import { useState,useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { io } from 'socket.io-client';
import Square from './Square/Square'
import Swal from 'sweetalert2'
// import { ToastContainer, toast } from 'react-toastify';
//   import 'react-toastify/dist/ReactToastify.css';



const renderForm=[[1,2,3],[4,5,6],[7,8,9]];


function App() {
  const [gameState, setgameState] = useState(renderForm);
const [currentPlayer, setcurrentPlayer] = useState('circle');
const [finishedState, setfinishedState] = useState(false);
const [finishedArrayState, setfinishedArrayState] = useState([]);
const [playOnline, setplayOnline] = useState(false);
const [socket, setsocket] = useState(null);
const [playerName, setplayerName] = useState('');
const [opponentName, setopponentName] = useState(null);
const [playingAs, setplayingAs] = useState(null);
const takeplayerName=async()=>{
  const result=await Swal.fire({
    title: "Enter your name",
    input: "text",
    // inputLabel: "Enter your name",
 
    showCancelButton: true,
    inputValidator: (value) => {
      if (!value) {
        return "You need to write something!";
      }
    }
  });
  return result;
}


async function playOnlineClick(){
  const result=await takeplayerName();
  if(!result.isConfirmed){
    return;
  }
  const username=result.value;
  setplayerName(username)


  const newsocket = io("http://localhost:3000", {
   autoConnect: true,
 });
 newsocket?.emit("request to play",{playerName:username});
 setsocket(newsocket);
}
  useEffect(() => {
   const winner=checkWinner();

   if(winner){
    setfinishedState(winner)
    console.log(winner)
   }
   
  }, [gameState])

  // useEffect(() => {
  //   console.log(socket);
  // if(socket &&socket.connected){
  //   setplayOnline(true);
  // }
  // }, [socket])
  socket?.on("opponentLeftMatch",()=>{
    // alert("opponent left the match")
//     <ToastContainer
// position="top-right"
// autoClose={5000}
// hideProgressBar={false}
// newestOnTop={false}
// closeOnClick
// rtl={false}
// pauseOnFocusLoss
// draggable
// pauseOnHover
// theme="light"
// // transition: Bounce,
// />
{/* Same as */}
{/* <ToastContainer /> */}
    setfinishedState('opponentLeftMatch')
  })
socket?.on("playerMoveFromServer",(data)=>{
  // setgameState(gameState)
  // setcurrentPlayer(data.state.currentPlayer);
  setgameState((prevState)=>{
    const id=data.state.id;
    let newState=[...prevState];
                const rowIndex=Math.floor(id/3);
                const colIndex=id%3;
                newState[rowIndex][colIndex]=data.state.sign
                console.log(newState)
                return newState;
  })
  setcurrentPlayer(data.state.sign==="circle"?"cross":"circle");
})

  socket?.on('connect',()=>{
    // alert("connected")
    setplayOnline(true);
  })
  socket?.on("opponentNotFound",()=>{
    // alert("connected")
    // setplayOnline(true);
    setopponentName(false);
  })
  socket?.on("opponentFound",(data)=>{
    // alert("connected")
    // setplayOnline(true);
    setplayingAs(data.playingAs)
    console.log(data)
    setopponentName(data.opponentName);
  })
  

 

  const checkWinner=()=>{

    for(let row=0;row<gameState.length;row++){
      if(gameState[row][0]===gameState[row][1] &&gameState[row][1]===gameState[row][2]){
        setfinishedArrayState([row*3+0,row*3+1,row*3+2])
        return gameState[row][0];
      }
    }

    for(let col=0;col<gameState[0].length;col++){
      if(gameState[0][col]===gameState[1][col]&&gameState[1][col]===gameState[2][col]){
        setfinishedArrayState([0*3+col,1*3+col,2*3+col])
        return gameState[0][col];
      }
    }

    if(gameState[0][0]==gameState[1][1] && gameState[2][2]==gameState[1][1]){
      return gameState[0][0];
    }
    if(gameState[0][2]==gameState[1][1] && gameState[2][0]==gameState[1][1]){
      return gameState[0][2];
    }
const isDrawMatch=gameState.flat().every(e=>{
  if(e==='circle' || e==='cross'){
    return true;
  }
})

if(isDrawMatch){return 'draw';}
    return null
    
  }

  if(!playOnline){
    return (<>
    <div className="main flex justify-center items-center min-h-screen">
      <button onClick={playOnlineClick} className='text-white text-7xl bg-green-500 h-36 p-5 rounded-full hover:cursor-pointer'>play Online</button>
    </div>
    </>)
  }

  if(playOnline && !opponentName){
    return <>
    <div className='flex items-center justify-center min-h-screen text-8xl'>Waiting for opponent</div>
    </>
  }
  return (

    <>
    <div className="m-4"></div>
        <div className="move-detection flex gap-72 items-center justify-center">
    <div className={`left h-[40px] w-[120px] bg-slate-800 text-center ${currentPlayer===playingAs? 'current-move-'+currentPlayer:''}`}>{playerName}</div>
          <div className={`left h-[40px] w-[120px] bg-slate-800 text-center ${currentPlayer!==playingAs? 'current-move-'+currentPlayer:''}`}>{opponentName}</div>
        </div>
      <div className="main-div flex justify-center items-center">

<div>
  <h1 className='water-bg text-4xl rounded-lg p-5 text-center'>Tic Tac Toe</h1>
  <div className="m-3"></div>
  <div className="square-wrapper">
   
   {
    renderForm.map((arr,rowIndex)=>arr.map((e,colIndex)=>{
      return <Square playingAs={playingAs} currentElement={e} gameState={gameState} socket={socket} finishedArrayState={finishedArrayState} setfinishedState={setfinishedState} finishedState={finishedState} currentPlayer={currentPlayer} setcurrentPlayer={setcurrentPlayer} setgameState={setgameState} id={rowIndex*3+colIndex} key={rowIndex*3+colIndex}/>
    }))
   }
  </div>
  {finishedState && finishedState!=='draw' && finishedState!=='opponentLeftMatch'&&
  <h3 className='text-xl text-center'>{finishedState===playingAs?"You":playingAs} Won the game</h3>
  }
  {finishedState && finishedState==='draw'&& finishedState!=='opponentLeftMatch'&&
  <h3 className='text-xl text-center'>Game resulted in a draw</h3>
  }
  {!finishedState&&opponentName&&
  <h3 className='text-xl text-center'>You are playing against {opponentName}</h3>
  }
  {finishedState&&finishedState==='opponentLeftMatch'&&
  <h3 className='text-xl text-center'>You Won!opponent left the match</h3>
  }
</div>

      </div>
    </>
  )
}

export default App
