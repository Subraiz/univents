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

class CreatedEvents extends Component {
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

    this.dataSource = ds.cloneWithRows(this.props.createdEvents);

    this.screenWillFocus = this.props.navigation.addListener(
      "willFocus",
      () => {
        const ds = new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 !== r2
        });

        this.setState({
          dataSource: ds.cloneWithRows(this.props.createdEvents)
        });
      }
    );
  }

  componentWillUnmount() {
    this.screenWillFocus.remove();
  }

  renderEvent(item) {
    return (
      <Animatable.View
        style={{ marginTop: 5, marginLeft: 5, marginBottom: 5 }}
        key={item.eventID + "1"}
      >
        <EventCard
          key={item.eventName}
          event={item}
          onPress={this.onPress.bind(this, item)}
          navigation={this.props.navigation}
        />
      </Animatable.View>
    );
  }

  renderCreatedEvents() {
    if (this.props.createdEvents[0]) {
      return (
        <ListView
          enableEmptySections={true}
          dataSource={this.dataSource}
          renderRow={this.renderEvent.bind(this)}
        />
      );
    } else {
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
            Looks like you haven't created any events yet. Hit the blue plus on
            the top right to get started!
          </Text>
          <Animatable.View animation="pulse" iterationCount="infinite">
            <Icon name="ios-rocket" style={{ fontSize: 80, color: "grey" }} />
          </Animatable.View>
        </Animatable.View>
      );
    }
  }

  render() {
    return (
      <View style={styles.eventsContainer}>{this.renderCreatedEvents()}</View>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    event: state.userEvents.createdEvents
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
    marginTop: 10,
    marginBottom: 8,
    flex: 1
  }
};

export default connect(mapStateToProps)(withNavigation(CreatedEvents));
