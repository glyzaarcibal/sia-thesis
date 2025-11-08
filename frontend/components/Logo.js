import React from 'react'
import { Image, StyleSheet } from 'react-native'

export default function Logo() {
  return <Image source={require('./../assets/images/cutelogo.jpg')} style={styles.image} />
}

const styles = StyleSheet.create({
  image: {
    width: 210,
    height: 180,
    marginBottom: 8,
  },
})
