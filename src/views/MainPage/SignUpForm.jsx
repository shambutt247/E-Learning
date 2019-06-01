import React from "react";
import PropTypes from "prop-types";
//material Ui core components
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import TextField from "@material-ui/core/TextField";
import { withSnackbar } from 'notistack';
import Grid from "@material-ui/core/Grid";
//Firebase
import fire from "../Firebase/fire.js";

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
      name: '',
      lastname: '',
      email: '',
      passwordOne: '',
      passwordTwo: '',
      typeuser: "student",
      error: "",
      open: false,
      isError: false,
      isUserNameError: false,
      isUserNameErrorText: "",
      isEmail: false,
      isEmailErrorText: "",
      isPasswordError: false,
      isPasswordErrorText: "",
      approvedMessage:""
    };
  }


  onSubmit = e => {
    this.clearErrors();
    this.acceptData();
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({
      open: false,
      name: '',
      lastname: '',
      email: '',
      passwordOne: '',
      passwordTwo: '',
      actor: ''
    });

  };

  SendDataFirebase = () => {
    const { name, lastname, email, passwordOne, actor } = this.state;

    var fullname = `${name} ${lastname}`;
    var user = null;
    var uniqueID = null;
    fire.auth().createUserWithEmailAndPassword(email, passwordOne)
      .then(function () {
        user = fire.auth().currentUser;
      })
      .then(function () {
        user.updateProfile({
          displayName: fullname,
          photoURL:'https://firebasestorage.googleapis.com/v0/b/e-learning-5d902.appspot.com/o/images%2Fblank-profile.png?alt=media&token=fe85fb14-b4a6-4ce5-aec3-22c4e4b396ce'
        });
        uniqueID = user.uid

        fire.database().ref('users/' + uniqueID).set({
          name: name,
          lastName: lastname,
          email: email,
          userType: actor,
          userID:uniqueID,
          status:"Active",
          profImage:'https://firebasestorage.googleapis.com/v0/b/e-learning-5d902.appspot.com/o/images%2Fblank-profile.png?alt=media&token=fe85fb14-b4a6-4ce5-aec3-22c4e4b396ce'
        });
      })
      .then(() => {
        this.handleClose();
        this.handleSnack("Sign Up Successful!!","success");
      })
      .catch(error => {
        this.setState({ error: error.message }, () => { console.log(this.state.error) });
        this.handleSnack(error.message,"error");
      });

  };

  clearErrors = () => {
    this.setState({
      isError: false,
      isUserNameError: false,
      isUserNameErrorText: "",
      isEmail: false,
      isEmailErrorText: "",
      isPasswordError: false,
      isPasswordErrorText: "",
      errorActor: false
    });
  }

  acceptData = () => {
    if (this.state.name === "") {
      this.setState({
        isError: true,
        isUserNameError: true,
        isUserNameErrorText: "name cannot be empty"
      });
    }

    if (this.state.email === "") {
      this.setState({
        isError: true,
        isEmail: true,
        isEmailErrorText: "Email Cannot be empty"
      });
    }

    if (this.state.actor === "") {
      this.setState({
        isError: true,
        errorActor: true
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
        this.SendDataFirebase();
      }
    });

  }

  change = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

      handleSnack = (mess,variant) =>{
        this.props.enqueueSnackbar(mess, {variant});
      }

  render() {
    const { classes } = this.props;
    const {errorActor}=this.state;
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
          <DialogTitle> </DialogTitle>
          <DialogContent>
            <Grid
              container
              spacing={8}
              style={{ marginTop: "10px", marginBottom: "5px" }}
            >
              <Grid item xs>
                <TextField
                  name="name"
                  label="Name"
                  className={classes.textField}
                  hintText="Name"
                  onChange={e => this.change(e)}
                  variant="outlined"
                  value={this.state.name}
                  fullWidth
                  required
                  error={this.state.isUserNameError}
                  helperText={this.state.isUserNameErrorText}
                />
              </Grid>
              <Grid item xs>
                <TextField
                  name="lastname"
                  hintText="lastname"
                  label="Last Name"
                  className={classes.textField}
                  variant="outlined"
                  value={this.state.lastname}
                  onChange={e => this.change(e)}
                  fullWidth
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

              <div style={{ marginTop: "10px", marginBottom: "5px" }} />

            </Grid>

            <Grid
              container
              spacing={8}
              style={{ marginTop: "10px", marginBottom: "5px" }}
            >
              <Grid item xs>
                <TextField
                  name="passwordOne"
                  hintText="Password"
                  label="Password"
                  className={classes.textField}
                  value={this.state.passwordOne}
                  variant="outlined"
                  required
                  type="password"
                  onChange={e => this.change(e)}
                  fullWidth
                />
              </Grid>
              <Grid item xs>
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
                  type="password"
                  error={this.state.isPasswordError}
                  helperText={this.state.isPasswordErrorText}
                />
              </Grid>
            </Grid>
            <div style={{ marginTop: "15px" }} />
            <FormControl component="fieldset" required error={errorActor}>
              <FormLabel component="legend">I am a {this.state.actor}</FormLabel>
              <RadioGroup
                aria-label="Gender"
                name="actor"
                className={classes.group}
                value={this.state.actor}
                onChange={e => this.change(e)}
              >
                <FormControlLabel value="teacher" control={<Radio />} label="Teacher" />
                <FormControlLabel value="student" control={<Radio />} label="Student" />
              </RadioGroup>
              <FormHelperText>Select at least one</FormHelperText>
            </FormControl>
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
  classes: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired
  
};

const SignUpForm1 = withSnackbar(SignUpForm);
export default withStyles()(SignUpForm1);
 /*
        */