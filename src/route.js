import React from "react";
import {
  Text,
  View,
  Platform,
  StatusBar,
  Button,
  TouchableOpacity,
} from "react-native";
import { Icon } from "native-base";
import {
  StackNavigator,
  TabNavigator,
  SwitchNavigator,
  createStackNavigator,
  createSwitchNavigator,
  createAppContainer,
} from "react-navigation";

import RegisterDoctor from "./connector/RegisterDoctor";
import RegisterPatient from "./connector/RegisterPatient";
import PatientHome from "./connector/PatientHome";
import PatientsList from "./connector/PatientsList";
import LoginScreen from "./connector/LoginScreen";
import ToolbarDropdown from "./connector/Menu";
import PatientNotification from "./connector/PatientNotification";
import UploadImage from "./connector/Uploadimg";
import PatientDashboard from "./connector/PatientDashboard";
import PatientsDetail from "./connector/PatientsDetail";
import DoctorDashboard from "./connector/DoctorDashboard";
import DoctorNotification from "./connector/DoctorNotification";
import SendImage from "./connector/SendImage";
import ImageViewer from "./connector/ImageViewer";
import ReminderMed from "./connector/SetMedicineRem";
import Ocr from "./connector/Ocr";
import SendData2 from "./connector/SendData2";
import Report from "./connector/Report";
import UserGuide from "./connector/UserGuide";
import Bluetooth from "./connector/Bluetooth"

const RootStack = createStackNavigator({
  Bluetooth: {
    screen: Bluetooth,
    navigationOptions: {
      title: "Connect",
    },
  },

  LoginScreen: {
    screen: LoginScreen,
    navigationOptions: {
      header: null,
    },
  },
  PatientsList: {
    screen: PatientsList,
    navigationOptions: {
      title: "Durgesh",
      headerLeft: null,
      headerRight: <ToolbarDropdown />,
    },
  },
  PatientsDetail: {
    screen: PatientsDetail,
    navigationOptions: {
      title: "Details",
    },
  },
  RegisterDoctor: {
    screen: RegisterDoctor,
    navigationOptions: {
      title: "Doctor Registration",
    },
  },
  RegisterPatient: {
    screen: RegisterPatient,
    navigationOptions: {
      title: "Patient Registration",
    },
  },
  PatientHome: {
    screen: PatientHome,
    navigationOptions: {
      title: "Send Data",
    },
  },
  SendData2: {
    screen: SendData2,
    navigationOptions: {
      title: "KCCQ",
    },
  },
  PatientNotification: {
    screen: PatientNotification,
    navigationOptions: {
      title: "Patient Notification",
    },
  },
  DoctorNotification: {
    screen: DoctorNotification,
    navigationOptions: {
      title: "Doctor Notification",
    },
  },

  PatientDashboard: {
    screen: PatientDashboard,
    navigationOptions: {
      title: "Home",
    },

    PatientsDetail: {
      screen: PatientsDetail,
    },
  },

  DoctorDashboard: {
    screen: DoctorDashboard,
    navigationOptions: {
      title: "Patient List",
    },
  },

  Uploadimg: {
    screen: UploadImage,
    navigationOptions: {
      title: "Drug Check",
    },
  },

  Ocr: {
    screen: Ocr,
    navigationOptions: {
      title: "OCR",
    },
  },
  UserGuide: {
    screen: UserGuide,
    navigationOptions: {
      title: "User Guide",
    },
  },
  SendImg: {
    screen: SendImage,
    navigationOptions: {
      title: "Send Image",
    },
  },
  Report: {
    screen: Report,
    navigationOptions: {
      title: "Report",
    },
  },
  ImageViewer: {
    screen: ImageViewer,
    navigationOptions: {
      title: "Image",
    },
  },

  ReminderMed: {
    screen: ReminderMed,
    navigationOptions: {
      title: "Reminder",
    },
  },
});

export const createRootNavigator = () => {
  return createAppContainer(RootStack);
};
