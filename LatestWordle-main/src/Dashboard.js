import React, { Component } from 'react';
import * as PubNubReact from 'pubnub-react';
import GameBoard from './GameBoard';
import Wordle from './Wordle';
import Swal from "sweetalert2";  
import shortid  from 'shortid';
import './Dashboard.css';
import axios from 'axios';


 
class Dashboard extends Component {
  constructor(props) {  
    super(props);
    this.pubnub = new PubNubReact({
      publishKey: "pub-c-07633095-9aa9-44c5-9593-f3dca6a78c4b", 
      subscribeKey: "sub-c-b890aa12-b1aa-11ec-ac48-7ec486788b75"    
    });
    
    this.state = {
      gameStarted: false,
      roomCreator: false,
      isDisabled: false,
      myTake: false
    };

    this.subChannel = null;
    this.gamingChannel = null;
    this.roomId = null;    
    this.board = ["", "", "", "", "", ""];
    this.pubnub.init(this);
  }  

  componentWillUnmount() {
    this.pubnub.unsubscribe({
      channels : [this.subChannel, this.gamingChannel]
    });
  }
  
  componentDidUpdate() {
   
    // Check that the player is connected to a channel
    if(this.subChannel != null){
      this.pubnub.getMessage(this.subChannel, (msg) => {
        // Start the game once an opponent joins the channel

        if(msg.message.notRoomCreator){
          // Create a different channel for the game
          this.gamingChannel = 'wordle+--' + this.roomId;

          this.pubnub.subscribe({
            channels: [this.gamingChannel]
          });

          this.setState({
            gameStarted: true
          });  

          // Close the modals if they are opened
          Swal.close();
        }
      }); 
    }
  }

  onPressCreate = (e) => {
    // Create a random name for the channel
    this.roomId = shortid.generate().substring(0,5);
    this.subChannel = 'wordle--' + this.roomId;

    this.pubnub.subscribe({
      channels: [this.subChannel],
      withPresence: true
    });

  // Open the modal
  Swal.fire({
    position: 'top',
    allowOutsideClick: false,
    title: 'Share this room ID with your friend',
    text: this.roomId,
    width: 275,
    padding: '0.7em',
    confirmButtonText: 'Share',
    // Custom CSS
    customClass: {
        heightAuto: false,
        title: 'title-class',
        popup: 'popup-class',
        confirmButton: 'button-class'
    }
  }).then(result => {
    Swal.fire({
      position: 'top',
      input: 'text',
      allowOutsideClick: false,
      inputPlaceholder: 'Enter email address',
      showCancelButton: true,
      confirmButtonColor: 'rgb(208,33,41)',
      confirmButtonText: 'OK',
      width: 275,
      padding: '0.7em',
      customClass: {
        heightAuto: false,
        popup: 'popup-class',
        confirmButton: 'join-button-class ',
        cancelButton: 'join-button-class'
      } 
    }).then(result => {
      axios.post(`https://twoplayerwordle.herokuapp.com/api/login/share-id/${this.roomId}/${result.value}`)
    })
  })



    this.setState({
      playerTurn: 'F',
      roomCreator: true,
      isDisabled: true, // Disable the 'Create' button
      myTake: true, // Room creator makes the 1st move
    });   
  }

    // The 'Join' button was pressed
    onPressJoin = (e) => {
      Swal.fire({
        position: 'top',
        input: 'text',
        allowOutsideClick: false,
        inputPlaceholder: 'Enter the room id',
        showCancelButton: true,
        confirmButtonColor: 'rgb(208,33,41)',
        confirmButtonText: 'OK',
        width: 275,
        padding: '0.7em',
        customClass: {
          heightAuto: false,
          popup: 'popup-class',
          confirmButton: 'join-button-class ',
          cancelButton: 'join-button-class'
        } 
      }).then((result) => {
        // Check if the user typed a value in the input field
        if(result.value){
          this.joinRoom(result.value);
        }
      })
    }
  
    // Join a room channel
    joinRoom = (value) => {
      this.roomId = value;
      this.subChannel = 'wordle--' + this.roomId;
  
      // Check the number of people in the channel
      this.pubnub.hereNow({
        channels: [this.subChannel], 
      }).then((response) => { 
          if(response.totalOccupancy < 2){
            this.pubnub.subscribe({
              channels: [this.subChannel],
              withPresence: true
            })
            
 
            this.setState({
              isDisabled: true,
              playerTurn: 'S',

            }); 
            
            this.pubnub.publish({
              message: {
                notRoomCreator: true,
              },
              channel: this.subChannel
            });
          } 
          else{
            // Game in progress
            Swal.fire({
              position: 'top',
              allowOutsideClick: false,
              title: 'Error',
              text: 'Game in progress. Try another room.',
              width: 275,
              padding: '0.7em',
              customClass: {
                  heightAuto: false,
                  title: 'title-class',
                  popup: 'popup-class',
                  confirmButton: 'button-class'
              }
            })
          }
      }).catch((error) => { 
        console.log(error);
      });
    }

    logOutUser = (e) => {

    Swal.fire({
      position: 'top',
      allowOutsideClick: false,
      title: 'Leaving Soon !!',
      text: 'Are you sure you want to Log out ?',
      width: 300,
      padding: '0.7em',
      showCancelButton: true,
      confirmButtonColor: 'rgb(208,33,41)',
      cancelButtonColor: '#aaa',
      cancelButtonText: 'Nope',
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
          localStorage.setItem('login', JSON.stringify(false));
          window.location.href = "/";
        }
    })
 }

  
  
  render() {  

    if( JSON.parse(localStorage.getItem('login')) === true) {
      return (  
        <div>
          <div className="title">
             <p className="game-title title-line">Wordle</p>
             <button className="logout-button title-line" onClick={(e) => this.logOutUser()}> Log Out </button>
           </div>
           <div className="login-line-wordle"> </div>
           {
             !this.state.gameStarted &&
                 <div className="gameboard">
                     <div className="buttons">
                         <button 
                           className="button"
                           disabled={this.state.isDisabled}
                           onClick={(e) => this.onPressCreate()}
                           > Create Game
                         </button>
                         <button 
                           className="button"
                           disabled={this.state.isDisabled}
                           onClick={(e) => this.onPressJoin()}
                           > Join Game
                         </button>
                     </div>            
                     <GameBoard
                         board={this.board}
                     />  
                                 
                   </div>
             } 
             {
              this.state.gameStarted &&
               <Wordle
                 gamechannel={this.gamingChannel}
                 board={this.board}
                 myTake={this.state.myTake}
                 roomCreator= {this.state.roomCreator}
                 pubnub={this.pubnub}
                 playerTurn={this.state.playerTurn}
               />
 
             }
        </div>
     );  
    }
    
  }
}

export default Dashboard;
