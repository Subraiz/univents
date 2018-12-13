import React, { Component } from "react";
import { View, Image, Platform } from "react-native";
let RNFS = require("react-native-fs");
import FastImage from "react-native-fast-image";
import shorthash from "shorthash";

console.log(RNFS.CachesDirectoryPath);

class CacheImage extends Component {
  state = { source: null };
  loadFile = path => {
    this.setState({ source: { uri: path } });
  };
  downloadFile = (uri, path) => {
    RNFS.downloadFile({ fromUrl: uri, toFile: path }).promise.then(res =>
      this.loadFile(path)
    );
  };
  componentDidMount() {
    const { uri } = this.props;
    const name = shorthash.unique(uri);
    const extension = Platform.OS === "android" ? "file://" : "";
    const path = `${extension}${RNFS.CachesDirectoryPath}/${name}.png`;
    RNFS.exists(path).then(exists => {
      if (exists) this.loadFile(path);
      else this.downloadFile(uri, path);
    });
  }

  render() {
    return <FastImage style={this.props.style} source={this.state.source} />;
  }
}
export default CacheImage;
