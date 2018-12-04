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
import allCategories from "../../constants/Categories";
import InterestContainer from "../../components/InterestContainer";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updateEventInfo } from "../../redux/actions/EventActions";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

class CategoriesModal extends Component {
  state = {
    categories: allCategories,
    selectedCategories: []
  };

  componentWillUnmount() {
    allCategories.forEach(category => {
      category.selected = false;
    });
  }

  onCategoryPress(category) {
    Keyboard.dismiss();
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
              Select All That Apply
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
  return bindActionCreators({ updateEventInfo: updateEventInfo }, dispatch);
};

const mapStateToProps = state => {
  let { eventCategories } = state.event;
  return {
    event: state.event,
    eventCategories: eventCategories,
    endorsed: state.user.endorsed
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
    height: screenHeight * 0.4
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CategoriesModal);
