import React, { Component } from "react";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

const Letter = ({ index, item }) => (
  <Draggable draggableId={index} index={index}>
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
      <div style={{display: 'flex'}}
        ref={provided.innerRef}
        {...provided.droppableProps}
      >
      {
        items.map((item, index) => <Letter key={index} {...{ index, item} } />)
      }
    </div>
    )}
  </Droppable>
)

class Game extends Component {
  constructor(props){
    super(props);

    const trayLetters = [
      {
        letter: 'A',
        points: 1,
      },
      {
        letter: 'B',
        points: 2,
      },
      {
        letter: 'C',
        points: 3,
      },
    ]

    const boardLetters = [
      {
        letter: 'C',
        points: 3,
      },
      {
        letter: 'B',
        points: 2,
      },
    ]

    this.state = {
      items: { trayLetters, boardLetters }
    }
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onDragEnd(result) {
    // dropped outside the list
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const trayLetters = reorder(
        this.state.items.trayLetters,
        result.source.index,
        result.destination.index
      );

      const { boardLetters } = this.state.items;

      this.setState({
        items: { trayLetters, boardLetters },
      });
    }
    else {
      const result = move(
        this.state.items[source.droppableId],
        this.state.items[destination.droppableId],
        source,
        destination
      );
      console.log(result);
      this.setState({
        items: {
          trayLetters: result.trayLetters,
          boardLetters: result.boardLetters,
        }
      });
    }
  }

  render () {
    const { items } = this.state;
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <LetterSet droppableId="trayLetters" items={items.trayLetters} />
        <LetterSet droppableId="boardLetters" items={items.boardLetters} />
      </DragDropContext>
    );
  }
}

export default ({ message }) => <Game />;
