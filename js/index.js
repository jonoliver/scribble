import React, { Component } from "react";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { getRandomLetters, reorder, move, score } from './board';
import Timer from './timer';

const Show = ({ when, children }) => when ? children : null;

const StartButton = ({ onClick }) =>
  <button id='start' onClick={onClick}>Play</button>;

const GameTime = ({ started, time }) =>
  <div id="timer"><span>{time}</span></div>;

const WordNotification = ({ word, score }) =>
  <div id="notify-is-word" className="">{word} is worth {score} points!</div>;

const Score = ({ message, word, score }) =>
  <div>{message} <b>{word}</b>, for <b>{score}</b> points</div>;

const HighScore = ({ message, guesses }) => {
  if (guesses.length === 0) return null;
  const highScore = guesses.sort((a, b) => b.score - a.score)[0];
  const { word, score } = highScore;
  return <Score {...{ message, word, score }} />
}

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

const initialGameData = {
  trayLetters: [],
  boardLetters: [],
  isWord: false,
  currentWord: '',
  currentPoints: 0,
  guesses: [],
  robotGuesses: [],
  robotGuess: '',
  time: 0,
};

class Game extends Component {
  constructor(props){
    super(props);
    this.state = { ...initialGameData, started: false };
    this.onDragEnd = this.onDragEnd.bind(this);
    this.startGame = this.startGame.bind(this);
  }

  componentDidMount() {
    this.props.worker.onmessage = (e) => {
      if (e.data.match) {
        // const word = e.data.match;
        // const robotGuesses = this.state.robotGuesses.concat({ word, score: score(word) });
        // this.setState({ robotGuesses });
        return;
      }
      const robotGuesses = e.data
        .map(w => ({ word: w, score: score(w) }))
        .sort((a, b) => b.score - a.score);
      this.setState({ robotGuesses });
      // console.log(Scribble.guesser(0, Scribble.results))
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

    if (source.droppableId === 'boardLetters' || destination.droppableId === 'boardLetters') {
      const currentWord = this.state.boardLetters.map(l => l.letter).join('');
      const isWord = this.props.words.includes(currentWord.toUpperCase());
      const currentScore = score(currentWord);
      const guesses = isWord
        ? this.state.guesses.concat({ word: currentWord, score: currentScore })
        : this.state.guesses
      this.setState({ isWord, currentWord, currentScore, guesses });
    }
  }

  startGame(){
    const trayLetters = getRandomLetters();
    this.setState({ ...initialGameData, trayLetters, started: true });
    const timer = new Timer(10,
      (count) => this.setState({ time: count }),
      (count) => this.setState({ started: false })
    );
    console.log({trayLetters});
    const combo = trayLetters.map(l => l.letter);
    this.props.worker.postMessage({ type: 'calc', combo });
    // setTimeout(() => this.setState({ started: false }), 1500);
  }

  render () {
    const {
      trayLetters,
      boardLetters,
      started,
      isWord,
      time,
      guesses,
      robotGuesses,
      currentWord: word,
      currentScore: score,
    } = this.state;

    const robotGuess = robotGuesses[0];

    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <LetterSet droppableId="trayLetters" items={trayLetters} />
        <div id="guess">
          <LetterSet droppableId="boardLetters" items={boardLetters} />
        </div>

        <Show when={!started}>
          <StartButton onClick={this.startGame} />
        </Show>

        <Show when={started}>
          <GameTime started={started} time={time} />
        </Show>

        <Show when={started && isWord}>
          <WordNotification {...{ word, score }} />
        </Show>

        <Show when={!started}>
          <HighScore message='Your highest scoring word was' {...{ guesses }} />
          <Show when={robotGuesses.length > 0}>
            <Score message='The robot chose' {...robotGuess} />
          </Show>
        </Show>

      </DragDropContext>
    );
  }
}

export default Game;
