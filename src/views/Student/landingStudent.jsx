import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// @material-ui/icons
import Camera from "@material-ui/icons/Camera";
import Palette from "@material-ui/icons/Palette";
import HomeIcon from "@material-ui/icons/";
import Favorite from "@material-ui/icons/Favorite";
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
import HomeStudent from "./homeStudent.jsx";
import ProfileStudent from "./profileStudent.jsx";
import MyCoursesStudent from "./mycoursesStudent.jsx";
import AddCourseStudent from "./addcourseStudent.jsx";

class landingStudent extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount = () => {
    
  }
  
  render() {
    const { classes, ...rest } = this.props;
    return (
      <div>
        <Header
          color="white"
          brand="Welcome"
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
                        tabButton: "Home",
                        tabIcon: Camera,
                        tabContent: (
                         <HomeStudent />
                        )
                      },
                      {
                        tabButton: "Profile",
                        tabIcon: Palette,
                        tabContent: (
                          <ProfileStudent />
                        )
                      },
                      {
                        tabButton: "My Courses",
                        tabIcon: Favorite,
                        tabContent: (
                          <MyCoursesStudent />
                        )
                      },
                      {
                        tabButton: "Add Subjects",
                        tabIcon: Palette,
                        tabContent: (
                          <AddCourseStudent />
                        )
                      }
                    ]}
                  />
                
              
            
          
        </div>
        <Footer />
      </div>
    );
  }
}

export default withStyles(profilePageStyle)(landingStudent);
