import React from 'react'
import {View, Text, PanResponder, LayoutAnimation, UIManager} from 'react-native'
import StorageManager from '../utils/localStorageManager'
import Grid from '../utils/grid'
import Tile from '../utils/tile'
import dim from '../utils/dimensions'

// views
import Heading from './heading'
import AboveGame from './aboveGame'
import GameContainer from './gameContainer'

const st = {
  container: {
    height: dim.height,
    width: dim.width,
    backgroundColor: '#faf8ef',
    paddingHorizontal: dim.size['5']
  }
}

const storage = new StorageManager()

class Container extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tiles: [],
      score: 0,
      best: 0,
      over: false,
      win: false,
      keepPlaying: false,
      grid: new Grid(props.size),
      size: props.size,
    }

    this.panResponder = null 
  }

  componentWillMount() {
    this.setup()
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: this.onPanResponderGrant,
      onPanResponderRelease: this.onPanResponderRelease,
    })
    this.moving = false 
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true)
  }

  onPanResponderGrant = () => {
    if (this.moving === false) {
      this.moving = true
    }
  }

  onPanResponderRelease = (e, gestureState) => {
    console.log(gestureState)
    if (this.moving) {
      this.moving = false 

      const dx = gestureState.dx
      const dy = gestureState.dy
      const absDx = dx > 0 ? dx : -dx 
      const absDy = dy > 0 ? dy : -dy 
      const canMove = absDx > absDy ? absDx - absDy > 10 : absDx - absDy < -10
      if (canMove) {
        this.move(absDx > absDy ? (dx > 0 ? 1 : 3) : (dy > 0 ? 2 : 0))
      }
    }
  }

  render() {
    return (
      <View {...this.panResponder.panHandlers} style={st.container}>
        <Heading score={this.state.score} best={this.state.best} />
        <AboveGame onRestart={this.restart} />
        <GameContainer
          size={this.state.size}
          tiles={this.state.tiles}
          won={this.state.won}
          over={this.state.over}
          onKeepGoing={() => this.keepGoing()}
          onTryAgain={this.restart}
        />
      </View>
    )
  }  
  
  getRandomTiles() {
    const ret = []
    for (let i = 0; i < this.props.startTiles; i++) {
      ret.push(this.getRandomTile())
    }
    return ret
  }

  getRandomTile() {
    const value = Math.random() < 0.9 ? 2 : 4
    const pos = this.grid.randomAvailableCell()
    const tile = new Tile(pos, value)
    this.grid.insertTile(tile)
    return {
      value,
      x: pos.x,
      y: pos.y,
      prog: tile.prog
    }
  }

  continueGame() {
    this.won = false 
    this.over = false 
    this.setState({won: this.won, over: this.over})
  }

  restart = () => {
    storage.clearGameState()
    this.continueGame()
    this.setup()
  }

  keepGoing() {
    this.keepPlaying = true 
    this.continueGame()
  }

  isGameTerminated() {
    return this.over || (this.won && !this.keepPlaying)
  }

  setGameState(previousState) {
    if (previousState) {
      this.grid = new Grid(previousState.grid.size, previousState.grid.cells)
      this.score = parseInt(previousState.score)
      this.over = previousState.over == true || previousState.over === 'true'
      this.won = previousState.won == true || previousState.won === 'won'
      this.keepPlaying = previousState.keepPlaying == true || previousState.keepPlaying === 'true'
    } else {
      this.grid = new Grid(this.state.size)
      this.score = 0
      this.over = false 
      this.won = false
      this.keepPlaying = false
    }
    storage.getBestScore(best => {
      LayoutAnimation.easeInEaseOut()
      this.setState({
        best,
        tiles: this.getRandomTiles(),
      })
    })
  }

  setup() {
    storage.getGameState(result => this.setGameState(result))
  }

  addStartTiles() {
    for (let i = 0; i < this.startTiles; i++) {
      this.addRandomTile()
    }
  }

  addRandomTile() {
    const cellsAvailable = this.grid.cellsAvailable()

    if (cellsAvailable) {
      const value = Math.random() < 0.9 ? 2 : 4
      const tile = new Tile(this.grid.randomAvailableCell(), value)

      this.grid.insertTile(tile)
    }    
  }

  actuate() {
    if (this.over) {
      storage.clearGameState()
    } else {
      storage.setGameState(this.serialize())
    }

    const tiles = []
    this.grid.cells.forEach(column => {
      column.forEach(cell => {
        if (cell) {
          tiles.push({
            x: cell.x,
            y: cell.y,
            value: cell.value,
            prog: cell.prog
          })
        }
      })
    })
    storage.getBestScore(best => {
      LayoutAnimation.easeInEaseOut()
      if (best < this.score) {
        storage.setBestScore(this.score)
        this.setState({best: this.score})
      } else {
        this.setState({tiles})
      }
    })
  }

  serialize() {
    return {
      grid: this.grid.serialize(),
      score: this.score,
      over: this.over,
      won: this.won,
      keepPlaying: this.keepPlaying
    }
  }

  prepareTiles() {
    this.grid.eachCell((x, y, tile) => {
      if (tile) {
        tile.mergedFrom = null 
        tile.savePosition()
      }
    })
  }

  moveTile(tile, cell) {
    this.grid.cells[tile.x][tile.y] = null 
    this.grid.cells[cell.x][cell.y] = tile 
    tile.updatePosition(cell)
  }

  move(direction) {
    // 0: up, 1: right, 2: down, 3: left
    if (this.isGameTerminated()) return 
    let cell
    let tile 
    const vector = this.getVector(direction)
    const traversals = this.buildTraversals(vector)
    let moved = false 
    this.prepareTiles()

    traversals.x.forEach(x => {
      traversals.y.forEach(y => {
        cell = {x, y}
        tile = this.grid.cellContent(cell)

        if (tile) {
          const positions = this.findFarthestPosition(cell, vector)
          const next = this.grid.cellContent(positions.next)

          if (next && next.value === tile.value && !next.mergedFrom) {
            const merged = new Tile(positions.next, tile.value * 2)
            merged.mergedFrom = [tile, next]

            this.grid.insertTile(merged)
            this.grid.removeTile(tile)

            tile.updatePosition(positions.next)

            this.score+= merged.value 

            if (merged.value === 2048) this.won = true
          } else {
            this.moveTile(tile, positions.farthest)
          }

          if (!this.positionEqual(cell, tile)) {
            moved = true
          }
        }
      })
    })

    if (moved) {
      this.addRandomTile()
      if (!this.movesAvailable()) {
        this.over = true
      }
      this.actuate()
    }
  }

  getVector(direction) {
    const map = {
      0: {x: 0, y: -1},
      1: {x: 1, y: 0},
      2: {x: 0, y: 1},
      3: {x: -1, y: 0}
    }
    return map[direction]
  }

  buildTraversals(vector) {
    const traversals = {x: [], y: []}
    for (let pos = 0; pos < this.state.size; pos++) {
      traversals.x.push(pos)
      traversals.y.push(pos)
    }

    if (vector.x === 1) traversals.x = traversals.x.reverse()
    if (vector.y === 1) traversals.y = traversals.y.reverse()

    return traversals
  }

  findFarthestPosition(cell, vector) {
    let previous 
    do {
      previous = cell 
      cell = {
        x: previous.x + vector.x,
        y: previous.y + vector.y
      }
    } while (this.grid.withinBounds(cell) && this.grid.cellAvailable(cell))

    return {
      farthest: previous,
      next: cell
    }
  }

  movesAvailable() {
    return this.grid.cellsAvailable() || this.tileMatchesAvailable()
  }

  tileMatchesAvailable() {
    let tile 
    for (let x = 0; x < this.state.size; x++) {
      for (let y = 0; y < this.state.size; y++) {
        tile = this.grid.cellContent({x, y})
        if (tile) {
          for (let direction = 0; direction < 4; direction++) {
            const vector = this.getVector(direction)
            const cell = {x: x + vector.x, y: y + vector.y}
            const other = this.grid.cellContent(cell)

            if (other && other.value === tile.value) {
              return true
            }
          }
        }
      }
    }

    return false
  }

  positionEqual(first, second) {
    return first.x === second.x && first.y === first.y
  }
}

export default Container
