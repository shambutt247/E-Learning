import React from "react";
import history from "../../history";
// @material-ui/core components
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
// core components

import Paper from '@material-ui/core/Paper';
import Header from "components/Header/Header.jsx";
import Footer from "components/Footer/Footer.jsx";
import Signout from "../LogOut/logout.jsx";
import profilePageStyle from "assets/jss/material-kit-react/views/profilePage.jsx";
import classNames from "classnames";
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';
import fire from "../Firebase/fire.js";
import Lecture from './lecture.jsx';
import Grid from '@material-ui/core/Grid';
import { withSnackbar } from 'notistack';
import Fab from '@material-ui/core/Fab';
import ChatBox from './chatBox'
import LeaveReview from './leaveReview';

class subjectHome extends React.Component {
 constructor(props) {
  super(props);
  this.state = {
   open: false,
   openLecture:false,
   dataLecture:null,
   chapters: [],
   lect:[],
   addChapter:false,
   addLecture:false,
   chapname:null,
   chapnumber:null,
   lectname:null,
   lectnumber:null,
   isChapNameError:false,
   isChapNumberError:false,
   isLectNameError:false,
   isLectNumberError:false,
   subid:this.props.location.state.subid,
   actor:this.props.location.state.actor,
   subname:this.props.location.state.subname,
   oldIndex:null
  };
  this.openLecture=this.openLecture.bind(this);
 }

 
 componentDidMount = () => {
  this.checkUserID();

  let currentComponent = this;

  
  fire.database().ref('subjects/'+ this.state.subid + '/Materials').orderByChild('ChapNumber').on('value', function(snapshot) {
    var allchap=[];
    snapshot.forEach(function(childSnapshot){
      allchap=allchap.concat(childSnapshot.val());
    });
    currentComponent.setState({
     chapters:allchap
    });
});


}

checkUserID =()=>{
  
  if("uid" in localStorage){
    var user = localStorage.getItem("uid");
    var userid = JSON.parse(user);

    fire.database().ref('users/' + userid.uid).on('value', function (snapshot) {
      if(snapshot.val().userType==="teacher" || snapshot.val().userType==="student" || snapshot.val().userType==="admin"){
        return ;
      }else{
        history.push('/');
      }
    });
  }else {

    history.push('/');
  }
}

 handleClick = (index) => {
   
  this.closeaddLecture();
   let oldie=this.state.oldIndex;
   if(this.state.oldIndex!==index){

    if(this.state[index]===true){
      this.setState(state => ({ 
        [index]: false,
        oldIndex:index
       }));
     }else {
      this.setState(state => ({ 
        [index]: true,
        oldIndex:index,
        [oldie]:false 
      }));
     }

   }else if(this.state.oldIndex===index){
    if(this.state[index]===true){
      
      this.setState(state => ({ 
        [index]: false
       }));
     }else {
      this.setState(state => ({ 
        [index]: true
      }));
     }
   }
   
  
 };

 openLecture = (title,chapter,isDoc,isVideo) =>{
  this.childLecture.handleClickOpen(title,chapter,this.state.subid,this.state.actor,isDoc,isVideo);
 };

 change = e => {
        this.setState({
          [e.target.name]: e.target.value
        });
};

ClearErrors = () =>{
  this.setState({
    isChapNameError:false,
    isChapNumberError:false,
    isLectNameError:false,
    isLectNumberError:false
  });
}

newChapter = () =>{
 this.setState({
addChapter:true
 });
}

CheckChapterErrors=()=>{
  var Err=false;

  const { chapname,chapnumber } = this.state;
  if(chapname===null){
    this.setState({
      isChapNameError:true
    });
Err=true;
  }
  if(chapnumber===null || chapnumber==='0'){
    this.setState({
      isChapNumberError:true
    });
Err=true;
  }else{
    var gogo=chapnumber.match(/-/g);
    if(gogo!==null){
      this.setState({
        isChapNumberError:true
      });
      Err=true;
      this.handleSnack("Cannot be a negative number !!","error");
    }
  }

  return Err
}

addChapter = () =>{

  this.ClearErrors();

  if(this.CheckChapterErrors()){
    this.handleSnack("Fix Errors !!","error");
  }else{
    let oldState=this;
    const { chapnumber,subid } = this.state;
    var ref = fire.database().ref('subjects/' + subid + '/Materials/Chapter ' + chapnumber );
    ref.once("value")
      .then(function(snapshot) {
        var a = snapshot.exists();
        if(a){
          oldState.handleSnack("Chapter "+chapnumber+" Already Exists","error");
        }else{
          oldState.SendDataChapterFirebase();
          oldState.setState({
            addChapter:false,
            chapname:null,
            chapnumber:null
           });
           oldState.handleSnack("Chapter "+chapnumber+" Added","success");
        }
      });
  }

}

newLecture = () =>{
  this.setState({
 addLecture:true
  });
 }
 
 CheckLectureErrors=()=>{
  var Err=false;

  const { lectname,lectnumber } = this.state;
  if(lectname===null){
    this.setState({
      isLectNameError:true
    });
Err=true;
  }

  if(lectnumber===null || lectnumber==='0'){
    this.setState({
      isLectNumberError:true
    });
Err=true;
  }else{
    var gogo=lectnumber.match(/-/g);
    if(gogo!==null){
      this.setState({
        isLectNumberError:true
      });
      Err=true;
      this.handleSnack("Cannot be a negative number !!","error");
    }
  }

  return Err
 }

 addLecture = (chapnumber,lectureValue) =>{

  this.ClearErrors();
  //Check if not duplicate Chapter Number
  if(this.CheckLectureErrors()){
    this.handleSnack("Fix Errors !!","error");
  }else{

  let oldState=this;
  const { lectnumber,subid } = this.state;
  var ref = fire.database().ref('subjects/' + subid + '/Materials/Chapter ' + chapnumber+'/Lectures/Lecture '+lectnumber);
  ref.once("value")
    .then(function(snapshot) {
      var a = snapshot.exists();
      if(a){
        oldState.handleSnack("Lecture "+lectnumber+" Already Exists","error");
      }else{
        oldState.SendDataLectureFirebase(chapnumber,lectureValue);
        oldState.setState({
          addLecture:false,
          lectname:null,
          lectnumber:null
         });
         oldState.handleSnack("Lecture "+lectnumber+" Added","success");
      }
    });
  }
 }

 closeaddLecture = () =>{
  this.setState({
    addLecture:false,
    lectname:null,
    lectnumber:null
   });
 }

 closeaddChapter = () =>{
  this.setState({
    addChapter:false,
    chapname:null,
    chapnumber:null
   });
 }


SendDataChapterFirebase = () => {
 const { chapname,chapnumber,subid,actor } = this.state;
 var database=fire.database();

 
 if(actor!==null){
   var newSubkey = database.ref().child('subjects/'+ subid +'/Materials').push().key;
   var postMaterial = {
     ChapNumber: chapnumber,
     ChapName:chapname,
     LectureValue:1
   };
   var updates = {};
   updates['subjects/' + subid + '/Materials/Chapter ' + chapnumber] = postMaterial;
 
   return database.ref().update(updates);
 }
};

SendDataLectureFirebase = (chapnumber,lectureValue) => {
  const { lectname,lectnumber,subid,actor } = this.state;
  var database=fire.database();
 
  
  if(actor!==null){
    var postMaterial = {
      LectureNumber: lectnumber,
      LectureName:lectname,
      LectureVideo:false,
      LectureDoc:false
    };
    var updates = {};
    updates['subjects/' + subid + '/Materials/Chapter ' + chapnumber + '/Lectures/Lecture '+lectnumber] = postMaterial;
    updates['subjects/' + subid + '/Materials/Chapter ' + chapnumber + '/LectureValue'] = lectureValue+1;
    return database.ref().update(updates);
  }
 };

 handleSnack = (mess,variant) =>{
  this.props.enqueueSnackbar(mess, {variant});
}

DeleteChapter = (chapNumber) =>{
  const { subid } = this.state;
  var database=fire.database();
 
    var updates = {};
    updates['subjects/' + subid + '/Materials/Chapter ' + chapNumber] = null;
    return database.ref().update(updates);

}

DeleteLecture = (chapNumber,lectNumber,lectValue) =>{

  const { subid } = this.state;
  var database=fire.database();
 
    var updates = {};
    updates['subjects/' + subid + '/Materials/Chapter ' + chapNumber + '/Lectures/Lecture '+lectNumber] = null;
    updates['subjects/' + subid + '/Materials/Chapter ' + chapNumber + '/LectureValue'] = lectValue-1;
    database.ref().update(updates);

 


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
    
    <div className={classNames(classes.main, classes.mainRaised)} style={{ marginTop: '90px' }}>
      {this.state.actor==="teacher" ? (
        
        <div>
        {this.state.addChapter ? (
<div style={{padding:'12px 0 0 12px'}}>
 
               <TextField
                  name="chapname"
                  label="Chapter Name"
                  className={classes.textField}
                  onChange={e => this.change(e)}
                  variant="outlined"
                  value={this.state.chapname}
                  style={{width:'200px'}}
                  required
                  error={this.state.isChapNameError}
                />
                <TextField
                  name="chapnumber"
                  label="Chapter Number"
                  type="number"
                  className={classes.textField}
                  onChange={e => this.change(e)}
                  variant="outlined"
                  value={this.state.chapnumber}
                  style={{width:'200px'}}
                  required
                  error={this.state.isChapNumberError}
                  InputProps={{
                    inputProps:{
                      min:1,max:40
                    }
                  }}
                />
                <Button 
                  variant="contained" 
                  color="primary" 
                  className={classes.button} 
                  onClick={()=>this.addChapter()}>

               Add
  
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                className={classes.button} 
                onClick={()=>this.closeaddChapter()}>

        Cancel
  
              </Button>
            </div>
                 ):(
            <div style={{padding:'12px 0 0 12px'}}>
              <Button 
                variant="contained" 
                color="secondary" 
                className={classes.button} 
                onClick={()=>this.newChapter()}>

                New Chapter
                <AddIcon className={classes.rightIcon} style={{marginLeft:'10px'}}/>

              </Button>
 
            </div>
                  )}
        </div>
      ):(null)}
    
    <Grid container spacing={12}>

   <Grid item xs={8}>
     <h3 style={{textAlign:'center'}}>{this.state.subname}</h3>
     <List
      component="nav"
      className={classes.root}
      style={{marginLeft:'8px'}}
     >

      {this.state.chapters.map((chap,index) => {
       return (
        <div key={index}>
        <Paper>
          <div style={{display:'flex',marginBottom:'5px'}}>
            
         <ListItem button onClick={()=>this.handleClick(index)}>
          <ListItemIcon>
           <StarBorder />
          </ListItemIcon>
          <ListItemText inset primary={"Chapter "+chap.ChapNumber+" , "+chap.ChapName} />
          
          {this.state[index] ? <ExpandLess /> : <ExpandMore />}
         </ListItem>

         {this.state.actor==="teacher" && (
          <Fab size="small" onClick={()=>this.DeleteChapter(chap.ChapNumber)}>
           <DeleteIcon fontSize="small" />
         </Fab>
         )}

         </div>
         </Paper>
         <Collapse in={this.state[index]} timeout="auto" unmountOnExit style={{ paddingLeft: '50px' }}>
         {this.state.actor==="teacher" ? (
           <div>
           {this.state.addLecture ? (
<div>
 
               <TextField
                  name="lectname"
                  label="Lecture Name"
                  className={classes.textField}
                  onChange={e => this.change(e)}
                  variant="outlined"
                  value={this.state.lectname}
                  style={{width:'200px'}}
                  required
                  error={this.state.isLectNameError}
                />
                <TextField
                  name="lectnumber"
                  label="Lecture Number"
                  type="number"
                  className={classes.textField}
                  onChange={e => this.change(e)}
                  variant="outlined"
                  value={this.state.lectnumber}
                  style={{width:'200px'}}
                  required
                  error={this.state.isLectNumberError}
                />
                <Button 
                  variant="contained" 
                  color="secondary" 
                  className={classes.button} 
                  onClick={()=>this.addLecture(chap.ChapNumber,chap.LectureValue)}>

                          Add
  
                </Button>
                <Button 
                  variant="contained" 
                  color="secondary" 
                  className={classes.button} 
                  onClick={()=>this.closeaddLecture()}>

                          Cancel
  
                </Button>
                
          </div>
              ):(
            <div>
                <Button 
                  variant="contained" 
                  color="primary" 
                  className={classes.button} 
                  onClick={()=>this.newLecture()}>

                  New Lecture
                  <AddIcon className={classes.rightIcon} style={{marginLeft:'10px'}}/>

                </Button>
      
                </div>
          )}
           </div>
         ):(null)}
         
      {chap.LectureValue>1 ? (
        [Object.values(chap.Lectures).map((lect,index) => {
          return (
           <div key={index}>
            
            
             <List component="div" disablePadding>
             <Paper style={{marginRight:'30px',marginBottom:'5px'}}>
               <div style={{display:'flex'}}>
               
              <ListItem button onClick={()=>this.openLecture(lect.LectureNumber,chap.ChapNumber,lect.LectureDoc,lect.LectureVideo)} >
               <ListItemIcon>
                <StarBorder />
               </ListItemIcon>
               <ListItemText inset primary={"Lecture "+lect.LectureNumber+" , "+lect.LectureName} />
               
              </ListItem>
              {this.state.actor==="teacher" && (
              <IconButton onClick={()=>this.DeleteLecture(chap.ChapNumber,lect.LectureNumber,chap.LectureValue)}>
              <DeleteIcon fontSize="small" />
              </IconButton>)}
              
         </div>
         </Paper>
             </List>
             
           </div>
          );
         })]
      ):(
        <div>
        No Lectures Uploaded
        </div>
        
      )}
         
         </Collapse>
        </div>
       );
      })}
     </List>
     </Grid>
     <Grid item xs={4}>
       
     <ChatBox subid={this.state.subid} actor={this.state.actor}/>

     </Grid>
{this.state.actor==="student" ? (
  
  <LeaveReview subjectID={this.state.subid}/>
):(null)}
     

     </Grid>
    </div>
    <Lecture onRef={ref => (this.childLecture = ref)}/>
   </div>
  );
 }
}
subjectHome.propTypes = {
 classes: PropTypes.object.isRequired,
};

const subjectHome1 = withSnackbar(subjectHome);

export default withStyles(profilePageStyle)(subjectHome1);