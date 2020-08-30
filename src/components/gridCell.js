import React from 'react'
import {View} from 'react-native'
import dim, {ITEM_WIDTH, MARGIN_WIDTH} from '../utils/dimensions'

const st = {
  container: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH,
    marginHorizontal: MARGIN_WIDTH,
    backgroundColor: 'rgba(238, 228, 218, 0.35)',
    bordeRadius: dim.size['1']
  }
}

export default () => (<View style={st.container} />)
