import {AsyncStorage} from 'react-native'

class LocalStorageManager {
  constructor() {
    this.bestScoreKey = 'bestScore'
    this.gameStateKey = 'gameState'
    this.stroage = AsyncStorage
  }

  getItem({key, error, success}) {
    AsyncStorage.getItem(key, (err, result) => {
      if (err) {
        error(err)
      } else {
        success(result)
      }
    })
  }

  setItem({key, value, error, success}) {
    AsyncStorage.setItem(key, value, (err, result) => {
      if (err) {
        error(err)
      } else {
        success(result)
      }
    })
  }

  removeItem({key, error, success}) {
    AsyncStorage.removeItem(key, (err, result) => {
      if (err) {
        error(err)
      } else {
        success(result)
      }
    })
  }

  getBestScore(callback) {
    const cb = callback ? callback : function() {}
    this.getItem({
      key: this.bestScoreKey,
      error: err => console.log(err),
      success: (result) => {
        cb(result && !isNaN(result) ? parseInt(result) : 0)
      }
    })
  }

  setBestScore(score, callback) {
    const cb = callback ? callback : function() {}
    this.setItem({
      key: this.bestScoreKey,
      value: score,
      error: err => console.log(err),
      success: cb,
    })
  }

  getGameState(callback) {
    return this.getItem({
      key: this.gameStateKey,
      error: err => console.log(err),
      success: result => {
        const state = result ? JSON.parse(result) : null
        callback(state)
      }
    })
  }

  setGameState(gameState, callback) {
    const cb = callback ? callback : function() {}
    const json = gameState ? JSON.stringify(gameState) : null
    this.setItem({
      key: this.bestScoreKey,
      value: json,
      error: err => console.log(err),
      success: cb
    })
  }

  clearGameState(callback) {
    const cb = callback ? callback : function() {}
    this.removeItem({
      key: this.bestScoreKey,
      error: err => console.log(err),
      success: cb
    })
  }
}

export default LocalStorageManager