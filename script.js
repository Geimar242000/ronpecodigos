const colors = ["red","blue","green","yellow","purple","orange"];
let secret = [];
let currentRow = 0;
let guess = [];
const maxRows = 8;

const board = document.getElementById("board");
const checkBtn = document.getElementById("check");
const restartBtn = document.getElementById("restart");
const msg = document.getElementById("message");
const palette = document.querySelectorAll(".color");

function initGame(){
  board.innerHTML = "";
  secret = Array.from({length:4},()=>colors[Math.floor(Math.random()*colors.length)]);
  currentRow = 0;
  guess = [];
  msg.textContent = "Selecciona 4 colores y comprueba.";
  checkBtn.disabled = true;

  for(let i=0;i<maxRows;i++){
    const row = document.createElement("div");
    row.className = "row";
    for(let j=0;j<4;j++){
      const cell = document.createElement("div");
      cell.className = "cell";
      row.appendChild(cell);
    }
    const feedback = document.createElement("div");
    feedback.className = "feedback";
    for(let k=0;k<4;k++){
      feedback.appendChild(document.createElement("div"));
    }
    row.appendChild(feedback);
    board.appendChild(row);
  }
}

palette.forEach(btn=>{
  btn.addEventListener("click",()=>{
    if(guess.length<4){
      guess.push(btn.classList[1]);
      updateRow();
      if(guess.length===4) checkBtn.disabled=false;
    }
  });
});

checkBtn.addEventListener("click",()=>{
  if(guess.length!==4)return;
  const result = checkGuess(guess,secret);
  drawFeedback(result);
  if(result.correct===4){
    msg.textContent = "🎉 ¡Ganaste! Código: "+secret.join(", ");
    checkBtn.disabled=true;
  }else if(currentRow===maxRows-1){
    msg.textContent = "😢 Fin del juego. El código era: "+secret.join(", ");
  }else{
    currentRow++;
    guess=[];
    checkBtn.disabled=true;
    msg.textContent="Intenta de nuevo.";
  }
});

restartBtn.addEventListener("click",initGame);

function updateRow(){
  const row = board.children[currentRow];
  const cells = row.querySelectorAll(".cell");
  cells.forEach((c,i)=>{
    c.style.background = guess[i] || "transparent";
  });
}

function checkGuess(g,s){
  let correct=0, partial=0;
  const tempS=[...s], tempG=[...g];
  for(let i=0;i<4;i++){
    if(tempG[i]===tempS[i]){
      correct++; tempS[i]=tempG[i]=null;
    }
  }
  for(let i=0;i<4;i++){
    if(tempG[i] && tempS.includes(tempG[i])){
      partial++;
      tempS[tempS.indexOf(tempG[i])]=null;
    }
  }
  return {correct,partial};
}

function drawFeedback({correct,partial}){
  const fb = board.children[currentRow].querySelectorAll(".feedback div");
  fb.forEach((f,i)=>{
    if(i<correct) f.style.background="white";
    else if(i<correct+partial) f.style.background="black";
    else f.style.background="transparent";
  });
}

initGame();
