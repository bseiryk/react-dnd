import React from 'react';
import './App.css';

const FOLDER_NAMES = ['left', 'right'];

class App extends React.PureComponent {

  state = {
    left: [
      {
        order: 1,
        value: 1,
        id: '1',
      },
      {
        order: 2,
        value: 2,
        id: '2',
      },
      {
        order: 3,
        value: 3,
        id: '3',
      },
      {
        order: 4,
        value: 4,
        id: '4',
      },
      {
        order: 5,
        value: 5,
        id: '5',
      },
      {
        order: 6,
        value: 6,
        id: '6',
      },
    ],
    right: [],
    isDraging: false
  }

  onDragStart = (e) => {
    const target = e.target
    this.draggableIdx = Number(target.dataset.index);
    this.draggableId = target.id;
    this.fromFolder = target.dataset.foldername;

    setTimeout(() => {
      this.setState({ isDraging: true });
    }, 0)
  }

  onDrop = (e) => {
    e.preventDefault();
    this.draggableIdx = null;
    this.draggableId = null;
    this.fromFolder = null;
    this.setState({ isDraging: false });
  }

  moveToOtherFolder = (toFolder, fromFolder) => {
    const result = this.state[fromFolder].reduce((acc, el) => {
      if (el.id === this.draggableId) acc.movingItem = el;
      else acc[fromFolder].push(el)
      return acc;
    }, {
      [fromFolder]: [],
      movingItem: null,
    })

    this.setState({
      [toFolder]: [...this.state[toFolder], result.movingItem],
      [fromFolder]: result[fromFolder],
    })
    this.draggableIdx = this.state[toFolder].length;
    this.fromFolder = toFolder;
  }

  moveInsideCurentFolder = (e) => {
    const mouseY = e.clientY;
    const hoveredIdx = Number(e.target.dataset.index);
    const { top, height } = e.target.getBoundingClientRect();

    let isMovable;

    if (hoveredIdx > this.draggableIdx) {
      isMovable = (top + (height / 2)) < mouseY;
    } else {
      isMovable = (top + (height / 2)) > mouseY;
    }

    if (isMovable) {
      const data = this.state[this.fromFolder];
      
      const [draggableItem] = data.splice(this.draggableIdx, 1);
      data.splice(hoveredIdx, 0, draggableItem);

      this.draggableIdx = hoveredIdx;

      this.setState({
        [this.fromFolder]: [...data]
      })
    }
  }

  onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
    const id = e.target.id;

    if (id !== this.fromFolder && FOLDER_NAMES.includes(id)){
      this.moveToOtherFolder(id, this.fromFolder)
    } else if (id && id === 'drag_foreground') {
      this.moveInsideCurentFolder(e)
    };
  }

  renderData = (folderName) => {
    return this.state[folderName].map((el, idx) => {
      return (
      <div
        draggable="true"
        className={this.draggableId === el.id && this.state.isDraging ? 'dragging' : ''}
        id={el.id}
        key={el.id}
        data-index={idx}
        data-foldername={folderName}
        onDragStart={this.onDragStart}
      >
        <div
          className='drag_foreground'
          id='drag_foreground'
          data-foldername={folderName}
          data-index={idx}
        />
        <div className='item-content'>
          {el.value}
        </div>
      </div>)
    })
  }

  render() {
    return (
      <div className="App">
        <div
          className='left'
          id='left'
          onDrop={this.onDrop}
          onDragOver={this.onDragOver}
        >
          {
            this.renderData('left')
          }
        </div>
        <div
          className="right"
          id="right"
          onDrop={this.onDrop}
          onDragOver={this.onDragOver}
        >
          {
            this.renderData('right')
          }
        </div>
      </div>
    );
  }
}

export default App;
