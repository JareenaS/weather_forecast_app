const choices=document.querySelectorAll(".choice");
const userscoreref=document.querySelector("#user-score");
const compuseref=document.querySelector("#comp-score");
const msgref=document.querySelector("#msg");

let userscore=0;
let compscore=0;

//  paper vs stone-> paper
// paper vs scissor -> scissor
// stone vs scissor -> stone
function drawGame()
{
    msgref.innerText="GAME DRAW";
}
//  2.45 2   1.6842 1

function helper()
{
    let arr=["rock","paper","scissors"];
    let random_num=Math.floor(Math.random()*3);
    return arr[random_num];
}
function playgame(userchoice)
{
    const compchoice=helper();
    if(userchoice===compchoice)
    {
        drawGame();
    }
    else
    {
        let userwin=true;
        if(userchoice==='rock' && compchoice==='paper')
        {
            userwin=false;
        }
        else if(userchoice==='paper' && compchoice==='scissors')
        {
            userwin=false;
        }
        else if(userchoice==="scissors" && compchoice==="rock")
        {
            userwin=false;
        }
        showwinner(userwin,userchoice,compchoice);
    }
}

//  user win
//  user win user choice is stone comp choice is paper
function showwinner(userwin,userchoice,compchoice)
{
    if(userwin)
    {
        userscore++;
        userscoreref.innerText=userscore;
        msgref.innerText=`USER WIN, USER CHOICE IS ${userchoice} , COMP USER IS ${compchoice}`;
    }
    else
    {
        compscore++;
        compuseref.innerText=compscore;
        msgref.innerText=`USER LOSE , USER CHOICE IS ${userchoice} , COMP USER IS ${compchoice}`;
    }
}
choices.forEach((choice)=>
{
    choice.addEventListener("click",function(event)
    {
        const userchoice=choice.getAttribute("id");
        playgame(userchoice);
    })
})
 
