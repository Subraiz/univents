import Login from "../screens/login/Login";
import SignUpForm from "../screens/login/SignUpForm";
import SignUpPersonalInfo from "../screens/login/SignUpPersonalInfo";
import SignUpProfilePhoto from "../screens/login/SignUpProfilePhoto";
import LoginForm from "../screens/login/LoginForm";
import SignUpInterests from "../screens/login/SignUpInterests";
import Explore from "../screens/Explore";
import Events from "../screens/Events";
import Profile from "../screens/Profile";
import EventInformation from "../screens/EventInformation";
import EventCardsRow from "../components/EventCardsRow";
import AdminTools from "../components/AdminTools";
import { AppNavigator, ProfileNavigator } from "../navigation/AppNavigator";
import { createStackNavigator } from "react-navigation";

export default (HomeStack = createStackNavigator(
  {
    Login: Login,
    SignUpForm: SignUpForm,
    SignUpPersonalInfo: SignUpPersonalInfo,
    SignUpProfilePhoto: SignUpProfilePhoto,
    SignUpInterests: SignUpInterests,
    LoginForm: LoginForm,
    EventInformation: EventInformation,
    EventCardsRow: EventCardsRow,
    AdminTools: AdminTools,
    AppNavigator: {
      screen: AppNavigator,
      navigationOptions: {
        header: null,
        gesturesEnabled: false
      }
    },
    ProfileNavigator: ProfileNavigator
  },
  {
    initialRouteName: "AppNavigator"
  }
));
