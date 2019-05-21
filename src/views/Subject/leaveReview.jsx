import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import StarBorder from '@material-ui/icons/StarBorder';
import Star from '@material-ui/icons/Star';
import fire from '../Firebase/fire';

const styles = theme => ({
 form: {
  display: 'flex',
  flexDirection: 'column',
  margin: 'auto',
  width: 'fit-content',
 },
 formControl: {
  marginTop: theme.spacing.unit * 2,
  minWidth: 120,
 },
 formControlLabel: {
  marginTop: theme.spacing.unit,
 },
});

class leaveReview extends React.Component {
 state = {
  newR:false,
  userID:null,
  userName:null,
  open: false,
  comments: "",
  rating: 0,
  rate1: false,
  rate2: false,
  rate3: false,
  rate4: false,
  rate5: false,
  oldRating:0,
  average:0,
  total:0
 };

 componentDidMount = () => {

  
}

 handleClickOpen = () => {
  var user = localStorage.getItem("uid");
  var user1 = JSON.parse(user);
  var nameInitial = user1.displayName;
  var userID=user1.uid;

  this.setState({
 userID:userID,
 userName:nameInitial,
 open: true
  });

  var oldState=this;

  var ref = fire.database().ref('subjects/' + this.props.subjectID + '/review/allreviews/' + userID+'/');
    ref.once("value")
      .then(function(snapshot) {
       
        var a = snapshot.exists();
        if(a){
          var rating=snapshot.val().rating;
         if(rating===1){
          oldState.setState({
           rate1:true,
           newR:false,
           rating:1,
           oldRating:1,
           comments:snapshot.val().comments
          });
         }
         if(rating===2){
          oldState.setState({
           rate1:true,
           rate2:true,
           newR:false,
           rating:2,
           oldRating:2,
           comments:snapshot.val().comments
          });
         }
         if(rating===3){
          oldState.setState({
           rate1:true,
           rate2:true,
           rate3:true,
           newR:false,
           rating:3,
           oldRating:3,
           comments:snapshot.val().comments
          });
         }
         if(rating===4){
          oldState.setState({
           rate1:true,
           rate2:true,
           rate3:true,
           rate4:true,
           newR:false,
           rating:4,
           oldRating:4,
           comments:snapshot.val().comments
          });
         }
         if(rating===5){
          oldState.setState({
           rate1:true,
           rate2:true,
           rate3:true,
           rate4:true,
           rate5:true,
           newR:false,
           rating:5,
           oldRating:5,
           comments:snapshot.val().comments
          });
         }
         
                 }else{
                  oldState.setState({
                     newR:true,
                     oldRating:0
                  });
                 }
      });
  ref=fire.database().ref('subjects/' + this.props.subjectID + '/review');
  ref.once("value")
  .then(function(snapshot) {
    oldState.setState({
      average:snapshot.val().average,
      total:snapshot.val().total
    });
  });

 };

 handleClose = () => {
  this.setState({ open: false,
  rating:0,
  rate1:false,
  rate2:false,
  rate3:false,
  rate4:false,
  rate5:false,
  comments:""
  });
 }

 change = e => {
  this.setState({
   [e.target.name]: e.target.value
  });
 };

 handleSave = () =>{
  const { rating , comments ,userID , userName , newR , oldRating , average , total } = this.state;
  var database=fire.database();
  var subid=this.props.subjectID;
  var postMaterial=[];

   if(rating!==0){

    postMaterial = {
     userName:userName,
     userID:userID,
     rating: rating,
     comments:comments
   };
   
   var updates = {};
   updates['subjects/' + subid + '/review/allreviews/' + userID] = postMaterial;
   

   if(newR===false){
    var newAv=average - oldRating;
    updates['subjects/' + subid + '/review/average'] = newAv+rating;
    updates['subjects/' + subid + '/review/RT'] = ((newAv+rating) / total)*5 | 0;
    
   }else if(newR===true){
    updates['subjects/' + subid + '/review/average'] = average+rating;
    updates['subjects/' + subid + '/review/total'] = total+5;
    updates['subjects/' + subid + '/review/RT'] = ((average+rating) / (total+5))*5 | 0;
   }
 

   database.ref().update(updates);
  this.handleClose();
  }
 }

 handleRating1 = () => {
  if (this.state.rate1 === false) {
   this.setState({
    rate1: true,
    rating:1
   });
  } else {
   this.setState({
    rate1: false,
    rate2: false,
    rate3: false,
    rate4: false,
    rate5: false,
    rating:0
   });
  }

 }

 handleRating2 = () => {
  if (this.state.rate2 === false) {
   this.setState({
    rate1: true,
    rate2: true,
    rating:2
   });
  } else {
   this.setState({
    rate2: false,
    rate3: false,
    rate4: false,
    rate5: false,
    rating:1
   });
  }
 }

 handleRating3 = () => {

  if (this.state.rate3 === false) {
   this.setState({
    rate1: true,
    rate2: true,
    rate3: true,
    rating:3
   });
  } else {
   this.setState({
    rate3: false,
    rate4: false,
    rate5: false,
    rating:2
   });
  }
 }

 handleRating4 = () => {
  if (this.state.rate4 === false) {
   this.setState({
    rate1: true,
    rate2: true,
    rate3: true,
    rate4: true,
    rating:4
   });
  } else {
   this.setState({
    rate4: false,
    rate5: false,
    rating:3
   });
  }
 }

 handleRating5 = () => {
  if (this.state.rate5 === false) {
   this.setState({
    rate1: true,
    rate2: true,
    rate3: true,
    rate4: true,
    rate5: true,
    rating:5

   });
  } else {
   this.setState({
    rate5: false,
    rating:4
   });
  }
 }

 render() {
  const { classes } = this.props;

  return (
   <React.Fragment>
    <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
     Leave Review
        </Button>
    <Dialog
     maxWidth={"sm"}
     open={this.state.open}
     onClose={this.handleClose}
     aria-labelledby="max-width-dialog-title"
    >
     <DialogTitle id="max-width-dialog-title">Please Leave a Review</DialogTitle>
     <DialogContent style={{textAlign:'center'}}>
      <DialogContentText>
       Rate out of 5
            </DialogContentText>
      <Grid container spacing={12}>
       <Grid item xs={12}>
        {this.state.rate1 ? (
         <Star onClick={() => this.handleRating1()} />
        ) : (
          <StarBorder onClick={() => this.handleRating1()} />
         )}

        {this.state.rate2 ? (
         <Star onClick={() => this.handleRating2()} />
        ) : (
          <StarBorder onClick={() => this.handleRating2()} />
         )}

        {this.state.rate3 ? (
         <Star onClick={() => this.handleRating3()} />
        ) : (
          <StarBorder onClick={() => this.handleRating3()} />
         )}

        {this.state.rate4 ? (
         <Star onClick={() => this.handleRating4()} />
        ) : (
          <StarBorder onClick={() => this.handleRating4()} />
         )}

        {this.state.rate5 ? (
         <Star onClick={() => this.handleRating5()} />
        ) : (
          <StarBorder onClick={() => this.handleRating5()} />
         )}
       </Grid>
       <Grid item xs={12}>
        <TextField
         fullWidth
         name="comments"
         value={this.state.comments}
         label="Comments (Optional)"
         multiline
         rows="4"
         onChange={e => this.change(e)}
         className={classes.textField}
         variant="filled"
        />
       </Grid>
      </Grid>





     </DialogContent>

     <DialogActions>
      <Button onClick={this.handleClose} color="primary">
       Close
            </Button>
      <Button onClick={this.handleSave} color="primary">
       Save
            </Button>

     </DialogActions>
    </Dialog>
   </React.Fragment>
  );
 }
}

leaveReview.propTypes = {
 classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(leaveReview);