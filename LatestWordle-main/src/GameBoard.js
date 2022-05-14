import React, { Component } from 'react';
import Letter from './Letter'

class GameBoard extends Component {

  constructor(props) {
    super(props)
    this.globalCounter = 0;
  
  }


   createBoard = (row, column) => {
        const board = [];


        if(this.props.playerTurn === 'F') {
          for (let i = 0; i < row; i+=1) {
            let counter = 0;
            const columns = []

            if( i % 2 === 0) {
           
              for (let j = 0; j < column; j+=1) {
                columns.push(this.renderLetterFirstPlayer(i, j, counter++));
            }
            board.push(<div key={i} className="board-row">{columns}</div>);
            }
            
            if(i % 2 !== 0) {
           
              for (let j = 0; j < column; j+=1) {
                columns.push(this.renderLetter(i, j, counter++));
            }
            board.push(<div key={i} className="board-row">{columns}</div>);
            }
           
        }

          return board;
        }

        if(this.props.playerTurn === 'S') {
          for (let i = 0; i < row; i+=1) {
            let counter = 0;
            const columns = []

            if( i % 2 === 0) {
       
              for (let j = 0; j < column; j+=1) {
                columns.push(this.renderLetter(i, j, counter++));
            }
            board.push(<div key={i} className="board-row">{columns}</div>);
            }
            
            if(i % 2 !== 0) {
            
              for (let j = 0; j < column; j+=1) {
                columns.push(this.renderLetterFirstPlayer(i, j, counter++));
            }
            board.push(<div key={i} className="board-row">{columns}</div>);
            }
           
        }
          return board;
        }

        if(this.props.playerTurn === undefined) {
          for (let i = 0; i < row; i+=1) {
            let counter = 0;
            const columns = []
            for (let j = 0; j < column; j+=1) {
                columns.push(this.renderLetter(i, j, counter++));
            }
            board.push(<div key={i} className="board-row">{columns}</div>);
        }

          return board;
        }
       

   }

   renderLetterFirstPlayer = (i, j , counter) => {

    let currentWord = this.props.wordle;
    


    if(this.props.board[i].charAt(j) === currentWord.charAt(j)) {
     
      return (<Letter
      key={counter}
      value={this.props.board[i].charAt(j)}
      styles={'green'}
      />);
    } else {
     
      return (
        <Letter
          key={counter}
          value={this.props.board[i].charAt(j)}
          styles={'letter'}
        />
      );
    }

   }

   renderLetter(i, j, counter) {
    return (
      <Letter
        key={counter}
        value={this.props.board[i].charAt(j)}
        styles={'letter'}
      />
    );
  }

    render() {
        return <div className='create-board'>{this.createBoard(6, 5)}</div>;
    }

}

export default GameBoard