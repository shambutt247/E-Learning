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



class registerSubjects extends React.Component {
  anchorElLeft = null;
  anchorElTop = null;
  anchorElBottom = null;
  anchorElRight = null;

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      isError: false,
      subname: null,
      difficulty:null,
      category: null,
      duration: null,
      description:null,
      isSubNameError:false,
      isSubNameErrorText:null,
      isCategoryError:false,
      isDifficultyError:false,
      isDurationError:false
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.handleSnack=this.handleSnack.bind(this);
  }
  SendDataFirebase = () => {
    const { subname, difficulty, category, duration,description } = this.state;

    var database=fire.database();
    var usert=localStorage.getItem("uid");
    var userteacher=JSON.parse(usert);

    
    if(userteacher!==null){
      var newSubkey = database.ref().child('subjects').push().key;
      var postSubject = {
        subname: subname,
        description:description,
        subid:newSubkey,
        difficutly:difficulty,
        category:category ,
        duration:duration,
        status:"Blocked",
        teacherid:userteacher.uid,
        sstrenght:0,
        review:{
          average:0,
          total:0,
          RT:0
        }
      };
      var updates = {};
      updates['subjects/' + newSubkey] = postSubject;
      updates['users/' + userteacher.uid + '/subjects/' + newSubkey] = postSubject;
    
      return database.ref().update(updates);
    }
    

};

  onSubmit = e => {
    this.clearErrors();
    this.checkErrors();
  };
  handleClickOpen = () => {
    this.setState({ open: true });
  };
  checkErrors = () =>{
    if(this.state.category===null){
      this.setState({
        isError:true,
        isCategoryError:true
      });
    }

    if(this.state.difficulty===null){
      this.setState({
        isError:true,
      isDifficultyError:true
      });
      
    }

    if(this.state.duration===null){
      this.setState({
        isError:true,
        isDurationError:true
      });
      
    }

    if(this.state.subname===null){
      this.setState({
        isError:true,
      isSubNameError:true,
      isSubNameErrorText:"Name Cannot be Empty"
      });
    }

    this.setState({
    }, () => {
      if (!this.state.isError) {
        
        
        this.SendDataFirebase();
        this.handleSnack("Subject Registered!!","success");
    this.handleClose();
      }
    });

  }

  clearErrors = () =>{
    this.setState({
      isError:false,
      isSubNameError:false,
      isSubNameErrorText:null,
      isCategoryError:false,
      isDifficultyError:false,
      isDurationError:false
    });
  }
  handleClose = () => {
    
    this.setState({
      
      subname: null,
      description:null,
      difficulty:null,
      category: null,
      duration: null,
      open: false
    });
  };

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
    return (
      <div>
        Register a new Course
          <IconButton
          className={classes.button}
          aria-label="Add"
          onClick={() => this.handleClickOpen("classicModal")}
        >
          <AddIcon color="error" />
        </IconButton>


        <Dialog
          fullWidth={true}
          maxWidth={"md"}
          open={this.state.open}
          onClose={this.handleClose}
          TransitionComponent={Transition}
        >
          <DialogTitle>Enter Details of Subject</DialogTitle>
          <DialogContent>

            <Grid
              container
              spacing={12}
              justify={"center"}
              style={{ marginTop: "10px", marginBottom: "15px" }}
            >
              <Grid item xs={12} style={{textAlign: "center"}}>
                <TextField
                  name="subname"
                  label="Subjects Name"
                  className={classes.textField}
                  onChange={e => this.change(e)}
                  variant="outlined"
                  value={this.state.subname}
                  style={{width:'200px'}}
                  required
                  error={this.state.isSubNameError}
                  helperText={this.state.isSubNameErrorText}
                />
              </Grid>

              <div style={{ marginTop: "10px", marginBottom: "5px" }} />

            </Grid>
            <div style={{textAlign: "center"}}>
            <TextField
                  name="description"
                  label="Description"
                  className={classes.textField}
                  onChange={e => this.change(e)}
                  variant="outlined"
                  value={this.state.description}
                  style={{width:'400px'}}
                  multiline
                  rows="3"
                />
                </div>
            <Grid
              container
              spacing={8}
              style={{ marginTop: "10px", marginBottom: "5px",textAlign: "center" }}
            >
              <Grid item xs>
                <FormControl variant="outlined" style={{ minWidth: '150px' }}>
                  Category
          <Select
                    value={this.state.category}
                    onChange={this.change}
                    error={this.state.isCategoryError}
                    inputProps={{
                      name: 'category'
                    }}
                    required
                  >
                    <MenuItem value={'Matric'}>Matric</MenuItem>
                    <MenuItem value={'Intermediate'}>Intermediate</MenuItem>
                  </Select>
                  <FormHelperText>Select one</FormHelperText>
                </FormControl>
              </Grid>
              <Grid Item xs>
                <FormControl variant="outlined" style={{ minWidth: '150px' }}>
                  Duration
          <Select
                    value={this.state.duration}
                    onChange={this.change}
                    error={this.state.isDurationError}
                    inputProps={{
                      name: 'duration'
                    }}
                    required
                  >
                    <MenuItem value={2}>2 Weeks</MenuItem>
                    <MenuItem value={4}>4 Weeks</MenuItem>
                    <MenuItem value={6}>6 Weeks</MenuItem>
                    <MenuItem value={7}>6 Weeks + </MenuItem>
                  </Select>
                  <FormHelperText>Select one</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs>
                <FormControl variant="outlined" style={{ minWidth: '150px' }}>
                  Difficulty
          <Select
                    value={this.state.difficulty}
                    onChange={this.change}
                    error={this.state.isDifficultyError}
                    inputProps={{
                      name: 'difficulty'
                    }}
                  >
                    <MenuItem value={'Begginer'}>Begginer</MenuItem>
                    <MenuItem value={'Moderate'}>Moderate</MenuItem>
                    <MenuItem value={'Professional'}>Professional</MenuItem>
                  </Select>
                  <FormHelperText>Select one</FormHelperText>
                </FormControl>
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
                Register
              </Button>
            </Toolbar>
          </AppBar>
        </Dialog>
      </div>
    );
  }
}

registerSubjects.propTypes = {
  classes: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired
  
};

const registerSubjects1 = withSnackbar(registerSubjects);
export default withStyles()(registerSubjects1);
/**/