import React, { Component } from "react";
import {
  Text,
  View,
  ScrollView,
  FlatList,
  TouchableOpacity,
  ListView
} from "react-native";
import * as Animatable from "react-native-animatable";
import Icon from "react-native-vector-icons/Ionicons";
import EventCard from "./EventCard";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchUserEvents } from "../redux/actions/EventsActions";
import { withNavigation } from "react-navigation";

class FavoritedEvents extends Component {
  state = {
    dataSource: {}
  };

  onPress(data) {
    this.props.navigation.navigate("EventInformation", {
      data: data,
      navigation: this.props.navigation
    });
  }

  componentWillMount() {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.setState({ dataSource: ds.cloneWithRows(this.props.favoritedEvents) });

    this.screenWillFocus = this.props.navigation.addListener(
      "willFocus",
      () => {
        const ds = new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 !== r2
        });

        this.setState({
          dataSource: ds.cloneWithRows(this.props.favoritedEvents)
        });
      }
    );
  }

  componentWillUnmount() {
    this.screenWillFocus.remove();
  }

  renderFavoritedEvents() {
    if (this.props.favoritedEvents.length == 0) {
      return (
        <Animatable.View
          duration={600}
          style={{
            height: "100%",
            alignItems: "center",
            justifyContent: "flex-start",
            paddingRight: 30,
            paddingLeft: 30,
            marginTop: 15,
            opacity: 0.7
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: "grey",
              fontWeight: "500",
              marginBottom: 25
            }}
          >
            Looks like you don't have any favorited events yet. Go check out
            some events to favorite them!
          </Text>
          <Animatable.View animation="pulse" iterationCount="infinite">
            <Icon name="ios-star" style={{ fontSize: 80, color: "grey" }} />
          </Animatable.View>
        </Animatable.View>
      );
    }
    return (
      <ListView
        enableEmptySections={true}
        dataSource={this.state.dataSource}
        renderRow={this.renderEvent.bind(this)}
      />
    );
  }

  renderEvent(item) {
    return (
      <Animatable.View style={{ marginTop: 5 }} key={item.eventID + "1"}>
        <EventCard
          key={item.eventName}
          event={item}
          onPress={this.onPress.bind(this, item)}
          navigation={this.props.navigation}
        />
      </Animatable.View>
    );
  }

  render() {
    return (
      <View style={styles.eventsContainer}>{this.renderFavoritedEvents()}</View>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      fetchUserEvents: fetchUserEvents
    },
    dispatch
  );
};

const styles = {
  eventsContainer: {
    flex: 1,
    marginTop: 8,
    marginBottom: 8
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(FavoritedEvents));
