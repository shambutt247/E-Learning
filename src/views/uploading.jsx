import React from "react";
// nodejs library that concatenates classes
import PropTypes from "prop-types";
import classNames from "classnames";

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
    let currentComponent = this;
  
    
    fire.database().ref('chat/Materials').on('value', function(snapshot) {
      var allchap=[];
      snapshot.forEach(function(childSnapshot){
        allchap=allchap.concat(childSnapshot.val());
      });
      currentComponent.setState({
       messageList:allchap
      });
  });
  
  }

  _onMessageWasSent(message) {
    var database=fire.database();
 
    var updates = {};
    this.setState({
      messageList: [...this.state.messageList, message]
    },()=>{
      updates['chat/Materials'] = this.state.messageList;
      return database.ref().update(updates);
    })
    
  }
  
  sendText = () =>{
    var text2=this.state.textMessage;
    var message={
          author: "Moro",
          type: "text",
          data: { text:text2 }
    };
    var database=fire.database();
 
    var updates = {};
    this.setState({
      messageList: [...this.state.messageList, message],
      textMessage:""
    },()=>{
      updates['chat/Materials'] = this.state.messageList;
      return database.ref().update(updates);
    })
    

  }
 
  _sendMessage(text) {
    if (text.length > 0) {
      this.setState({
        messageList: [...this.state.messageList, {
          author: 'me',
          type: 'text',
          data: { text }
        }]
      })
    }
  }
  
  handleToggle = () => {
    this.setState(state => ({ open: !state.open }));
  };

  handleClose = event => {
    if (this.anchorEl.contains(event.target)) {
      return;
    }

    this.setState({ open: false });
  };

  onChange = (event) =>{
 this.setState({
   textMessage:event.target.value
 })
  }
  render() {
    const { classes, ...rest } = this.props;
    const { open } = this.state;

    return (
      <div style={{ marginLeft: '20px', marginRight: '20px' }}>

      <Launcher
        agentProfile={{
          teamName: 'react-chat-window',
          imageUrl: 'https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png'
        }}
        onMessageWasSent={this._onMessageWasSent.bind(this)}
        messageList={this.state.messageList}
        showEmoji
      />

        <div>
          <Fab
          size="small"
            buttonRef={node => {
              this.anchorEl = node;
            }}
            aria-owns={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            onClick={this.handleToggle}
          >
            <StarBorder fontSize="small"/>
          </Fab>
          <Popper open={open} anchorEl={this.anchorEl} transition disablePortal>
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                id="menu-list-grow"
                style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
              >
                <Paper style={{width:'300px',height:'400px'}}>
                  <div style={{height:'350px',overflow:'auto'}}>
                    {this.state.messageList.map((mess,index)=>{
                      return(

                        <div key={index} style={{marginLeft:'5px'}}>

                          <div style={{marginBottom:'8px'}}>
                          {mess.author==="Moro" ? (
                            <div style={{justifyContent:'flex-end',display:'flex'}}>
                            <Paper style={{color:'white',backgroundColor:'#4e8cff',borderRadius:'12px',padding:'8px 8px 8px 8px',display:'flex',alignItems:'center',width:'fit-content',maxWidth:'200px'}}>
                      {mess.data.text}
                        </Paper>
                        </div>
                          ):(
                            <div>
                            <p style={{fontSize:'12px',margin:'0px'}}>{mess.author}</p>
                          <Paper style={{borderRadius:'12px',padding:'8px 8px 8px 8px',display:'flex',alignItems:'center',width:'fit-content',maxWidth:'200px'}}>
                      {mess.data.text}
                        </Paper>
                        </div>
                          )}
                          

                        </div>

                      </div>

                      )
                    })}
                    </div>
                    <Paper style={{padding:'2px 4px',display:'flex',alignItems:'center',width:'300px'}} elevation={1}>
                    
                    <InputBase onChange={e=>this.onChange(e)} value={this.state.textMessage} className={classes.input} placeholder="Message..." style={{width:'245px'}}/>
      <IconButton onClick={()=>this.sendText()} className={classes.iconButton}>
        <StarBorder />
      </IconButton>
      </Paper>
                  
                </Paper>
              </Grow>
            )}
          </Popper>
        </div>

      </div>
    );
  }
}

export default withStyles()(uploading);