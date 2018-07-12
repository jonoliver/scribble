import React, { Component } from "react";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { getRandomLetters, reorder, move, score } from './board';
import Timer from './timer';
import words from './words';

const GameTime = ({ started, time }) => started
  ? <div id="timer"><span>{time}</span></div>
  : null;

const WordNotification = ({ isWord, word, score }) => (
  isWord
    ? <div id="notify-is-word" className="">{word} is worth {score} points!</div>
    : null
)

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

const initialGameData = () => {
  const trayLetters = getRandomLetters();
  const boardLetters = [];

  return {
    trayLetters,
    boardLetters,
    isWord: false,
    currentWord: '',
    currentPoints: 0,
    guesses: [],
    time: 0,
  }
}

class Game extends Component {
  constructor(props){
    super(props);
    this.state = { ...initialGameData(), started: false };
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

    if (source.droppableId === 'boardLetters' || destination.droppableId === 'boardLetters') {
      const currentWord = this.state.boardLetters.map(l => l.letter).join('');
      const isWord = words.includes(currentWord.toUpperCase());
      const currentScore = score(currentWord);
      const guesses = isWord
        ? this.state.guesses.concat({ word: currentWord, score: currentScore })
        : this.state.guesses
      this.setState({ isWord, currentWord, currentScore, guesses });
    }
  }

  startGame(){
    this.setState({ ...initialGameData(), started: true });
    const timer = new Timer(3,
      (count) => this.setState({ time: count }),
      (count) => this.setState({ started: false })
    );
    // setTimeout(() => this.setState({ started: false }), 1500);
  }

  render () {
    const {
      trayLetters,
      boardLetters,
      started,
      isWord,
      currentWord: word,
      currentScore: score,
      time,
    } = this.state;
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <LetterSet droppableId="trayLetters" items={trayLetters} />
        <div id="guess">
          <LetterSet droppableId="boardLetters" items={boardLetters} />
        </div>
        <GameTime started={started} time={time} />
        <StartButton started={started} onClick={this.startGame} />
        <WordNotification {...{ isWord, word, score }} />
      </DragDropContext>
    );
  }
}

export default () => <Game />;
