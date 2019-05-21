import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Paper from '@material-ui/core/Paper';
import DialogTitle from '@material-ui/core/DialogTitle';

class reviewPanel extends React.Component {
  state = {
    open: false,
    Reviews:[]
  };

  handleClickOpen = () => {
    this.setState({ open: true,
    Reviews:this.props.AllReview });
    console.log(this.props.AllReview);
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    return (
      <div>
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
          <DialogContent>
          {Object.values(this.state.Reviews).map((lect,index) => {
          return (
           <div key={index}>
            <Paper>
             {lect.userName}
            {lect.rating}
            {lect.comments}
             </Paper>
           </div>
          );
         })}
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