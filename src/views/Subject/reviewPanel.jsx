import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Paper from '@material-ui/core/Paper';
import DialogTitle from '@material-ui/core/DialogTitle';
import Avatar from '@material-ui/core/Avatar';
import Star from '@material-ui/icons/Star';
import StarBorder from '@material-ui/icons/StarBorder';
import Grid from '@material-ui/core/Grid';
import fire from '../Firebase/fire';

class reviewPanel extends React.Component {
  state = {
    open: false,
    Reviews:[],
    AnyRev:0,
    profImage:'https://firebasestorage.googleapis.com/v0/b/e-learning-5d902.appspot.com/o/images%2Fblank-profile.png?alt=media&token=fe85fb14-b4a6-4ce5-aec3-22c4e4b396ce'
  };

  handleProfImage = (rv) =>{
    let old=this;
    if(this.state.AnyRev!==0){
      const qw=Object.values(rv).map((fd)=>{
        fire.database().ref('users/' + fd.userID ).once('value').then( function (snapshot) {
          var Prof=snapshot.val().profImage;
          old.setState(state => ({ 
            [fd.userID]: Prof
           }));
        
      });
      
      })
    }

      
  }

  handleClickOpen = () => {
    this.setState({ open: true,
      AnyRev:this.props.AnyRev,
    Reviews:this.props.AllReview });
    this.handleProfImage(this.props.AllReview);
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    return (
      <div style={{paddingLeft:'16px'}}>
        <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
          See Reviews
        </Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          maxWidth={"sm"}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          
        >
          <DialogTitle id="alert-dialog-title">{"Reviews by Student"}</DialogTitle>
          <DialogContent style={{width:'350px'}}>
            {this.state.AnyRev!==0 ? (
              <div>
              {Object.values(this.state.Reviews).map((lect,index) => {
          return (
           <div key={index}>
            <Paper style={{marginBottom:'5px'}}>
              <Grid container spacing={2} >
                <Grid item xs={2} style={{textAlign:'-webkit-center',marginTop:'7px'}}>
                
                <Avatar src={this.state[lect.userID]}/>

                </Grid>
                <Grid item xs={10} style={{marginTop:'14px'}}>

                {lect.userName}
            
                </Grid>
                <Grid item xs={12} style={{marginLeft:'9px',marginTop:'9px'}}>
                {Array.apply(null,Array(parseInt(lect.rating,10))).map((i)=>
                          <Star  fontSize='small'/>
                          )}
                          {Array.apply(null,Array(5-parseInt(lect.rating,10))).map((i)=>
                          <StarBorder fontSize='small' />
                          )}
                </Grid>
                {lect.comments!=="" ? (
                  <Grid item xs={12} style={{marginLeft:'12px',marginRight:'12px',marginBottom:'5px'}}>
                  {lect.comments}
                  </Grid>
                ):(null)}
              </Grid>
            
            
             </Paper>
           </div>
          );
         })}
         </div>
            ):(
              <div style={{textAlign:'center'}}>
                No Reviews Given !
              </div>
            )}
          
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary" autoFocus>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default reviewPanel;