import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Login from './screens/login';
import SignUp from './screens/signUp';
import HomeScreen from './screens/homeScreen';
import JoinScreen from './screens/joinScreen';
import Form from './screens/eventForm';
import HostScreen from './screens/hostScreen';
import GroupChat from './screens/groupChat';
import MyEvents from './screens/myEvents';




const NavStack = createStackNavigator({
    loginScreen: Login,
    signUpScreen: SignUp,
    homescreen: HomeScreen,
    joinscreen: JoinScreen,
    eventform: Form,
    hostscreen: HostScreen,
    chat: GroupChat,
    myevents: MyEvents
},
{
    headerMode: 'none',
 })

const AppNavigator = createAppContainer(NavStack);

export default AppNavigator;