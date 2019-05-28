import React from "react";
// nodejs library that concatenates classes
import PropTypes from "prop-types";

import classNames from "classnames";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// @material-ui/icons
import profilePageStyle from "assets/jss/material-kit-react/views/profilePage.jsx";
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import People from '@material-ui/icons/People';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import pict from '../../assets/img/bg.jpg';
import { withSnackbar } from 'notistack';
//firebase
import fire from "../Firebase/fire.js";

import history from "../../history";

class mycoursesStudent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      studentsubjects: []
    };

  }
  componentDidMount = () => {
    let currentComponent = this;

    var user = localStorage.getItem("uid");
    var userid = JSON.parse(user);

    fire.database().ref('users/' + userid.uid + '/subjects/').on('value', function (snapshot) {
      var allsub = [];
      snapshot.forEach(function (childSnapshot) {
        
        allsub = allsub.concat(childSnapshot.val());
      });

    
      currentComponent.setState({
        studentsubjects: allsub
      });
    });

  }

  removeSubject = (subid) => {

    var database = fire.database();
    var xe=localStorage.getItem("uid");
    var userstudent = JSON.parse(xe);

    this.handleSnack("Subject Removed!!","success");
    
    if (userstudent !== null) {
      database.ref('subjects/' + subid ).once("value")
        .then(function (snapshot) {
          console.log(snapshot.val().sstrenght);
          var str = snapshot.val().sstrenght;
          var teachid = snapshot.val().teacherid;
          var updates = {};
          //database.ref('users/' + userstudent + '/subjects/' + subid).remove()
          updates['users/' + userstudent.uid + '/subjects/' + subid] = null;
          updates['subjects/' + subid + '/allUsers/'+ userstudent.uid ] = null;
          updates['subjects/' + subid + '/sstrenght'] = str - 1;
          updates['users/' + teachid +'/subjects/' + subid + '/sstrenght'] = str - 1;
          return database.ref().update(updates);
        });

    }
  }

  
  handleSnack = (mess,variant) =>{
    this.props.enqueueSnackbar(mess, {variant});
  }

  openSubject = (subjectID,subName) =>{
    let nor=this;
    fire.database().ref('subjects/' + subjectID ).on('value', function (snapshot) {
      if(snapshot.val().status!=="Blocked"){
        history.push({
          pathname: '/subject-home',
          search: '?query=abc',
          state: {  subid: subjectID,
                    actor:"student",
                    subname:subName }
        });
      }else{
        nor.handleSnack("Subject has been Blocked by Admin!!","error");
      }
    });
    
  }

  render() {
    const { classes, ...rest } = this.props;
    return (
      <div style={{ marginLeft: '20px', marginRight: '20px' }}>
        <h3 style={{ marginBottom: '20px' }}>
          Your Subjects
       </h3>
        <Grid container spacing={10} justify="space-evenly">
          {this.state.studentsubjects.map((details) =>
            <div key={details.subid}>
              <Grid item xs={5}>
                <Card style={{ width: '350px', marginBottom: '30px' }} elevation={2}>
                  <CardActionArea onClick={()=>this.openSubject(details.subid, details.subname)}>
                    <CardMedia
                      objectFit="cover"
                      image={require("assets/img/bg.jpg")}
                      title={details.subname}
                      style={{ height: '150px' }}
                    />
                    <CardContent>
                      <Grid
                        container
                        spacing={12}
                        style={{ marginTop: "10px", marginBottom: "5px" }}
                      >
                        <Grid item xs={10}>
                          <Typography gutterBottom variant="subtitle1">
                            {details.subname}
                          </Typography>
                          <Typography gutterBottom>Category : {details.category}</Typography>
                          <Typography color="textSecondary">ID: {details.subid}</Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </CardActionArea>
                  <CardActions>
                    <Button size="small" color="primary" onClick={() => this.removeSubject(details.subid)}>
                      Remove Course
        </Button>
                  </CardActions>
                </Card>
              </Grid>


            </div>)}

        </Grid>
      </div>
    );
  }
}

mycoursesStudent.propTypes = {
  classes: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired
  
};

const mycoursesStudent1 = withSnackbar(mycoursesStudent);
export default withStyles(profilePageStyle)(mycoursesStudent1);