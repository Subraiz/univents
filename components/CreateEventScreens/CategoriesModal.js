import React, { Component } from "react";
import {
  Text,
  View,
  Modal,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Button,
  Keyboard
} from "react-native";
import InterestContainer from "../../components/InterestContainer";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updateEventInfo } from "../../redux/actions/EventActions";
import { getCategories } from "../../redux/actions/SettingsActions";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const MAX_CATEGORIES = 3;

class CategoriesModal extends Component {
  state = {
    categories: this.props.categories,
    selectedCategories: [],
    specialCategoryCount: 0
  };

  componentWillUnmount() {
    this.props.categories.forEach(category => {
      category.selected = false;
    });
  }

  componentWillMount() {
    this.setState({ categories: this.props.categories });
  }

  onCategoryPress(category) {
    Keyboard.dismiss();
    console.log(this.state.selectedCategories.length);
    if (
      !category.selected &&
      this.state.selectedCategories.length >= MAX_CATEGORIES
    ) {
      return false;
    }
    category.selected = !category.selected;
    updatedSelectedCategories = this.state.selectedCategories;
    if (category.selected) {
      updatedSelectedCategories.push(category.item);
      this.setState({
        selectedCategories: updatedSelectedCategories
      });
    } else {
      let indexToRemove = updatedSelectedCategories.indexOf(category.item);
      updatedSelectedCategories.splice(indexToRemove, 1);
      this.setState({
        selectedCategories: updatedSelectedCategories
      });
    }

    // Handling special events that we do such as AHANA weekend - adds Special Event category
    if (
      this.props.specialEventActive &&
      updatedSelectedCategories.indexOf(this.props.specialEventTitle) >= 0 &&
      this.state.specialCategoryCount < 1
    ) {
      updatedSelectedCategories.push("Special Event");
      this.setState({
        selectedCategories: updatedSelectedCategories,
        specialCategoryCount: this.state.specialCategoryCount + 1
      });
    } else {
      if (updatedSelectedCategories.indexOf("Special Event") >= 0) {
        let indexToRemove = updatedSelectedCategories.indexOf("Special Event");
        updatedSelectedCategories.splice(indexToRemove, 1);
        this.setState({
          specialCategoryCount: 0
        });
      }
    }

    // Updates the redux side of it
    this.props.updateEventInfo({
      prop: "eventCategories",
      value: this.state.selectedCategories
    });
  }

  renderCategories() {
    return this.state.categories.map(category => {
      if (category.item == "Popular") {
        if (this.props.endorsed) {
          return (
            <InterestContainer
              onPress={this.onCategoryPress.bind(this, category)}
              interest={category}
              key={category.item}
              title={category.item}
              colors={category.colors}
            />
          );
        } else {
          return;
        }
      } else {
        return (
          <InterestContainer
            onPress={this.onCategoryPress.bind(this, category)}
            interest={category}
            key={category.item}
            title={category.item}
            colors={category.colors}
          />
        );
      }
    });
  }

  render() {
    return (
      <Modal
        visible={this.props.visible}
        transparent
        animationType="fade"
        onRequestClose={() => {}}
        transparent={true}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.categoryContainer}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                marginBottom: 5,
                marginTop: 2
              }}
            >
              Select Up To Three Categories
            </Text>
            <View style={styles.categories}>{this.renderCategories()}</View>
            <Button title="Confirm" onPress={this.props.onPress} />
          </View>
        </SafeAreaView>
      </Modal>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    { updateEventInfo: updateEventInfo, getCategories: getCategories },
    dispatch
  );
};

const mapStateToProps = state => {
  let { eventCategories } = state.event;
  return {
    event: state.event,
    eventCategories: eventCategories,
    endorsed: state.user.endorsed,
    categories: state.settings,
    specialEventActive: state.events.specialEventActive,
    specialEventTitle: state.events.specialEventTitle
  };
};

const styles = {
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, .1)"
  },
  categoryContainer: {
    backgroundColor: "white",
    height: screenHeight * 0.8,
    padding: 10,
    width: screenWidth * 0.95,
    borderRadius: 15,
    alignItems: "center"
  },
  categories: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: screenHeight * 0.1,
    height: screenHeight * 0.5
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CategoriesModal);
