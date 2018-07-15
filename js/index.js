import React, { Component, Fragment } from "react";
import { getRandomLetters, getHighScore, score } from './board';
import Board from './components/sortable-board';
// import Board from './components/beautiful-dnd-board';
import guesser from './guesser';
import Timer from './timer';
import settings from './settings';

const Show = ({ when, children }) => when ? children : null;

const StartButton = ({ onClick }) =>
  <button id='start' onClick={onClick}>Play</button>;

const GameTime = ({ started, time }) =>
  <div id="timer"><span>{time}</span></div>;

const WordNotification = ({ word, score }) =>
  <div id="notify-is-word" className=""><b>{word}</b> is worth {score} points!</div>;

const Score = ({ message, noWordMessage, word, score }) => {
  if (!word) return <div>{noWordMessage}</div>;
  return <div>{message} <b>{word}</b>, for <b>{score}</b> points</div>;
}

const WinLose = ({ human, robot }) =>
  <div className="winner">
    {
      (human.score === robot.score) ? "It's a tie!" :
      (human.score > robot.score) ? "You win!" : "The robot wins!"
    }
  </div>

class WordList extends Component {
  constructor(props) {
    super(props);
    this.state = { show: false };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({ show: !this.state.show })
  }

  render() {
    const { show } = this.state;
    const words = this.props.words.map(w => w.word.toLowerCase()).sort();
    return (
      <div id="wordlist">
        <p>
          <a onClick={this.toggle}>
            {show ? 'hide' : 'show'} other words
          </a>
        </p>
        <div className={show ? 'show' : ''}>
          <ul>
          {words.map(word =>
            <li key={word}>
              <a target="_blank" href={`http://scrabble.merriam.com/finder/${word}`}>{word}</a>
            </li>
          )}
          </ul>
        </div>
      </div>
    );
  }
}

const initialGameData = {
  trayLetters: [],
  boardLetters: [],
  currentWord: '',
  currentScore: 0,
  guesses: [],
  robotGuesses: [],
  robotGuess: null,
  time: 0,
};

class Game extends Component {
  constructor(props){
    super(props);
    this.state = { ...initialGameData, started: false, firstGame: true, };
    this.startGame = this.startGame.bind(this);
    this.updateGuess = this.updateGuess.bind(this);
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

      const robotGuess = guesser(1, robotGuesses);

      this.setState({
        robotGuess,
        robotGuesses,
      });
      // console.log(Scribble.guesser(0, Scribble.results))
    }
  }

  updateGuess(letters) {
    // don't update guess/score if game is over
    if (!this.state.started) return;

    const currentWord = letters.join('');
    const isWord = this.props.words.includes(currentWord.toUpperCase());

    let newState = { currentWord: '', currentScore: 0 };

    if (isWord) {
      const currentScore = score(currentWord);
      const guesses = this.state.guesses.concat({ word: currentWord, score: currentScore })
      newState = { currentWord, currentScore, guesses };
    }

    this.setState(newState);
  }

  startGame(){
    const trayLetters = getRandomLetters();
    this.setState({ ...initialGameData, trayLetters, started: true, firstGame: false });
    const timer = new Timer(
      settings.gameTime,
      (count) => this.setState({ time: count }),
      (count) => this.setState({ started: false })
    );
    const combo = trayLetters.map(l => l.letter);
    this.props.worker.postMessage({ type: 'calc', combo });
    // setTimeout(() => this.setState({ started: false }), 1500);
  }

  render () {
    const {
      trayLetters,
      boardLetters,
      started,
      firstGame,
      time,
      guesses,
      robotGuesses,
      currentWord: word,
      currentScore: score,
    } = this.state;

    const humanGuess = getHighScore(guesses) || ({ score: 0 });
    const robotGuess = this.state.robotGuess || ({ score: 0 });

    const { updateGuess } = this;

    return (
      <Fragment>
        <Board {...{ trayLetters, boardLetters, started, updateGuess }} />
        <Show when={started}>
          <GameTime started={started} time={time} />
        </Show>

        <Show when={started && word}>
          <WordNotification {...{ word, score }} />
        </Show>

        <Show when={!started}>
          <StartButton onClick={this.startGame} />
        </Show>

        <Show when={!started && !firstGame}>
          <WinLose human={humanGuess} robot={robotGuess} />
          <Score
            message='Your highest scoring word was'
            noWordMessage="You didn't guess any words."
            {...humanGuess}
          />
          <Score
            message='The robot chose'
            noWordMessage="The robot couldn't think of any words."
            {...robotGuess}
          />

          <WordList words={robotGuesses} />
        </Show>
      </Fragment>
    );
  }
}

export default Game;
