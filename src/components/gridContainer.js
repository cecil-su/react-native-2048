import React from 'react'
import {View} from 'react-native'
import GridRow from './gridRow'
import dim from '../utils/dimensions'
const {width} = dim.get('window')

const st = {
  container: {
    width: width - dim.size['10'],
    height: width - dim.size['10'],
    position: 'absolute',
    left: 0,
    top: 0,
    overflow: 'hidden',
    padding: dim.size['2'],
    flexDirection: 'column'
  }
}

export default () => (
  <View style={st.container}>
    <GridRow />
    <GridRow />
    <GridRow />
    <GridRow />
  </View>
)
