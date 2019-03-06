import React from "react";
import PropTypes from "prop-types";
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

import TextField from "@material-ui/core/TextField";

import Grid from "@material-ui/core/Grid";
//Firebase

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class SignUpForm extends React.Component {
  anchorElLeft = null;
  anchorElTop = null;
  anchorElBottom = null;
  anchorElRight = null;

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      passwordOne: '',
      passwordTwo: '',
      error: "",
      open: false,
      isError: false,
      isUserNameError: false,
      isUserNameErrorText: "",
      isEmail: false,
      isEmailErrorText: "",
      isPasswordError: false,
      isPasswordErrorText: ""
    };
  }


  onSubmit = e => {
    this.clearErrors();
    this.acceptData(e);
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = (event) => {
    const { username, email, passwordOne } = this.state;

    this.props.Firebase
    .doCreateUserWithEmailAndPassword(email, passwordOne).
    then(authUser => {
        this.setState({ 
          open: false,
      username: '',
      email: '',
      passwordOne: '',
      passwordTwo: ''
         });
      })
      .catch(error => {
        console.log(error);
      })

    
  };

  clearErrors = () => {
    this.setState({
      isError: false,
      isUserNameError: false,
      isUserNameErrorText: "",
      isEmail: false,
      isEmailErrorText: "",
      isPasswordError: false,
      isPasswordErrorText: ""
    });
  }

  acceptData = (e) => {
    if (this.state.username === "") {
      this.setState({
        isError: true,
        isUserNameError: true,
        isUserNameErrorText: "Username cannot be empty"
      });
    }

    if (this.state.email === "") {
      this.setState({
        isError: true,
        isEmail: true,
        isEmailErrorText: "Email Cannot be empty"
      });
    }

    if (this.state.passwordOne !== this.state.passwordTwo) {
      this.setState({
        isError: true,
        isPasswordError: true,
        isPasswordErrorText: "Password not same"
      });
    }

    if (this.state.passwordOne === "" || this.state.passwordTwo === "") {
      this.setState({
        isError: true,
        isPasswordError: true,
        isPasswordErrorText: "Password cannot be Empty"
      });
    }

    this.setState({
    }, () => {
      if (!this.state.isError) {
        this.handleClose(e);
      }
    });

  }

  change = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Button
          simple
          color="inherit"
          onClick={() => this.handleClickOpen("classicModal")}
        >
          Sign Up
          </Button>
        <Dialog
          fullWidth={true}
          maxWidth={"md"}
          open={this.state.open}
          onClose={this.handleClose}
          TransitionComponent={Transition}
        >
          <DialogTitle>{this.props.titlePage}</DialogTitle>
          <DialogContent>
            <Grid
              container
              spacing={8}
              style={{ marginTop: "10px", marginBottom: "5px" }}
            >
              <Grid item xs>
                <TextField
                  name="username"
                  label="UserName"
                  className={classes.textField}
                  hintText="User Name"
                  onChange={e => this.change(e)}
                  variant="outlined"
                  value={this.state.username}
                  fullWidth
                  required
                  error={this.state.isUserNameError}
                  helperText={this.state.isUserNameErrorText}
                />
              </Grid>
              <Grid item xs>
                <TextField
                  name="email"
                  hintText="email"
                  label="Email"
                  className={classes.textField}
                  variant="outlined"
                  value={this.state.email}
                  onChange={e => this.change(e)}
                  fullWidth
                  required
                  error={this.state.isEmail}
                  helperText={this.state.isEmailErrorText}
                />
              </Grid>
            </Grid>
            <TextField
              name="passwordOne"
              hintText="Password"
              label="Password"
              className={classes.textField}
              value={this.state.passwordOne}
              variant="outlined"
              required
              onChange={e => this.change(e)}
              fullWidth
            />
            <div style={{ marginTop: "10px", marginBottom: "5px" }} />
            <TextField
              name="passwordTwo"
              hintText="Confirm Password"
              label="Confirm Password"
              className={classes.textField}
              value={this.state.passwordTwo}
              variant="outlined"
              onChange={e => this.change(e)}
              fullWidth
              required
              error={this.state.isPasswordError}
              helperText={this.state.isPasswordErrorText}
            />
            <div style={{ marginTop: "20px", marginBottom: "20px" }} />

            <Grid
              container
              spacing={8}
              style={{ marginTop: "10px", marginBottom: "5px" }}
            >
              <Grid item xs>
              </Grid>
              <Grid item xs>

              </Grid>
            </Grid>
          </DialogContent>
          <AppBar style={{ position: "relative" }}>
            <Toolbar variant="dense">
              <Button color="inherit" onClick={e => this.handleClose()}>
                Cancel
              </Button>
              <div style={{ flex: 1 }} />
              <Button color="inherit" onClick={e => this.onSubmit(e)}>
                {this.props.openDims ? <div>Update</div> : <div>Register</div>}
              </Button>
            </Toolbar>
          </AppBar>
        </Dialog>
      </div>
    );
  }
}

SignUpForm.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles()(SignUpForm);
