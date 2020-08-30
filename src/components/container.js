import React from 'react'
import {View, Text, PanResponder, LayoutAnimation, NativeModules} from 'react-native'
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
  }

  componentDidMount() {
    this.setup()
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this.onStartShouldSetPanResponder,
      onMoveShouldSetPanResponder: this.onMoveShouldSetPanResponder,
      onPanResponderGrant: this.onPanResponderGrant,
      onPanResponderMove: this.onPanResponderMove,
      onPanResponderRelease: this.onPanResponderRelease,
    })
  }

  onStartShouldSetPanResponder = () => {
    return true
  }

  onMoveShouldSetPanResponder = () => {
    return true
  }

  onPanResponderGrant() {
    if (this.moving === false) {
      this.moving = true
    }
  }

  onPanResponderMove() {}

  onPanResponderRelease(e, gestureState) {
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
      <View {...this.panResponder} style={st.container}>
        <Heading score={this.state.score} best={this.state.best} />
        <AboveGame onRestart={this.restart} />
        <GameContainer
          size={this.state.size}
          tiles={this.state.tiles}
          won={this.state.won}
          over={this.state.over}
          onKeepGoing={() => console.log('keep going')}
          onTryAgain={this.restart}
        />
      </View>
    )
  }

  restart = () => {}

  setup() {
    storage.getGameState(result => this.setGameState(result))
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

  move(direction) {
    
  }
}

export default Container
