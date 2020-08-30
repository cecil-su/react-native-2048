import React from 'react'
import {View} from 'react-native'
import dim from '../utils/dimensions'
import GridCell from './gridCell'
const {width} = dim.get('window')

const MARGIN_WIDTH = dim.size['2']
const ITEM_WIDTH = (width - dim.size['10'] - MARGIN_WIDTH * 10) / 4

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
