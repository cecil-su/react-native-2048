import React from 'react'
import {View, Text, StyleSheet, TouchableWithoutFeedback} from 'react-native'
import dim from '../utils/dimensions'

const st = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    overflow: 'hidden',
    backgroundColor: 'rgba(238, 228, 218, .5)',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  row: {
    width: dim.width - 40,
    height: 120,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  won: {
    fontSize: 60,
    color: '#776e65',
    textAlign: 'center'
  },
  over: {
    fontSize: 60,
    color: '#776e65',
    textAlign: 'center'
  },
  lower: {
    flex: 1,
    height: 120
  },
  keepGoingContainer: {
    height: 40,
    backgroundColor: '#8f7a66',
    borderRadius: 3,
    paddingHorizontal: 15
  },
  keepGoing: {
    fontSize: 40,
    color: '#f9f6f2',
    textAlign: 'center'
  },
  tryAgainContainer: {
    height: 40,
    backgroundColor: '#8f7a66',
    borderRadius: 3,
    paddingHorizontal: 15
  },
  tryAgain: {
    fontSize: 24,
    color: '#f9f6f2',
    textAlign: 'center'
  }
})

class GameMessage extends React.Component {
  genMessage() {
    if (this.props.won) {
      return (
        <View style={st.row}>
          <Text style={st.won}>You win!</Text>
          <View style={st.lower}>
            <TouchableWithoutFeedback onPress={this.props.onKeepGoing}>
              <View style={st.keepGoingContainer}>
                <Text style={st.keepGoing}>Keep going</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      )
    }
    if (this.props.over) {
      return (
        <View style={st.row}>
          <Text style={st.over}>Game over!</Text>
          <View style={st.lower}>
            <TouchableWithoutFeedback onPress={this.props.onTryAgain}>
              <View style={st.tryAgainContainer}>
                <Text style={st.tryAgain}>Try again</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      )
    }
    
  }

  render() {
    const message = this.genMessage()
    const containerStyle = (this.props.won || this.props.over) ? {width: width - 40, height: width - 40} : {width: 0, height: 0}
    return (
      <View style={[st.container, containerStyle]}>{message}</View>
    )
  }
}

export default GameMessage
