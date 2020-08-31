import React from 'react'
import {View,Text,StyleSheet} from 'react-native'
import dim, {MARGIN_WIDTH, ITEM_WIDTH} from '../utils/dimensions'


const styles = StyleSheet.create({
  tile:{
    position: 'absolute',
    borderRadius: dim.size["1"],
	  flexDirection:"row",
	  justifyContent:"center",
    alignItems:"center"
  },
  tileText: {
    fontSize: dim.size["14"],
    color: '#776E65',
    textAlign: 'center',
	  textAlignVertical:"center",
	  flex:1
  },
  tile2: {
    backgroundColor: '#eee4da',
  },
  tile4: {
    backgroundColor: '#eee1c9',
  },
  tile8: {
    backgroundColor: '#f3b27a',
  },
  tile8Text: {
    color: '#f9f6f2',
  },
  tile16: {
    backgroundColor: '#f69664',
  },
  tile16Text: {
    color: '#f9f6f2',
  },
  tile32: {
    backgroundColor: '#f77c5f',
  },
  tile32Text: {
    color: '#f9f6f2',
    marginTop: dim.size["2"],
  },
  tile64: {
    backgroundColor: '#f75f3b',
  },
  tile64Text: {
    color: '#f9f6f2',
  },
  tile128: {
    backgroundColor: '#edd073',
  },
  tile128Text: {
    color: '#f9f6f2',
    fontSize: dim.size["10"]
  },
  tile256: {
    backgroundColor: '#edcc62',
  },
  tile256Text: {
    color: '#f9f6f2',
    fontSize: dim.size["8"],
    marginTop: dim.size["2"],
  },
  tile512: {
    backgroundColor: '#edc950',
  },
  tile512Text: {
    color: '#f9f6f2',
    fontSize:dim.size["8"],
  },
  tile1024: {
    backgroundColor: '#edc53f',
  },
  tile1024Text: {
    color: '#f9f6f2',
    fontSize: dim.size["6"],
  },
  tile2048: {
    backgroundColor: '#edc22e',
  },
  tile2048Text: {
    color: '#f9f6f2',
    fontSize: dim.size["6"],
    marginTop: dim.size["4"],
  },
  tilesuper: {
    backgroundColor: '#3c3a33',
    fontSize: dim.size["5"]
  },
  tilesuperText: {
    color: '#f9f6f2',
  },
})

const Tile = (props) => {
  const tileStyle = props.value<= 2048 ? styles['tile' + props.value] : styles['tilesuper']
  const tilePositionStyle = {
    left: props.x*(ITEM_WIDTH+MARGIN_WIDTH*2)+MARGIN_WIDTH*2,
    top: props.y*(ITEM_WIDTH+MARGIN_WIDTH*2)+MARGIN_WIDTH*2,
    width: ITEM_WIDTH,
    height: ITEM_WIDTH,
  }
  const tileTextStyle = props.value<= 2048 ? styles['tile' + props.value + 'Text'] : styles['tilesuperText']
  return (
    <View style={[styles.tile, tileStyle, tilePositionStyle]}>
      <Text style={[ styles.tileText,tileTextStyle]}>{props.value}</Text>
    </View>
  )
}

export default Tile