import React, { Component } from "react";
import {
  Text,
  View,
  Button,
  SafeAreaView,
  Dimensions,
  Image,
  StatusBar,
  TouchableOpacity,
  UIManager,
  LayoutAnimation
} from "react-native";
import QRCode from "react-native-qrcode";
import QRCodeModal from "../components/QRCodeModal";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { signOutUser } from "../redux/actions/SettingsActions";
import { createStackNavigator } from "react-navigation";
import ProfileTabNavigator from "../navigation/ProfileTabNavigator";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
let userStringInfo;

const ProfileNavigator = createStackNavigator(
  {
    ProfileTabs: ProfileTabNavigator
  },
  {
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
      initialRouteName: "PastEvents"
    }
  }
);

class Profile extends Component {
  static navigationOptions = {
    header: null,
    gesturesEnabled: false
  };
  static router = ProfileNavigator.router;

  state = {
    showModal: false
  };

  setSize() {
    //LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    this.setState({ showModal: !this.state.showModal });
  }

  componentWillMount() {
    let {
      firstName,
      lastName,
      email,
      interests,
      major,
      year,
      school,
      sex,
      uid,
      ethnicity
    } = this.props;

    let interestString = "";
    interests.forEach((interest, i) => {
      if (i == 0) {
        interestString += interest;
      } else {
        interestString += `,${interest}`;
      }
    });
    userStringInfo = `${firstName} ${lastName} ${email} ${major} ${year} ${sex} ${ethnicity} ${uid} ${interestString}`;
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headerStyle}>
          <View style={styles.avatarContainerStyle}>
            <Image
              style={styles.avatarStyle}
              borderRadius={57.5}
              source={this.props.avatarSource}
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.nameTextStyle}>
              {this.props.firstName} {this.props.lastName}
            </Text>
            <Text style={styles.schoolTextStyle}>Boston College</Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.95}
            style={styles.qrCodeContainer}
            onPress={() => this.setSize()}
          >
            <QRCode
              value={userStringInfo}
              size={50}
              bgColor="black"
              fgColor="white"
            />
          </TouchableOpacity>
        </View>
        <ProfileNavigator navigation={this.props.navigation} />
        <QRCodeModal
          value={userStringInfo}
          visible={this.state.showModal}
          onPress={this.setSize.bind(this)}
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  let {
    firstName,
    lastName,
    email,
    interests,
    major,
    year,
    school,
    sex,
    uid,
    ethnicity,
    avatarSource
  } = state.user;
  return {
    firstName,
    lastName,
    email,
    interests,
    major,
    year,
    school,
    sex,
    ethnicity,
    uid,
    avatarSource
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      signOutUser: signOutUser
    },
    dispatch
  );
};

const styles = {
  container: {
    backgroundColor: "white",
    height: screenHeight
  },
  headerStyle: {
    height: screenHeight * 0.4,
    backgroundColor: "white"
  },
  avatarContainerStyle: {
    alignSelf: "center",
    backgroundColor: "white",
    width: 115,
    height: 115,
    borderWidth: 1.5,
    borderColor: "white",
    borderRadius: 115,
    marginTop: screenHeight * 0.05,
    shadowOffset: { width: -2, height: 3 },
    shadowColor: "black",
    shadowOpacity: 0.2
  },
  avatarStyle: {
    width: 115,
    height: 115,
    borderWidth: 2,
    borderColor: "white"
  },
  textContainer: {
    marginTop: screenHeight * 0.02,
    alignItems: "center"
  },
  nameTextStyle: {
    color: "black",
    fontWeight: "600",
    fontSize: 22
  },
  schoolTextStyle: {
    color: "black",
    fontWeight: "200",
    fontSize: 22
  },
  buttonContainer: {
    flex: 1,
    marginTop: screenHeight * 0.2
  },
  navigtorStyle: {
    zIndex: -1
  },
  qrCodeContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: screenHeight * 0.01
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);
