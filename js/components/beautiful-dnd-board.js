import React, { Component } from "react";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { reorder, move } from '../board';

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

class BeautifulDnDBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trayLetters: props.trayLetters,
      boardLetters: [],
    }
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  componentWillReceiveProps({ trayLetters, started }) {
    if (!this.props.started && started) {
      this.setState({ trayLetters, boardLetters: [] });
    }
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

    // update guesses/score
    if (source.droppableId === 'boardLetters' || destination.droppableId === 'boardLetters') {
      this.props.updateGuess(this.state.boardLetters.map(l => l.letter));
    }
  }

  render(){
    const { trayLetters, boardLetters } = this.state;
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <LetterSet droppableId="trayLetters" items={trayLetters} />
        <div id="guess">
          <LetterSet droppableId="boardLetters" items={boardLetters} />
        </div>
      </DragDropContext>
    );
  }
}

export default BeautifulDnDBoard;
