import React from 'react';
import PropTypes from 'prop-types';

import Paper from '@material-ui/core/Paper';
import DeleteIcon from '@material-ui/icons/Delete';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import ArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import ArrowRight from '@material-ui/icons/KeyboardArrowRight';
import Fab from '@material-ui/core/Fab';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import fire from '../Firebase/fire';
import Link from '@material-ui/core/Link';
import Divider from '@material-ui/core/Divider';


const styles = {
 appBar: {
   position: 'relative',
 },
 flex: {
   flex: 1,
 },
};

class commentBox extends React.Component {
  state = {
    textCom:'',
    commentList:[],
    textRep:'',
    oldIndex:null,
    subid:null,
    actor:null,
    chapter:null,
    lecture:null,
    userID:null,
    name:null,
  };

  componentDidMount = () => {

   if("uid" in localStorage){

     var user = localStorage.getItem("uid");
   var user1 = JSON.parse(user);
   var nameInitial = user1.displayName;
   var userID=user1.uid;

   this.setState({
    subid:this.props.subid,
    actor:this.props.actor,
    chapter:this.props.chapter,
    lecture:this.props.lecture,
    userID:userID,
    name:nameInitial
   })

   let currentComponent = this;
 
   
   fire.database().ref('subjects/'+this.props.subid+'/Materials/Chapter '+this.props.chapter+'/Lectures/Lecture '+this.props.lecture+'/LectureComments').on('value', function(snapshot) {

     var allcom=[];
     snapshot.forEach(function(childSnapshot){
       allcom=allcom.concat(childSnapshot.val());
     });
     currentComponent.setState({
      commentList:allcom
     });
 });
     
   }

 }


  change = e => {
    this.setState({
     [e.target.name]: e.target.value
    });
   };

   postComment = () =>{
      var com={
            author: this.state.name,
            actID: this.state.userID,
            actor: this.state.actor,
            replies:"0",
            data: { text:this.state.textCom }
      };
      var database=fire.database();
   
      var updates = {};
      this.setState({
        commentList: [...this.state.commentList, com],
        textCom:""
      },()=>{
        updates['subjects/'+this.state.subid+'/Materials/Chapter '+this.state.chapter+'/Lectures/Lecture '+this.state.lecture+'/LectureComments'] = this.state.commentList;
        return database.ref().update(updates);
      })
    
   }

   postReply = (e,index) =>{

    var database=fire.database();

    var newSubkey = database.ref().child('subjects/'+this.state.subid+'/Materials/Chapter '+this.state.chapter+'/Lectures/Lecture '+this.state.lecture+'/LectureComments/'+index+'/replyS').push().key;
    let repo={
      author:this.state.name,
      actor:this.state.actor,
      data:{text:this.state.textRep}
     };
     
      var updates = {};
      updates['subjects/'+this.state.subid+'/Materials/Chapter '+this.state.chapter+'/Lectures/Lecture '+this.state.lecture+'/LectureComments/'+index+'/replyS/'+newSubkey] = repo;
      updates['subjects/'+this.state.subid+'/Materials/Chapter '+this.state.chapter+'/Lectures/Lecture '+this.state.lecture+'/LectureComments/'+index+'/replies'] = '1';  
      database.ref().update(updates);

    this.setState({
     [index]:false,
     textRep:''
    });

   }

   handleReply = (index) =>{
   
     let oldie=this.state.oldIndex;
     if(this.state.oldIndex!==index){
  
      if(this.state[index]===true){
        this.setState(state => ({ 
          [index]: false,
          oldIndex:index,
          textRep:''
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
          [index]: false,
          textRep:''
         }));
       }else {
        this.setState(state => ({ 
          [index]: true
        }));
       }
     }
  }

  render() {
    const { classes } = this.props;

    return (
      <div>

                  <h3>Comments</h3>
                  <TextField
                  fullWidth
                  name="textCom"
                  value={this.state.textCom}
                  label="leave a comment..."
                  onChange={e => this.change(e)}
                  variant="outlined"
                  onKeyPress={e => {if(e.key==='Enter')
                                     this.postComment();}}
                  className={classes.textField}
                  />
                  <Grid container>
                   
                  
                  {this.state.commentList.map((msg,index)=>{
                    return(
                      <Grid item xs={12} key={index}>
                        <Paper style={{borderRadius:'12px',padding:'8px 8px 8px 8px',display:'flex',alignItems:'center',maxWidth:'100%',marginBottom:'1px'}}>
                         <Grid container >
                         <Grid item xs={12}><h4 style={{fontSize:'small',margin:'0px'}}>
                          {(msg.actor==='teacher' || msg.actor==='admin') ? (
                           <div style={{display:'inline',color:'#ff0000'}}> ( {msg.actor} )</div>
                          ):(<div style={{display:'inline'}}>{msg.author}</div>)}
                          </h4></Grid>
                        <div>{msg.data.text}</div>
                        <Grid item xs={12} style={{height:'14px',textAlign:'end'}}> <Link
                          component="button"
                          variant="body2"
                          onClick={() => this.handleReply(index)}
    >
      reply
    </Link></Grid></Grid>
                        </Paper>
                        {this.state[index] ? (
                         <TextField
                           fullWidth
                           name="textRep"
                           value={this.state.textRep}
                           onChange={e => this.change(e)}
                           variant="outlined"
                           label="leave a reply..."
                           onKeyPress={e => {if(e.key==='Enter')
                                     this.postReply(e,index);}}
                           className={classes.textField}
                           style={{
                            width:'90%',
                            marginLeft:'10%',
                            marginTop:'7px'
                           }}
                         />
                        ):(
                         null
                        )}
                        {msg.replies!=='0' ? (
                         <Paper style={{marginLeft:'10%',width:'90%',marginBottom:'10px'}}>
                         <Grid container>

                         {Object.values(msg.replyS).map((rep,index) => {
                          return (
                          <Grid item xs={12} style={{margin:'5px 5px 5px 5px',borderBottom:'ridge'}} key={index}>
                          <Grid container >
                         <Grid item xs={12}><h4 style={{fontSize:'small',margin:'0px'}}>
                         {(rep.actor==='teacher' || rep.actor==='admin') ? (
                           <div style={{display:'inline',color:'#ff0000'}}> ( {rep.actor} )</div>
                          ):(<div style={{display:'inline'}}>{rep.author}</div>)}
                          </h4></Grid>
                        <div>{rep.data.text}</div>
                        </Grid>
                          </Grid>
                          );
                         })}
                         
                         </Grid>
                        </Paper>

                        ):(null)}
                        
                      
                      </Grid>
                    );
                  })}
                  </Grid>
                </div>

             
    );
  }
}

commentBox.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(commentBox);

