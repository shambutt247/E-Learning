import React from "react";

import { Link } from "react-router-dom";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
// @material-ui/icons
import Email from "@material-ui/icons/Email";
// core components
import CustomDropdown from "components/CustomDropdown/CustomDropdown.jsx";
import Button from "components/CustomButtons/Button.jsx";
import { withFirebase } from '../Firebase';
import navbarsStyle from "assets/jss/material-kit-react/views/componentsSections/navbarsStyle.jsx";

import profileImage from "assets/img/faces/avatar.jpg";

class logout extends React.Component {
   constructor(props) {
      super(props);
      
    }
  
loggingOut=()=>{
   console.log("workd")
   {return(
      this.props.Firebase.doSignOut.then(function() {
         console.log("worked")
       }).catch(function(error) {
         console.log(error)
       });
      
   )}
   
};

   render() {
      const { classes } = this.props;
      return (
         <List className={classes.list}>
            <ListItem className={classes.listItem}>
               <Button
                  href="#pablo"
                  className={classes.navLink}
                  onClick={e => e.preventDefault()}
                  color="transparent"
               >
                  Discover
                    </Button>
            </ListItem>
            <ListItem className={classes.listItem}>
               <Button
                  href="#pablo"
                  className={classes.navLink}
                  onClick={e => e.preventDefault()}
                  color="transparent"
               >
                  Wishlist
                    </Button>
            </ListItem>
            <ListItem className={classes.listItem}>
               <Button
                  justIcon
                  round
                  href="#pablo"
                  className={classes.notificationNavLink}
                  onClick={e => e.preventDefault()}
                  color="white"
               >
                  <Email className={classes.icons} />
               </Button>
            </ListItem>
            <ListItem className={classes.listItem}>
               <CustomDropdown
                  left
                  caret={false}
                  hoverColor="white"
                  buttonText={
                     <img
                        src={profileImage}
                        className={classes.img}
                        alt="profile"
                     />
                  }
                  buttonProps={{
                     className:
                        classes.navLink + " " + classes.imageDropdownButton,
                     color: "transparent"
                  }}
                  dropdownList={[
                     "Me",
                     "Settings",
                     <li><a onClick={this.loggingOut}>Action</a></li>
                  ]}
               />
            </ListItem>
         </List>
      );
   }
}

export default withStyles(navbarsStyle)(withFirebase(logout));


