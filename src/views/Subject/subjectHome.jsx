import React from "react";
// @material-ui/core components
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
// core components
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
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';
import fire from "../Firebase/fire.js";
import Lecture from './lecture.jsx';
import Grid from '@material-ui/core/Grid';

import Fab from '@material-ui/core/Fab';

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
   subid:this.props.location.state.subid,
   actor:this.props.location.state.actor
  };
  this.openLecture=this.openLecture.bind(this);
 }
 componentDidMount = () => {
  let currentComponent = this;

  
  fire.database().ref('subjects/'+ this.state.subid + '/Materials').orderByChild('ChapNumber').on('value', function(snapshot) {
    var allchap=[];
    snapshot.forEach(function(childSnapshot){
      allchap=allchap.concat(childSnapshot.val());
    });
    console.log(allchap);
    currentComponent.setState({
     chapters:allchap
    });
});

}

 handleClick = (index) => {
   if(this.state[index]===true){
    this.setState(state => ({ [index]: false }));
   }else {
    this.setState(state => ({ [index]: true }));
   }
  
 };

 openLecture = (title,chapter) =>{
  this.childLecture.handleClickOpen(title,chapter);
 };

 change = e => {
  this.setState({
    [e.target.name]: e.target.value
  });
};

newChapter = () =>{
 this.setState({
addChapter:true
 });
}



addChapter = () =>{

 //Check if not duplicate Chapter Number
 //
 this.SendDataChapterFirebase();
//var chapie="Chapter "+`${this.state.chapnumber}`;
 this.setState({
  addChapter:false
 });
}

newLecture = () =>{
  this.setState({
 addLecture:true
  });
 }
 
 addLecture = (chapnumber) =>{
 
  //Check if not duplicate Chapter Number
  //
  this.SendDataLectureFirebase(chapnumber);
 //var chapie="Chapter "+`${this.state.chapnumber}`;
  this.setState({
   addLecture:false
  });
 }

 closeaddLecture = () =>{
  this.setState({
    addLecture:false
   });
 }

 closeaddChapter = () =>{
  this.setState({
    addChapter:false
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
     LectureValue:0
   };
   var updates = {};
   updates['subjects/' + subid + '/Materials/Chapter ' + chapnumber] = postMaterial;
 
   return database.ref().update(updates);
 }
};

SendDataLectureFirebase = (chapnumber) => {
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
    updates['subjects/' + subid + '/Materials/Chapter ' + chapnumber + '/LectureValue'] = 1;
    return database.ref().update(updates);
  }
 };

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
    
    <div className={classNames(classes.main, classes.mainRaised)} style={{ marginTop: '90px' }}>
    {this.state.addChapter ? (
<div>
 
               <TextField
                  name="chapname"
                  label="Chapter Name"
                  className={classes.textField}
                  onChange={e => this.change(e)}
                  variant="outlined"
                  value={this.state.chapname}
                  style={{width:'200px'}}
                  required
                />
                <TextField
                  name="chapnumber"
                  label="Chapter Number"
                  className={classes.textField}
                  onChange={e => this.change(e)}
                  variant="outlined"
                  value={this.state.chapnumber}
                  style={{width:'200px'}}
                  required
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
            <div>
              <Button 
                variant="contained" 
                color="secondary" 
                className={classes.button} 
                onClick={()=>this.newChapter()}
                style={{marginLeft:'18px'}}>

                New Chapter
                <AddIcon className={classes.rightIcon} style={{marginLeft:'10px'}}/>

              </Button>
 
            </div>
                  )}
    <Grid container spacing={12}>

   <Grid item xs={8}>
     <List
      component="nav"
      subheader={<ListSubheader component="div">Your Subject</ListSubheader>}
      className={classes.root}
     >

      {this.state.chapters.map((chap,index) => {
       return (
        <div key={index}>
         <ListItem button onClick={()=>this.handleClick(index)}>
          <ListItemIcon>
           <StarBorder />
          </ListItemIcon>
          <ListItemText inset primary={"Chapter "+chap.ChapNumber} />
          
          
          {this.state[index] ? <ExpandLess /> : <ExpandMore />}
         </ListItem>
         <Collapse in={this.state[index]} timeout="auto" unmountOnExit style={{ paddingLeft: '30px' }}>
         
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
                />
                <TextField
                  name="lectnumber"
                  label="Lecture Number"
                  className={classes.textField}
                  onChange={e => this.change(e)}
                  variant="outlined"
                  value={this.state.lectnumber}
                  style={{width:'200px'}}
                  required
                />
                <Button 
                  variant="contained" 
                  color="secondary" 
                  className={classes.button} 
                  onClick={()=>this.addLecture(chap.ChapNumber)}>

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
                  onClick={()=>this.newLecture()}
                  style={{marginLeft:'18px'}}>

                  New Lecture
                  <AddIcon className={classes.rightIcon} style={{marginLeft:'10px'}}/>

                </Button>
      
                </div>
          )}
      {chap.LectureValue===1 ? (
        [Object.values(chap.Lectures).map((lect,index) => {
          return (
           <div key={index}>
            
            
             <List component="div" disablePadding>
              <ListItem button onClick={()=>this.openLecture(lect.LectureNumber,chap.ChapNumber)} >
               <ListItemIcon>
                <StarBorder />
               </ListItemIcon>
               <ListItemText inset primary={"Lecture "+lect.LectureNumber} />
              </ListItem>
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
       Hello
     </Grid>
     </Grid>
    </div>
    <Footer />
    <Lecture onRef={ref => (this.childLecture = ref)}/>
   </div>
  );
 }
}
subjectHome.propTypes = {
 classes: PropTypes.object.isRequired,
};
export default withStyles(profilePageStyle)(subjectHome);
/**/