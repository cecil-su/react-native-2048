import React from 'react'
import {View, Text, StyleSheet} from 'react-native'
import dim from '../utils/dimensions'

const st = StyleSheet.create({
  heading: {
    height: dim.size['20'],
    marginTop: dim.size['12'],
    flexDirection: 'row'
  },
  headingTitle: {
    fontSize: dim.size['12'],
    color: '#776E65',
    fontWeight: 'bold'
  },
  scores: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    alignItems: 'flex-start'
  },
  container: {
    backgroundColor: '#bbada0',
    paddingHorizontal: dim.size['5'],
    paddingVertical: dim.size['2'],
    borderRadius: dim.size['2'],
    marginLeft: dim.size['2'],
    flexDirection: 'column',
    alignItems: 'center'
  },
  containerTitle: {
    color: '#eee4da',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: dim.size['3'],
  },
  containerValue: {
    color: '#fff',
    textAlign: 'center',
    fontSize: dim.size['6'],
    fontWeight: 'bold'
  }
})

export default (props) => {
  return (
    <View style={st.heading}>
      <Text style={st.headingTitle}>2048</Text>
      <View style={st.scores}>
        <View style={st.container}>
          <Text style={st.containerTitle}>SCORE</Text>
          <Text style={st.containerValue}>{props.score}</Text>
        </View>
        <View style={st.container}>
          <Text style={st.containerTitle}>BEST</Text>
          <Text style={st.containerValue}>{props.best}</Text>
        </View>
      </View>
    </View>
  )
}
