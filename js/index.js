import React, { Component } from "react";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const Letter = ({ index, item, provided }) => (
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


class Tray extends Component {
  constructor(props){
    super(props);

    const items = [
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
    this.state = {
      items
    }
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      this.state.items,
      result.source.index,
      result.destination.index
    );
    this.setState({
      items,
    });
  }

  render () {
    const { items } = this.state;
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
      <Droppable droppableId="droppable" direction="horizontal">
        {(provided, snapshot) => (
          <div style={{display: 'flex'}}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
          {
            items.map((item, index) => <Letter key={index} {...{ index, item, provided} } />)
          }
        </div>
        )}
      </Droppable>
    </DragDropContext>
  );

  }
}

export default ({ message }) => <Tray />;
