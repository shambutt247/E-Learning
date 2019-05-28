import React from "react";
import history from "../../history";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
// @material-ui/icons
import Email from "@material-ui/icons/Email";
// core components
import CustomDropdown from "components/CustomDropdown/CustomDropdown.jsx";
import navbarsStyle from "assets/jss/material-kit-react/views/componentsSections/navbarsStyle.jsx";
import Avatar from '@material-ui/core/Avatar';
import profileImage from "assets/img/faces/avatar.jpg";
import Button from '@material-ui/core/Button';
import IconButton from "@material-ui/core/IconButton";
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Home from '@material-ui/icons/Home';

import fire from "../Firebase/fire.js";

class logout extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         authUser: null,
         profileName: null,
         open:false,
         profImage:null,
         imagep:false,
         actor:null
      };
   }
   componentDidMount = () => {
      if("uid" in localStorage){

         let old=this;
         var userstring = localStorage.getItem("uid");
         var user = JSON.parse(userstring);
         var Phto=user.photoURL;
         if(Phto===null){
            var name=null;
            if (user != null) {
               name = user.displayName;
            }
            if(name!==null){
               var acr=name.split(' ').map(x => x[0]).join('');
               this.setState({
                  profileName:acr
               });
            }
         }else{
            this.setState({
               profImage:Phto,
               imagep:true
            });
         }
   
         fire.database().ref('users/' + user.uid).on('value', function (snapshot) {
            var userT=snapshot.val().userType;
            old.setState({
               actor:userT
            });
          });
         
       }else {
         history.push('/');
       };

      
      
      
   }

   handleToggle = () => {
      this.setState(state => ({ open: !state.open }));
    };
  
    handleClose = event => {
      this.setState({ open: false });
    };

   loggingOut = () => {
      fire.auth().signOut().then(function () {
         localStorage.removeItem("uid");
         history.push('/');

      }).catch(function (error) {
         console.log(error);
      });
   };

   goHome = (event) =>{
      if(this.state.actor==="admin"){
         history.push('/home-admin');
      }else if(this.state.actor==="teacher"){
         history.push('/home-teacher');
      }else if(this.state.actor==="student"){
         history.push('/home-student');
      }
      
   }


   render() {
      const { classes } = this.props;
      const { open } = this.state;
      return (
         <List className={classes.list}>
            <ListItem className={classes.listItem}>
               <IconButton
               justIcon
                  onClick={e => this.goHome(e)}
                  color="white"

               >
                  <Home className={classes.icons} />
               </IconButton>
            </ListItem>
            <ListItem className={classes.listItem}>
            
          <IconButton
          buttonRef={node => {
              this.anchorEl = node;
            }}
          onClick={()=>this.handleToggle()}
          style={{padding:'0'}}
        >
        {this.state.imagep ? (
         <Avatar src={this.state.profImage}/>
        ):(
         <Avatar>{this.state.profileName}</Avatar>
        )}
        
        </IconButton>
          <Popper open={open} anchorEl={this.anchorEl} placement={'bottom-start'} transition disablePortal>
            {({ TransitionProps }) => (
              <Grow
                {...TransitionProps}
                style={{ transformOrigin: 'bottom' }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={()=>this.handleClose()}>
                    <MenuList>
                      <MenuItem onClick={()=>this.loggingOut()}>Logout</MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
            </ListItem>
         </List>
      );
   }
}

export default withStyles(navbarsStyle)(logout);


