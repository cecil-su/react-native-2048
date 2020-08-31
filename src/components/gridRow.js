import React from 'react'
import {View} from 'react-native'
import dim, {MARGIN_WIDTH, ITEM_WIDTH} from '../utils/dimensions'
import GridCell from './gridCell'

const st = {
  container: {
    height: ITEM_WIDTH,
    marginVertical: dim.size['2'],
    flexDirection: 'row'
  }
}

export default () => (
  <View style={st.container}>
    <GridCell />
    <GridCell />
    <GridCell />
    <GridCell />
  </View>
)
