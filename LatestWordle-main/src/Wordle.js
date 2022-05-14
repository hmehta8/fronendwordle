import React, { Component } from 'react';
import GameBoard from './GameBoard';
import Swal from "sweetalert2";
import axios from "axios"


class Wordle extends Component {

    constructor(props) {
        super(props)

        this.state = {
            myTake: this.props.myTake,
            board: this.props.board,
            counter: 0,
            playerOneScore: 0,
            playerTwoScore: 0,
            printScore: false,
            roomCreator: this.props.roomCreator
          };
    
          this.playerTurn = 'F';
          this.pubnub = this.props.pubnub;
          this.gamechannel = this.props.gamechannel
          this.isGameOver = false;
          this.textInput = React.createRef();
          this.word = null;
          this.currentBoard = null;
          this.wordle =  "WHOSE";      
          this.count = 0;
    }   

    componentDidMount(){
        
        this.props.pubnub.getMessage(this.props.gamechannel, (msg) => {
     
          if(msg.message.turn === this.props.playerTurn){
            this.publishMove(msg.message.board, msg.message.counter, msg.message.playerOneScore, 
                            msg.message.playerTwoScore);
          }
      });
    }

    publishMove = (board, counter, playerOne, playerTwo) => {


       if(counter === 5){
        this.setState({
            board: board,
            myTake: false,
            counter: counter,
            playerOneScore: playerOne,
            playerTwoScore: playerTwo,
            printScore: true
        })

        this.checkForWinner(playerOne, playerTwo);

       }else {
     
        this.setState({
            board: board,
            myTake: !this.state.myTake,
            counter: counter + 1
        })
       }

       
    } 

    playAgain = () => {
            Swal.fire({
            position: 'top',
            allowOutsideClick: false,
            title: 'Play Again!!',
            text: 'Do you want to play again ?',
            width: 275,
            padding: '0.7em',
            showCancelButton: true,
            confirmButtonColor: 'rgb(208,33,41)',
            cancelButtonColor: '#aaa',
            cancelButtonText: 'Log out',
            confirmButtonText: 'Yea!',
            customClass: {
                heightAuto: false,
                title: 'title-class',
                popup: 'popup-class',
                confirmButton: 'button-class',
                cancelButton: 'button-class'
            }
        }).then((result) => {

            if(result.value) {
                window.location.reload(false);
            } else {
                window.location.href = "/";
            }
        });
 
    }

    checkForWinner = (playerOneScore, playerTwoScore) => {

        let string = null;

        if(playerOneScore > playerTwoScore) {
            string = "Player 1 Wins!!"
        }
        if(playerOneScore < playerTwoScore) {
            string = "Player 2 Wins!!"
        }
        if(playerOneScore === playerTwoScore) {
            string = "Game tied!!!"
        }

       
        Swal.fire({
                position: 'top',
                allowOutsideClick: false,
                title: 'Final Result',
                text: string,
                width: 275,
                padding: '0.7em',
                customClass: {
                    heightAuto: false,
                    title: 'title-class',
                    popup: 'popup-class',
                    confirmButton: 'button-class'
                }
            }).then((result) => {
                if(result.value) {
                    this.playAgain()
                }
            })

    
    }

    getScore= (word) => {

        let scoreCount = 0;

        for (let i = 0; i < 5; i+=1) {
            
            if(word[i] === this.wordle[i]) {
                scoreCount = scoreCount + 1
            }
            
        }

        return scoreCount;
    }

    updatePlayersScore = (board) => {

        let playerOneTotalScore = this.getScore(board[4]);
        let playerTwoTotalScore = this.getScore(board[5]);

        this.setState({
            board: this.currentBoard,
            myTake: !this.state.myTake,
            playerOneScore: playerOneTotalScore,
            playerTwoScore: playerTwoTotalScore,
            printScore: true

        })

       this.checkForWinner(playerOneTotalScore, playerTwoTotalScore);

        this.pubnub.publish({
            message: {
              board: this.currentBoard,
              myTake: this.state.myTake,
              counter: this.state.counter,
              turn: this.playerTurn,
              playerOneScore: playerOneTotalScore,
              playerTwoScore: playerTwoTotalScore
            },
            channel: this.props.gamechannel
          });
    }
    
    updateCurrentScore = (currentBoard, counter, playerTurn) => {

        let playerOneTotalScore = null;
        let playerTwoTotalScore = null;

        if (playerTurn === 'F') {
            playerOneTotalScore = this.getScore(currentBoard[counter]);
            if(counter === 0) {
                playerTwoTotalScore = 0
            } else {
                playerTwoTotalScore = this.getScore(currentBoard[counter - 1]);
            }
            
            if(playerOneTotalScore === 5) {
                this.count = 5;
                this.setState({
                    board: this.currentBoard,
                    myTake: !this.state.myTake,
                    playerOneScore: playerOneTotalScore,
                    playerTwoScore: playerTwoTotalScore,
                    printScore: true,
                    counter: 5
                })
    
                this.checkForWinner(playerOneTotalScore, playerTwoTotalScore);

                this.pubnub.publish({
                    message: {
                      board: this.currentBoard,
                      myTake: this.state.myTake,
                      counter: 5,
                      turn: this.playerTurn,
                      playerOneScore: playerOneTotalScore,
                      playerTwoScore: playerTwoTotalScore
                    },
                    channel: this.props.gamechannel
                  });
            }
            

        } if(playerTurn === "S") {

            if(counter === 0) {
                playerOneTotalScore = 0;
            } else {
                playerOneTotalScore = this.getScore(currentBoard[counter - 1]);
            }
            playerTwoTotalScore = this.getScore(currentBoard[counter]);


            if(playerTwoTotalScore === 5) {
                this.count = 5;
                this.setState({
                    board: this.currentBoard,
                    myTake: !this.state.myTake,
                    playerOneScore: playerOneTotalScore,
                    playerTwoScore: playerTwoTotalScore,
                    printScore: true,
                    counter: 5
                })
    
                this.checkForWinner(playerOneTotalScore, playerTwoTotalScore);

                this.pubnub.publish({
                    message: {
                      board: this.currentBoard,
                      myTake: this.state.myTake,
                      counter: 5,
                      turn: this.playerTurn,
                      playerOneScore: playerOneTotalScore,
                      playerTwoScore: playerTwoTotalScore
                    },
                    channel: this.props.gamechannel
                  });
            }
        }


    }



    updateBoard = () => {
        
         this.word = this.textInput.current.value.toUpperCase();

         axios.post(`https://twoplayerwordle.herokuapp.com/api/login/validate-input/${this.word}`).then(response => {
             if(response.data === true) {
                this.currentBoard = this.state.board;
                this.currentBoard[this.state.counter] = this.word;
               
                this.playerTurn = (this.props.playerTurn === 'F') ? 'S' : 'F';
                if (this.state.counter === 5) {
                   this.updatePlayersScore(this.currentBoard);
                } else {
                   
                   this.updateCurrentScore(this.currentBoard, this.state.counter, this.props.playerTurn);
       
                   if(this.count !== 5) {
                       
                       this.setState({
                           board: this.currentBoard,
                           myTake: !this.state.myTake,
                           counter: this.state.counter 
                       })
                   
                   
                       this.pubnub.publish({
                           message: {
                           board: this.currentBoard,
                           myTake: this.state.myTake,
                           counter: this.state.counter,
                           turn: this.playerTurn
                           },
                           channel: this.props.gamechannel
                       });
                   }
               }    
             } else {
                let str = "Only alpha characters upto 5 characters are allowed"
                Swal.fire({
                    position: "top",
                    allowOutsideClick: false,
                    title: "Invalid Input !!",
                    html: "<pre>" + str + "</pre>",
                    width: 610,
                    padding: "0.7em",
                    // Custom CSS
                    customClass: {
                      heightAuto: false,
                      title: "title-class",
                      popup: "popup-class",
                      confirmButton: "button-class",
                    },
                  });
             }
         })
        
      
    }

    


    render() {

        let gameStatus = `${this.state.myTake? "Your turn" : "Opponent's turn"}`;

        if(this.state.counter >= 5) {
            gameStatus = "Game Over";
        }
    
        return (
          <div>
            
            <div className="game-container">
            <p className="game-status">{gameStatus}</p>
            <GameBoard
                board={this.state.board}
                playerTurn={this.props.playerTurn}
                myTake={this.state.myTake}
                wordle={this.wordle}
                counter={this.state.counter}
            />
            </div>
            
            {this.state.printScore && (
              <div className="player-score">
                <p className="score">
                  {" "}
                  Player 1 Scored {this.state.playerOneScore} points
                </p>
                <p className="score">
                  Player 2 Scored {this.state.playerTwoScore} points
                </p>
              </div>
            )}

            {this.state.myTake && (
              <div>
                <div className="input-label">
                  <input
                    className="input"
                    type="text"
                    ref={this.textInput}
                    placeholder="Enter a Wordle.."
                  />
                </div>
                <div className="submit">
                  <button className="submit-button" onClick={this.updateBoard}>
                    {" "}
                    Submit{" "}
                  </button>
                </div>
              </div>
            )}
          </div>
        );  

    }


}

export default Wordle;