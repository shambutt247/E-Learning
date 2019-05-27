import React from 'react';
import history from "../../history";
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Avatar from '@material-ui/core/Avatar';
//Admin Components
import AdminHome from "./AdminHome.jsx";
import AdminTeachers from "./AdminTeachers.jsx";
import AdminStudents from "./AdminStudents.jsx";
import AdminSubjects from "./AdminSubjects.jsx";

import School from '@material-ui/icons/School';
import Person from '@material-ui/icons/Person';
import ChromeReaderMode from '@material-ui/icons/ChromeReaderMode';
import Home from '@material-ui/icons/Home';

import fire from "../Firebase/fire.js";

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing.unit * 7 + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9 + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
  },
});

class AdminDashboard extends React.Component {
  state = {
    open: false,
    option: "Home",
    open2:false
  };

  componentDidMount = () => {

    if("uid" in localStorage){
      var user = localStorage.getItem("uid");
      var userid = JSON.parse(user);
  
      fire.database().ref('users/' + userid.uid).on('value', function (snapshot) {
        if(snapshot.val().userType!=="admin"){
          history.push('/');
        }
      });
    }else {
      history.push('/');
    }
    

  }

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  handleOptions = (opt) => {
    this.setState({
      option: opt
    });
  }

  handleToggle = () => {
    this.setState(state => ({ open2: !state.open2 }));
  };

  handleClose = event => {
    this.setState({ open2: false });
  };

 loggingOut = () => {
    fire.auth().signOut().then(function () {
       localStorage.removeItem("uid");
       history.push('/');

    }).catch(function (error) {
       console.log(error);
    });
 };

  render() {
    const { classes, theme } = this.props;

    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="fixed"
          className={classNames(classes.appBar, {
            [classes.appBarShift]: this.state.open,
          })}
        >
          <Toolbar disableGutters={!this.state.open}>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerOpen}
              className={classNames(classes.menuButton, {
                [classes.hide]: this.state.open,
              })}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" noWrap>
              Learning Birds (Admin Panel)
            </Typography>
              <div style={{flex:'1',justifyContent:'flex-end'}}/>
            <IconButton
          buttonRef={node => {
              this.anchorEl = node;
            }}
          onClick={()=>this.handleToggle()}
          style={{padding:'0',marginRight:'25px'}}
        >
         <Avatar>A</Avatar> 
        </IconButton>
          <Popper open={this.state.open2} anchorEl={this.anchorEl} placement={'bottom-start'} transition disablePortal>
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

          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          className={classNames(classes.drawer, {
            [classes.drawerOpen]: this.state.open,
            [classes.drawerClose]: !this.state.open,
          })}
          classes={{
            paper: classNames({
              [classes.drawerOpen]: this.state.open,
              [classes.drawerClose]: !this.state.open,
            }),
          }}
          open={this.state.open}
        >
          <div className={classes.toolbar}>
            <IconButton onClick={this.handleDrawerClose}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </div>
          <Divider />
          <List style={{marginLeft:'7px'}}>

            <ListItem button onClick={() => this.handleOptions("Home")}>
              <ListItemIcon>
                <Home />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItem>

            <ListItem button onClick={() => this.handleOptions("Teachers")}>
              <ListItemIcon>
                <School />
              </ListItemIcon>
              <ListItemText primary="Teachers" />
            </ListItem>

            <ListItem button onClick={() => this.handleOptions("Students")}>
              <ListItemIcon>
                <Person />
              </ListItemIcon>
              <ListItemText primary="Students" />
            </ListItem>

            <ListItem button onClick={() => this.handleOptions("Subjects")}>
              <ListItemIcon>
                <ChromeReaderMode />
              </ListItemIcon>
              <ListItemText primary="Subjects" />
            </ListItem>

          </List>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          {this.state.option === "Home" ? (
            
              <AdminHome />
            
          ) : (
<div>
{this.state.option==="Teachers" ? (

<AdminTeachers />

):(
  <div>
{this.state.option==="Students" ? (
  
<AdminStudents />

):(
  <div>
{this.state.option==="Subjects" ? (
  
<AdminSubjects />

):(
  <div>

  </div>
)}
</div>
)}
</div>
)}
</div>
          )}
        </main>
      </div>
    );
  }
}

AdminDashboard.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(AdminDashboard);