import React from "react";
import history from "../../history";
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
import fire from '../Firebase/fire';

import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';

import Fab from '@material-ui/core/Fab';


class chatBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subid:null,
      userID:null,
      name:null,
      actor:null,
      messageList: [],
      textMessage:""
    };
  }

  componentDidMount = () => {
    if("uid" in localStorage){

      var user = localStorage.getItem("uid");
    var user1 = JSON.parse(user);
    var nameInitial = user1.displayName;
    var userID=user1.uid;

    this.setState({
     subid: this.props.subid,
     userID:userID,
     name:nameInitial,
     actor:this.props.actor
    })

    let currentComponent = this;
  
    
    fire.database().ref('subjects/'+this.props.subid+'/Chats').on('value', function(snapshot) {
      var allchap=[];
      snapshot.forEach(function(childSnapshot){
        allchap=allchap.concat(childSnapshot.val());
      });
      currentComponent.setState({
       messageList:allchap
      });
  });
      
    }else {
      history.push('/');
    };

  }

  
  sendText = () =>{
    var message={
          author: this.state.name,
          actID: this.state.userID,
          actor: this.state.actor,
          data: { text:this.state.textMessage }
    };
    var database=fire.database();
 
    var updates = {};
    this.setState({
      messageList: [...this.state.messageList, message],
      textMessage:""
    },()=>{
      updates['subjects/'+this.state.subid+'/Chats'] = this.state.messageList;
      return database.ref().update(updates);
    })
    

  }
 

  onChange = (event) =>{
 this.setState({
   textMessage:event.target.value
 })
  }
  render() {
    const { classes, ...rest } = this.props;
    const { open } = this.state;

    return (

        <div style={{marginLeft:'20px',marginRight:'20px'}}>
          <h3 style={{textAlign:'center'}}>Discussion Chat</h3>
                <Paper style={{width:'auto',height:'400px',marginTop:'17px'}}>
                  <div style={{height:'350px',overflow:'auto'}}>
                    {this.state.messageList.map((mess,index)=>{
                      return(

                        <div key={index} style={{marginLeft:'5px',marginRight:'5px'}}>

                          <div style={{marginBottom:'8px'}}>
                          {mess.author===this.state.name ? (
                            <div style={{justifyContent:'flex-end',display:'flex'}}>
                            <Paper style={{color:'white',backgroundColor:'#4e8cff',borderRadius:'12px',padding:'8px 8px 8px 8px',display:'flex',alignItems:'center',width:'fit-content',maxWidth:'200px'}}>
                      {mess.data.text}
                        </Paper>
                        </div>
                          ):(

                            <div>
                           {mess.actor==="teacher" ? (
                            <div>
                            <p style={{fontSize:'12px',margin:'0px'}}>Teacher</p>
                          <Paper style={{color:'white',backgroundColor:'#ff0000',borderRadius:'12px',padding:'8px 8px 8px 8px',display:'flex',alignItems:'center',width:'fit-content',maxWidth:'200px'}}>
                      {mess.data.text}
                        </Paper>
                            </div>
                           ):(
                            <div>
                              {mess.actor==="admin" ? (
                                <div>
                                <p style={{fontSize:'12px',margin:'0px'}}>ADMIN</p>
                          <Paper style={{color:'white',backgroundColor:'#ff0000',borderRadius:'12px',padding:'8px 8px 8px 8px',display:'flex',alignItems:'center',width:'fit-content',maxWidth:'200px'}}>
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
                           )}
                            

                        </div>

                          )}
                          

                        </div>

                      </div>

                      )
                    })}
                    </div>
                    <Paper style={{padding:'1px 4px',display:'flex',alignItems:'center',width:'auto'}} elevation={1}>
                    
                    <InputBase 
                    onChange={e=>this.onChange(e)} 
                    value={this.state.textMessage} 
                    className={classes.input} 
                    placeholder="Message..." 
                    onKeyPress={e => {if(e.key==='Enter')
                                              this.sendText();}}
                    style={{width:'100%',height:'48px'}}/>

      </Paper>
                  
                </Paper>
        </div>
    );
  }
}

export default withStyles()(chatBox);