import React from 'react'
import {View, Text, StyleSheet, TouchableWithoutFeedback} from 'react-native'
import dim from '../utils/dimensions'

const st = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    marginVertical: dim.size['5']
  },
  textContainer: {
    flex: 1,
    marginRight: dim.size['4'],
  },
  text: {
    color: '#776e65',
    fontSize: dim.size['6'],
    lineHeight: dim.size['8'],
  },
  boldText: {
    fontWeight: 'bold'
  },
  newGameContainer: {
    backgroundColor: '#8f7a66',
    padding: dim.size['4'],
    borderRadius: dim.size['2']
  },
  newGame: {
    color: '#fff',
    fontSize: dim.size['6'],
    lineHeight: dim.size['8']
  }
})

export default (props) => {
  return (
    <View style={st.container}>
      <View style={st.textContainer}>
        <Text style={st.text}>
            Join the numbers and get to the
            <Text style={st.boldText}>2048 tile!</Text>
        </Text>
      </View>
      <TouchableWithoutFeedback onPress={props.onRestart}>
        <View style={st.newGameContainer}>
          <Text style={st.newGame}>New Game</Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  )
}
