import React, { Component, Fragment } from "react";
import Sortable from 'sortablejs';

const Tile = ({ item }) => (
  <div className='letter' data-letter={item.letter}>
    <span>{item.letter}</span>
    <span className='point'>{item.points}</span>
  </div>
);

const TileSet = ({ items }) => (
  <div className='drop-target'>
    {
      items.map((item, index) => <Tile key={index} {...{item} } />)
    }
  </div>
)

class SortableBoard extends Component {
  constructor(props) {
    super(props);
    this.trayRef = React.createRef();
    this.boardRef = React.createRef();
  }

  componentDidMount() {
    const opts = {
      group: 'tiles',
      animation: 100,
      onEnd: (e) => {
        const letters = [...this.boardRef.current.children].map(c => c.dataset.letter);
        this.props.updateGuess(letters);
      }
     };
    new Sortable(this.trayRef.current, opts);
    new Sortable(this.boardRef.current, opts);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // hackity hack to move tiles back to the tray
    if (!prevProps.started && this.props.started) {
      const nodes=[...this.boardRef.current.children].map(n => this.boardRef.current.removeChild(n));
      nodes.forEach(n => this.trayRef.current.append(n))
    }
  }

  render(){
    const { trayLetters, boardLetters } = this.props;
    return (
      <Fragment>
        <div className="tray">
          <div ref={this.trayRef} className='drop-target'>
            {trayLetters.map((item, index) => <Tile key={index} {...{ item }} />)}
          </div>
        </div>
        <div className="board">
          <div ref={this.boardRef} className='drop-target'>
            {boardLetters.map((item, index) => <Tile key={index} {...{ item }} />)}
          </div>
        </div>
      </Fragment>
    );
  }
}

export default SortableBoard;
