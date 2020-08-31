import React, {useState, useEffect, useCallback, useRef} from 'react'
import  {
  StyleSheet,
  View,
  UIManager,
  PanResponder,
  LayoutAnimation,
}  from 'react-native'

import StorageManager from '../utils/localStorageManager'
import Grid from '../utils/grid'
import Tile from '../utils/tile'
import dim from '../utils/dimensions'

// Views
import Heading from './heading'
import AboveGame from './aboveGame'
import GameContainer from './gameContainer'

// StorageManager
const storageManager = new StorageManager()

const styles = StyleSheet.create({
  container: {
    width: dim.width,
    height: dim.height,
    backgroundColor: '#faf8ef',
    paddingHorizontal: dim.size["5"],
  }
})

const useSetState = initialState => {
  const [state, setState] = useState(initialState)
  const setMergeState = useCallback((patch) => {
    setState((prevState) => 
      Object.assign({}, prevState, patch instanceof Function ? patch(prevState) : patch))
  }, [setState])

  return [state, setMergeState]
}

function getVector(direction) {
  const map = {
    0: {x: 0, y: -1}, // up
    1: {x: 1, y: 0}, // right
    2: {x: 0, y: 1}, // down
    3: {x: -1, y: 0} // left
  }
  return map[direction]
}

function buildTraversals(vector, size) {
  const traversals = {x: [], y: []}
  for (let pos = 0; pos < size; pos++) {
    traversals.x.push(pos)
    traversals.y.push(pos)
  }

  if (vector.x === 1) traversals.x = traversals.x.reverse()
  if (vector.y === 1) traversals.y = traversals.y.reverse()

  return traversals
}

function positionsEqual(a, b) {
  return a.x === b.x && a.y === b.y
}

export default (props) => {
  this.moving = false
  const defaultState = {
    score: 0,
    best: 0,
    tiles: [],
    size: props.size,
    grid: new Grid(props.size),
    won: false,
    over: false,
  }
  const [state, setState] = useSetState(defaultState)
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        if (this.moving == false) {
          this.moving = true
        }
      },
      onPanResponderRelease: (_, state) => {
        if (this.moving) {
          this.moving = false
          const dx = state.dx
          const dy = state.dy 
          const absDx = dx > 0 ? dx : -dx
          const absDy = dy > 0 ? dy : -dy
          const canMove = absDx > absDy ? absDx - absDy > 10 : absDx - absDy < -10
          if (canMove) {
            move(absDx > absDy ? (dx > 0 ? 1 : 3) : (dy > 0 ? 2 : 0))
          }
        }
      }
    })
  ).current
  console.log(state)

  const getRandomTiles = () => {
    return Array.from({length: props.startTiles}, () => getRandomTile())
  }

  const getRandomTile = () => {
    const value = Math.random() < 0.9 ? 2 : 4
    const pos = state.grid.randomAvailableCell()
    if (pos) {
      const tile = new Tile(pos, value)
      state.grid.insertTile(tile)
      return {
        value,
        x: pos.x,
        y: pos.y,
        prog: tile.prog
      }
    }    
  }

  const continueGame = () => {
    this.won = false 
    this.over = false
    setState({won: false, over: false})
  }

  const restart = () => {
    console.log('reset')
    continueGame()
    setup()
  }

  const keepGoing = () => {
    this.keepPlaying = true
    continueGame()
  }

  const isGameTerminated = () => {
    return this.over || (this.won && !this.keepPlaying)
  }

  const setGameState = () => {
    setState({
      tiles: getRandomTiles()
    })
  }

  const setup = () => {
    setGameState()
  }

  const addStartTiles = () => {
    for (let i = 0; i < props.startTiles; i++) {
      addRandomTile()
    }
  }

  const addRandomTile = () => {
    const cellsAvailable = state.grid.cellsAvailable()

    if (cellsAvailable) {
      const value = Math.random() < 0.9 ? 2 : 4
      const tile = new Tile(state.grid.randomAvailableCell(), value)

      state.grid.insertTile(tile)
    }
  }

  const actuate = () => {
    const tiles = []
    state.grid.cells.forEach(column => {
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
    setState({
      tiles
    })
  }

  const serialize = () => {
    return {
      grid: state.grid.serialize(),
      score: state.score,
      over: state.over,
      won: state.won,
      keepPlaying: this.keepPlaying
    }
  }

  const prepareTiles = () => {
    state.grid.eachCell((x, y, tile) => {
      if (tile) {
        tile.mergedFrom = null 
        tile.savePosition()
      }
    })
  }

  const moveTile = (tile, cell) => {
    console.log(tile, )
    state.grid.cells[tile.x][tile.y] = null 
    state.grid.cells[cell.x][cell.y] = tile 
    tile.updatePosition(cell)
  }

  const move = (direction) => {
    if (isGameTerminated()) return
    const vector = getVector(direction)
    const traversals = buildTraversals(vector, state.size)
    let cell, tile
    let moved = false
    traversals.x.forEach(x => {
      traversals.y.forEach(y => {
        cell = {x, y}
        tile = state.grid.cellContent(cell)
        console.log(tile)
        if (tile) {
          const positions = findFarthestPosition(cell, vector)
          const next = state.grid.cellContent(positions.next)

          if (next && next.value === tile.value && !next.mergedFrom) {
            const merged = new Tile(positions.next, tile.value * 2)
            merged.mergedFrom = [tile, next]

            state.grid.insertTile(merged)
            state.grid.removeTile(tile)

            tile.updatePosition(positions.next)

            setState({
              score: state.score + merged.value,
              won: merged.value === 2048
            })
          } else {
            moveTile(tile, positions.farthest)
          }

          if (!positionsEqual(cell, tile)) {
            moved = true
          }
        }
      })
    })

    if (moved) {
      addRandomTile()
      if (!movesAvailable()) {
        setState({
          over: true
        })
      }
      actuate()
    }
  }

  const findFarthestPosition = (cell, vector) => {
    let previous

    do {
      previous = cell 
      cell = {
        x: previous.x + vector.x,
        y: previous.y + vector.y
      }
    } while (
      state.grid.withinBounds(cell) &&
      state.grid.cellAvailable(cell)
    )

    return {
      farthest: previous,
      next: cell
    }
  }

  const movesAvailable = () => {
    return state.grid.cellsAvailable() || tileMatchesAvailable()
  }

  const tileMatchesAvailable = () => {
    let tile
    for (let x = 0; x < state.size; x++) {
      for (let y = 0; y < state.size; y++) {
        tile = state.grid.cellContent({x, y})

        if (tile) {
          for (let direction = 0; direction < 4; direction++) {
            const vector = getVector(direction)
            const cell = {x: x + vector.x, y: y + vector.y}

            const other = state.grid.cellContent(cell)
            if (other && other.value === tile.value) {
              return true
            }
          }
        }
      }
    }

    return false
  }

  useEffect(() => {
    setup()
  }, [])

  return (
    <View {...panResponder.panHandlers} style={styles.container}>
      <Heading score={state.score} best={state.best} />
      <AboveGame onRestart={restart} />
      <GameContainer 
        size={state.size}
        tiles={state.tiles}
        won={state.won}
        over={state.over}
        onKeepGoing={keepGoing}
      />
    </View>
  )
}
