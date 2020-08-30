import React from 'react'
import {View} from 'react-native'
import GameMessage from './gameMessage'
import GridContainer from './gridContainer'
import TileContainer from './tileContainer'
import dim from '../utils/dimensions'


const st = {
  container: {
    width: dim.width - dim.size['10'],
    height: dim.width - dim.size['10'],
    backgroundColor: '#bbada0',
    borderRadius: dim.size['2'],
    marginTop: dim.size['12']
  }
}

export default (props) => {
  return (
    <View style={st.container}>
      <GridContainer />
      <TileContainer tiles={props.tiles} />
      <GameMessage
        won={props.won}
        over={props.over}
        onKeepGoing={props.onKeepGoing}
        onTryAgain={props.onTryAgain}
      />
    </View>
  )
}
