import React,{useState} from 'react';
import './Square.css';
const circleSvg = (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        {" "}
        <path
          d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
          stroke="#ffffff"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>{" "}
      </g>
    </svg>
  );
  
  const crossSvg = (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        {" "}
        <path
          d="M19 5L5 19M5.00001 5L19 19"
          stroke="#fff"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>{" "}
      </g>
    </svg>
  );
const Square = ({playingAs,currentElement,gameState,socket,finishedArrayState,setfinishedState,finishedState,currentPlayer,setcurrentPlayer,setgameState,id}) => {
    // if(finishedState){
    //     return;
    // }
    const [icon, seticon] = useState(null);
    
    const clickOn=()=>{
      if(playingAs!==currentPlayer){
        return;
      }
        if(!icon){
            if(currentPlayer==='circle'){

                seticon(circleSvg);
            }else{
                seticon(crossSvg);
            }
const mycurrentplayer=currentPlayer;
socket.emit("playerMoveFromClient",{state:{
  id,
  sign: mycurrentplayer,
}});
            setcurrentPlayer(currentPlayer==='circle'?'cross':'circle')

            // else{
              // if(gameState.flat().includes("circle")||gameState.flat().includes("cross")){
              //   socket.emit("playerMoveFromClient",{gameState});
              // }
            //  }
            // socket.emit("playerMoveFromClient",{state:{
            //   id,
            //   sign:currrentPlayer,
            // }});


            setgameState(prevState=>{
                let newState=[...prevState];
                const rowIndex=Math.floor(id/3);
                const colIndex=id%3;
                newState[rowIndex][colIndex]=mycurrentplayer
                console.log(newState)
                return newState
            })
        }
    }
  return (
    <div onClick={clickOn}  className={`m-1 h-[100px] w-[100px] bg-violet-900 
      ${finishedState ? 'hover:cursor-not-allowed' : 'hover:cursor-pointer'} 
      ${currentPlayer!==playingAs ? 'hover:cursor-not-allowed' : 'hover:cursor-pointer'}
      ${finishedArrayState.includes(id) ? `${finishedState}-won` : ''}`}>
        {/* {console.log(finishedState+"-won")} */}
      {currentElement==="circle"?circleSvg:currentElement=="cross"?crossSvg:icon}
    </div>
  );
}

export default Square;
