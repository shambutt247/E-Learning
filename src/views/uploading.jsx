import React from "react";
// nodejs library that concatenates classes
import PropTypes from "prop-types";
import classNames from "classnames";
import download from "download-in-browser";
import {Launcher} from 'react-chat-window'
import StarBorder from '@material-ui/icons/StarBorder';

import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// @material-ui/icons
import profilePageStyle from "assets/jss/material-kit-react/views/profilePage.jsx";
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import People from '@material-ui/icons/People';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
//firebase
import fire from './Firebase/fire';

import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';

import Fab from '@material-ui/core/Fab';


class uploading extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      completed:null,
      url:null,
      messageList: [],
      open: false,
      textMessage:""
    };
  }

  componentDidMount = () => {
  
  }



  handleDownload =(event)=>{
    console.log("passing");
    var Ref = fire.storage().ref();

    Ref.child('images/hamster.jpg').getDownloadURL().then(function(url) {
      // `url` is the download URL for 'images/stars.jpg'
      
 console.log(url)
download(url, "readme.jpg")
  .then((data) => console.log(`${data.statusText}: Download has started...`))
  .catch((err) => console.log(`${err.statusText}: Download failed to start`))
     
    }).catch(function(error) {
      console.log(error)
    });
    
  }

  render() {
    const { classes, ...rest } = this.props;
    const { open } = this.state;

    return (
      <div style={{ marginLeft: '20px', marginRight: '20px' }}>
      <Fab
            aria-haspopup="true"
            onClick={(e)=>this.handleDownload(e)}
          >
            <StarBorder />
          </Fab>

      


      </div>
    );
  }
}

export default withStyles()(uploading);