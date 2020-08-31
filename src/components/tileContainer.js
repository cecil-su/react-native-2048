import React from 'react'
import {View} from 'react-native'
import dim from '../utils/dimensions'
import Tile from './tile'

const st = {
  container: {
    width: dim.width - dim.size['10'],
    height: dim.width - dim.size['10'],
    position: 'absolute',
    left: 0,
    top: 0,
    overflow: 'hidden'
  }
}

export default (props) => {
  const children = props.tiles || []
  return (
    <View style={st.container}>
      {
        children.map(d => (
          <Tile x={d.x} y={d.y} value={d.value} key={d.prog} />
        ))
      }
    </View>
  )
}
