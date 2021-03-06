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
  LayoutAnimation,
  ScrollView,
  Animated
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import QRCode from "react-native-qrcode";
import QRCodeModal from "../components/QRCodeModal";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  signOutUser,
  refreshEmailVerified,
  resendVerification
} from "../redux/actions/SettingsActions";
import { createStackNavigator } from "react-navigation";
import CacheImage from "../components/common/CacheImage";
import PrivacyModal from "./PrivacyModal";
import EditAccountModal from "../components/EditAccountModal";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const HEADER_MAX_HEIGHT = 120;
const HEADER_MIN_HEIGHT = 70;
const PROFILE_IMAGE_MAX_HEIGHT = 80;
const PROFILE_IMAGE_MIN_HEIGHT = 40;

const Row = ({ title, sections }) => {
  function renderSections() {
    return sections.map((section, i) => {
      return (
        <TouchableOpacity
          onPress={section.onPress}
          activeOpacity={0.65}
          key={section + i}
          style={{
            paddingLeft: 15,
            paddingRight: 15,
            paddingTop: 10,
            paddingBottom: 10,
            marginTop: 8,
            fontSize: 13,
            backgroundColor: "white",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <Text style={{ fontSize: 16, fontFamily: "PublicSans-Light" }}>
            {section.title}
          </Text>
          <Icon
            name="ios-arrow-forward"
            style={{ fontSize: 22, opacity: 0.6 }}
          />
        </TouchableOpacity>
      );
    });
  }

  return (
    <View style={{ marginBottom: 15 }}>
      <Text
        style={{
          paddingLeft: 16,
          fontSize: 20,
          paddingBottom: 10,
          paddingTop: 10,
          fontFamily: "PublicSans-SemiBold",
          color: "black"
        }}
      >
        {title}
      </Text>
      <View>{renderSections()}</View>
    </View>
  );
};

class Profile extends Component {
  static navigationOptions = {
    header: null,
    gesturesEnabled: false
  };

  constructor(props) {
    super(props);
    this.AccountSettings;
    this.userStringInfo;
  }

  state = {
    scrollY: new Animated.Value(0),
    showModal: false,
    didResend: false,
    created: this.props.createdEvents.length,
    favorited: this.props.favoritedEvents.length,
    attended: this.props.attendedEvents.length,
    showPrivacy: false,
    showEditAccount: false
  };

  componentWillReceiveProps() {}

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
    } = this.props.user;

    this.screenWillFocus = this.props.navigation.addListener(
      "willFocus",
      () => {
        this.setState({
          created: this.props.createdEvents.length,
          favorited: this.props.favoritedEvents.length,
          attended: this.props.attendedEvents.length
        });
      }
    );

    this.AccountSettings = [
      {
        title: "Account Display",
        onPress: () => this.setState({ showEditAccount: true })
      },
      {
        title: "Privacy",
        onPress: () => {
          this.setState({ showPrivacy: true });
        }
      },
      {
        title: "Sign Out",
        onPress: () => {
          this.props.navigation.navigate("Login");
          this.props.signOutUser();
        }
      }
    ];

    let interestString = "";
    interests.forEach((interest, i) => {
      if (i == 0) {
        interestString += interest;
      } else {
        interestString += `,${interest}`;
      }
    });
    major = major.replace(/\s/g, "");
    this.userStringInfo = `${firstName.trim()} ${lastName.trim()} ${email.trim()} ${major.trim()} ${year.trim()} ${sex.trim()} ${uid.trim()} ${interestString}`;
    this.props.refreshEmailVerified();
  }

  componentWillUnmount() {
    this.screenWillFocus.remove();
  }

  renderModal() {
    this.setState({ showModal: !this.state.showModal });
  }

  resendVerification() {
    this.props.resendVerification();
    this.setState({ didResend: true });
    setTimeout(() => this.setState({ didResend: false }), 5000);
  }

  render() {
    const headerHeight = this.state.scrollY.interpolate({
      inputRange: [
        -[HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
        0,
        HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT
      ],
      outputRange: [
        HEADER_MAX_HEIGHT * 1.5,
        HEADER_MAX_HEIGHT,
        HEADER_MIN_HEIGHT
      ],
      extrapolate: "clamp"
    });
    const profileImageHeight = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
      outputRange: [PROFILE_IMAGE_MAX_HEIGHT, PROFILE_IMAGE_MIN_HEIGHT],
      extrapolate: "clamp"
    });
    const profileImageMarginTop = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
      outputRange: [
        HEADER_MAX_HEIGHT - [PROFILE_IMAGE_MAX_HEIGHT / 2],
        HEADER_MAX_HEIGHT + 5
      ],
      extrapolate: "clamp"
    });

    const headerZindex = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
      outputRange: [0, 1],
      extrapolate: "clamp"
    });

    const headerTitleBottom = this.state.scrollY.interpolate({
      inputRange: [
        0,
        HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT,
        HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT + 5 + PROFILE_IMAGE_MIN_HEIGHT,
        HEADER_MAX_HEIGHT -
          HEADER_MIN_HEIGHT +
          5 +
          PROFILE_IMAGE_MIN_HEIGHT +
          24
      ],
      outputRange: [-20, -20, -20, 4],
      extrapolate: "clamp"
    });

    const headerTitleOpacity = this.state.scrollY.interpolate({
      inputRange: [
        0,
        HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT,
        HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT + 5 + PROFILE_IMAGE_MIN_HEIGHT,
        HEADER_MAX_HEIGHT -
          HEADER_MIN_HEIGHT +
          5 +
          PROFILE_IMAGE_MIN_HEIGHT +
          24
      ],
      outputRange: [0, 0, 0, 1],
      extrapolate: "clamp"
    });
    console.log(this.userStringInfo);
    return (
      <View style={styles.container}>
        <Animated.View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: headerHeight,
            zIndex: headerZindex,
            display: "flex",
            alignItems: "center"
          }}
        >
          <LinearGradient
            colors={["#40E488", "#2DE85D"]}
            style={styles.linearGradient}
          >
            <Animated.View
              style={{
                position: "absolute",
                bottom: headerTitleBottom,
                opacity: headerTitleOpacity
              }}
            >
              <Text
                style={{
                  fontSize: 22,
                  fontFamily: "PublicSans-Bold",
                  color: "white",
                  paddingBottom: 3
                }}
              >
                {this.props.user.firstName} {this.props.user.lastName}
              </Text>
            </Animated.View>
          </LinearGradient>
        </Animated.View>

        <ScrollView
          scrollEventThrottle={16}
          onScroll={Animated.event([
            { nativeEvent: { contentOffset: { y: this.state.scrollY } } }
          ])}
          style={{ flex: 1 }}
        >
          <View style={{ flexDirection: "row" }}>
            <Animated.View
              style={{
                height: profileImageHeight,
                width: profileImageHeight,
                borderRadius: PROFILE_IMAGE_MAX_HEIGHT / 2,
                borderWidth: 3,
                borderColor: "#F7F7F7",
                overflow: "hidden",
                marginTop: profileImageMarginTop,
                marginLeft: 10,
                zIndex: headerZindex
              }}
            >
              <Image
                defaultSource={require("../assets/images/background.png")}
                source={{ uri: this.props.user.avatarSource.uri }}
                style={{
                  width: null,
                  height: null,
                  flex: 1
                }}
              />
            </Animated.View>
          </View>
          <Animated.View
            style={{
              position: "absolute",
              right: 10,
              top: HEADER_MAX_HEIGHT + 10,
              zIndex: 2,
              height: profileImageHeight,
              width: profileImageHeight
            }}
          >
            <TouchableOpacity
              onPress={this.renderModal.bind(this)}
              style={{
                height: null,
                width: null,
                flex: 1
              }}
            >
              <Image
                source={require("../assets/images/qrcode.png")}
                style={{
                  width: null,
                  height: null,
                  flex: 1
                }}
              />
            </TouchableOpacity>
          </Animated.View>

          <View style={{ paddingBottom: 10 }}>
            <Text
              style={{
                fontFamily: "PublicSans-Bold",
                paddingLeft: 9,
                fontSize: 24
              }}
            >
              {this.props.user.firstName} {this.props.user.lastName}
            </Text>
            <View style={{ paddingLeft: 10 }}>
              <Text
                style={{
                  fontFamily: "PublicSans-Light",
                  fontSize: 16,
                  paddingTop: 2
                }}
              >
                {this.props.user.school}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center"
                }}
              >
                <Text
                  style={{
                    fontFamily: "PublicSans-Light",
                    fontSize: 16,
                    paddingTop: 2,
                    color: "gray"
                  }}
                >
                  {this.props.user.email}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 15
                }}
              >
                <Icon
                  name="md-school"
                  style={{
                    fontSize: 15,
                    alignSelf: "center",
                    marginRight: 6,
                    paddingTop: 1,
                    color: "grey"
                  }}
                />
                <Text
                  style={{
                    fontFamily: "PublicSans-Light",
                    fontSize: 14,
                    color: "grey",
                    marginRight: 20
                  }}
                >
                  {this.props.user.year}
                </Text>

                <Icon
                  name="ios-bookmarks"
                  style={{
                    fontSize: 14,
                    alignSelf: "center",
                    marginRight: 6,
                    paddingTop: 1,
                    color: "grey"
                  }}
                />
                <Text
                  style={{
                    fontFamily: "PublicSans-Light",
                    fontSize: 14,
                    color: "grey",
                    marginRight: 10
                  }}
                >
                  {this.props.user.major}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 10,
                  marginLeft: 2
                }}
              >
                <Text
                  style={{ fontSize: 14, fontWeight: "600", marginRight: 6 }}
                >
                  {this.state.created}
                </Text>
                <Text
                  style={{
                    fontWeight: "300",
                    fontSize: 14,
                    color: "grey",
                    marginRight: 10
                  }}
                >
                  Created
                </Text>
                <Text
                  style={{ fontSize: 14, fontWeight: "600", marginRight: 6 }}
                >
                  {this.state.attended}
                </Text>
                <Text
                  style={{
                    fontWeight: "300",
                    fontSize: 14,
                    color: "grey",
                    marginRight: 10
                  }}
                >
                  Attended
                </Text>
              </View>
            </View>
          </View>
          <View style={{ height: "100%", backgroundColor: "#F7F7F7" }}>
            <Row title="Account Settings" sections={this.AccountSettings} />
          </View>
        </ScrollView>

        <QRCodeModal
          value={this.userStringInfo}
          visible={this.state.showModal}
          onPress={this.renderModal.bind(this)}
        />
        <PrivacyModal
          visible={this.state.showPrivacy}
          onClose={() => {
            this.setState({ showPrivacy: false });
          }}
        />
        <EditAccountModal
          visible={this.state.showEditAccount}
          onClose={() => this.setState({ showEditAccount: false })}
          avatarSource={this.props.user.avatarSource}
          firstName={this.props.user.firstName}
          lastName={this.props.user.lastName}
          year={this.props.user.year}
          major={this.props.user.major}
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    favoritedEvents: state.localUserEvents.favoritedEvents,
    createdEvents: state.userEvents.createdEvents,
    attendedEvents: state.userEvents.attendedEvents
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      signOutUser: signOutUser,
      refreshEmailVerified: refreshEmailVerified,
      resendVerification: resendVerification
    },
    dispatch
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  linearGradient: {
    flex: 1,
    width: "100%",
    paddingLeft: 15,
    paddingRight: 15,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);
