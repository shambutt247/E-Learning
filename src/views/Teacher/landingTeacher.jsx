import React from "react";
import history from "../../history";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// @material-ui/icons
import Favorite from "@material-ui/icons/Favorite";
import Person from '@material-ui/icons/Person';
import ChromeReaderMode from '@material-ui/icons/ChromeReaderMode';
import Home from '@material-ui/icons/Home';
// core components
import Header from "components/Header/Header.jsx";
import Footer from "components/Footer/Footer.jsx";
import Button from "components/CustomButtons/Button.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import NavPills from "components/NavPills/NavPills.jsx";
import Parallax from "components/Parallax/Parallax.jsx";

import profilePageStyle from "assets/jss/material-kit-react/views/profilePage.jsx";

import Signout from "../LogOut/logout.jsx";
import ProfileTeacher from "./profileTeacher.jsx";
import MyCoursesTeacher from "./mycoursesTeacher.jsx";

import fire from '../Firebase/fire';

class landingTeacher extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount = () => {

    if("uid" in localStorage){
      var user = localStorage.getItem("uid");
      var userid = JSON.parse(user);
  
      fire.database().ref('users/' + userid.uid).on('value', function (snapshot) {
        if(snapshot.val().userType!=="teacher"){
          history.push('/');
        }
      });
    }else {
      history.push('/');
    }
  }
  
  render() {
    const { classes, ...rest } = this.props;
    return (
      <div>
        <Header
          color="white"
          brand="Learning Birds"
          rightLinks={<Signout />}
          fixed
          changeColorOnScroll={{
            height: 200,
            color: "white"
          }}
          {...rest}
        />
        <Parallax small filter image={require("assets/img/profile-bg.jpg")} />
        <div className={classNames(classes.main, classes.mainRaised)}>
          
               
                  <NavPills
                    alignCenter
                    color="primary"
                    tabs={[
                      {
                        tabButton: "Profile",
                        tabIcon: Person,
                        tabContent: (
                          <ProfileTeacher />
                        )
                      },
                      {
                        tabButton: "My Courses",
                        tabIcon: ChromeReaderMode,
                        tabContent: (
                          <MyCoursesTeacher />
                        )
                      }
                    ]}
                  />
        </div>
      </div>
    );
  }
}

export default withStyles(profilePageStyle)(landingTeacher);
