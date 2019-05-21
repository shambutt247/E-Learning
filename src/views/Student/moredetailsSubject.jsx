import React from "react";
import PropTypes from "prop-types";
import ReactDOM from 'react-dom';
//material Ui core components
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Slide from "@material-ui/core/Slide";
import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import AddIcon from "@material-ui/icons/Add";
import { withSnackbar } from 'notistack';
//Other components
import TextField from "@material-ui/core/TextField";
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

//Firebase
import fire from "../Firebase/fire.js";


import Grid from "@material-ui/core/Grid";

function Transition(props) {
  return <Slide direction="up" {...props} />;
}



class moredetailsSubject extends React.Component {
  anchorElLeft = null;
  anchorElTop = null;
  anchorElBottom = null;
  anchorElRight = null;

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      isError: false,
      subo:null
      /*
      subname: null,
      description:null,
      subid:null,
      difficutly:null,
      category:null ,
      duration:null,
      active:null,
      teacherid:null*/
    };
    this.onSubmit = this.onSubmit.bind(this);
  }
  handleSnack = (mess,variant) =>{
    this.props.enqueueSnackbar(mess, {variant});
  }
  componentDidMount = () => {
   this.props.onRef(this);
 };

 SendDataFirebase = () => {
  let curo=this;
  var database=fire.database();
  
  var userstudent1=localStorage.getItem("uid");
  var userstudent=JSON.parse(userstudent1);
var mon=this.state.subo.subid;
var str=this.state.subo.sstrenght;
var teachid=this.state.subo.teacherid;
var b=null
console.log(this.state.subo.teacherid);
var postSubject = {
 subname: this.state.subo.subname,
 subid:this.state.subo.subid,
 category:this.state.subo.category ,
 active:this.state.subo.active,
 teacherid:this.state.subo.teacherid
};
//var joinedDate=getDataTimeAll
  database.ref('users/' + userstudent.uid + '/subjects/' + mon ).once("value")
  .then(function(snapshot) {
    var b= snapshot.exists();// true
    if(!b){
     if(userstudent!==null){
      var updates = {};
      updates['users/' + userstudent.uid + '/subjects/' + mon] = postSubject;
      updates['subjects/'+ mon + '/sstrenght']=str+1;
      updates['users/' + teachid + '/subjects/'+ mon + '/sstrenght']=str+1;
      //updates['subjects/'+ mon + '/studentsinfo/' + userstudent + '/joined']=joinedDate;
      curo.handleSnack("Subject Enrolled!!","success");
    

      return database.ref().update(updates);
    }
    }else{
      curo.handleSnack("Subject Already Enrolled!!","error");
    }
      
    
  });
   
};


  onSubmit = e => {
   if (this.state.subo) {
    this.SendDataFirebase();
    this.handleClose();
  }
  };
  handleClickOpen = (details) => {
    this.setState({
     subo:details,
     open:true},()=>{
     console.log(this.state.subo);
    });
  };


 
  handleClose = () => {
    this.setState({
      open: false
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Dialog
          fullWidth={true}
          maxWidth={"md"}
          open={this.state.open}
          onClose={this.handleClose}
          TransitionComponent={Transition}
        >
          <DialogTitle>Enter Details of Subject</DialogTitle>
          <DialogContent>
            {this.state.subo ? (
             <div>{this.state.subo.subname} {this.state.subo.description}</div>
            ):(
             <div></div>
            )}

          
          </DialogContent>
          <AppBar style={{ position: "relative" }}>
            <Toolbar variant="dense">
              <Button color="inherit" onClick={e => this.handleClose()}>
                Cancel
              </Button>
              <div style={{ flex: 1 }} />
              <Button color="inherit" onClick={e => this.onSubmit(e)}>
                Enroll
              </Button>
            </Toolbar>
          </AppBar>
        </Dialog>
      </div>
    );
  }
}

moredetailsSubject.propTypes = {
  classes: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired
  
};

const moredetailsSubject1 = withSnackbar(moredetailsSubject);
export default withStyles()(moredetailsSubject1);
