import React, { Component } from "react";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { getRandomLetters, reorder, move } from './board';

const Letter = ({ index, item }) => (
  <Draggable draggableId={item.id} index={index}>
    {(provided, snapshot) => (
      <div
        className='letter'
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
      >
        <span>{item.letter}</span>
        <span className='point'>{item.points}</span>
      </div>
    )}
  </Draggable>
);

const LetterSet = ({ droppableId, items }) => (
  <Droppable droppableId={droppableId} direction="horizontal">
    {(provided, snapshot) => (
      <div className='drop-target'
        ref={provided.innerRef}
        {...provided.droppableProps}
      >
      {
        items.map((item, index) => <Letter key={index} {...{ index, item} } />)
      }
      {provided.placeholder}
    </div>
    )}
  </Droppable>
)

const StartButton = ({ started, onClick }) => (
  started ? null :
  <button id='start' onClick={onClick}>Play</button>
);

class Game extends Component {
  constructor(props){
    super(props);

    const trayLetters = getRandomLetters();
    const boardLetters = [];

    this.state = {
      trayLetters,
      boardLetters,
      started: false,
    }

    this.onDragEnd = this.onDragEnd.bind(this);
    this.startGame = this.startGame.bind(this);
  }

  onDragEnd(result) {
    // dropped outside the list
    const { source, destination } = result;

    if (!destination) return;

    if (source.droppableId === destination.droppableId) {
      const letters = reorder(
        this.state[source.droppableId],
        result.source.index,
        result.destination.index
      );

      this.setState({
        [source.droppableId]: letters,
      });
    }
    else {
      const letters = move(
        this.state[source.droppableId],
        this.state[destination.droppableId],
        source,
        destination
      );
      this.setState({
        trayLetters: letters.trayLetters,
        boardLetters: letters.boardLetters,
      });
    }
  }

  startGame(){
    this.setState({
      started: true,
      trayLetters: getRandomLetters(),
      boardLetters: [],
    });
    setTimeout(() => this.setState({ started: false }), 1500);
  }

  render () {
    const { trayLetters, boardLetters, started } = this.state;
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <LetterSet droppableId="trayLetters" items={trayLetters} />
        <div id="guess">
          <LetterSet droppableId="boardLetters" items={boardLetters} />
        </div>
        <StartButton started={started} onClick={this.startGame} />
      </DragDropContext>
    );
  }
}

export default () => <Game />;
