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

let userStringInfo;

const Row = ({ title, sections }) => {
  function renderSections() {
    return sections.map((section, i) => {
      let borderBottomWidth = i == sections.length - 1 ? 0.4 : 0;
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
            backgroundColor: "white",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            borderTopWidth: 0.4,
            borderBottomWidth: borderBottomWidth,
            borderColor: "grey"
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "500" }}>
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
          fontWeight: "600",
          paddingBottom: 10,
          opacity: 0.85,
          paddingTop: 10
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
    userStringInfo = `${firstName} ${lastName} ${email} ${major} ${year} ${sex} ${ethnicity} ${uid} ${interestString}`;
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

    return (
      <View style={styles.container}>
        <Animated.View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: "#f4b042",
            height: headerHeight,
            zIndex: headerZindex,
            display: "flex",
            alignItems: "center"
          }}
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
                fontWeight: "bold",
                color: "white",
                paddingBottom: 3
              }}
            >
              {this.props.firstName} {this.props.lastName}
            </Text>
          </Animated.View>
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
              <CacheImage
                uri={this.props.avatarSource.uri}
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
            <Text style={{ fontWeight: "bold", paddingLeft: 9, fontSize: 24 }}>
              {this.props.firstName} {this.props.lastName}
            </Text>
            <View style={{ paddingLeft: 10 }}>
              <Text style={{ fontWeight: "300", fontSize: 16, paddingTop: 2 }}>
                {this.props.school}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center"
                }}
              >
                <Text
                  style={{
                    fontWeight: "300",
                    fontSize: 16,
                    paddingTop: 2,
                    color: "gray"
                  }}
                >
                  {this.props.email}
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
                    fontWeight: "300",
                    fontSize: 14,
                    color: "grey",
                    marginRight: 20
                  }}
                >
                  {this.props.year}
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
                    fontWeight: "300",
                    fontSize: 14,
                    color: "grey",
                    marginRight: 10
                  }}
                >
                  {this.props.major}
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
          value={userStringInfo}
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
          avatarSource={this.props.avatarSource}
          firstName={this.props.firstName}
          lastName={this.props.lastName}
          year={this.props.year}
          major={this.props.major}
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
    avatarSource,
    emailVerified
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
    avatarSource,
    emailVerified,
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
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);
