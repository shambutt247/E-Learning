import React from "react";
// nodejs library that concatenates classes
import PropTypes from "prop-types";

import classNames from "classnames";
import { withSnackbar } from 'notistack';
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// @material-ui/icons
import profilePageStyle from "assets/jss/material-kit-react/views/profilePage.jsx";
import RegisterSubject from "./registerSubject";
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
//firebase
import fire from "../Firebase/fire.js";
import history from "../../history";


class mycoursesTeacher extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      teachersubjects: [],
      teacherid:''
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
      console.log(allsub);
      currentComponent.setState({
        teachersubjects: allsub
      });
    });

  }

  openSubject = (subjectID, subName, status) => {

    if (status !== "Blocked") {
      history.push({
        pathname: '/subject-home',
        search: '?query=abc',
        state: {
          subid: subjectID,
          actor: "teacher",
          subname: subName
        }
      });
    } else {
      this.handleSnack("Subject has been Blocked by Admin!!", "error");
    }


  }

  handleSnack = (mess, variant) => {
    this.props.enqueueSnackbar(mess, { variant });
  }

  handleDeleteSubject = (e,subid) => {
    let old=this;
    
    var user = localStorage.getItem("uid");
    var userid = JSON.parse(user);

    var database = fire.database();
    var updates = {};

    database.ref('subjects/' + subid + '/allUsers').once('value').then(function (snapshot) {

      snapshot.forEach(function (childSnapshot) {
        updates['users/' + childSnapshot.val().userid + '/subjects/' + subid] = null;
        console.log("1");
      });
      
      updates['users/' + userid.uid + '/subjects/' + subid] = null;
      
      updates['subjects/' + subid] = null;
      
      database.ref().update(updates);
      old.handleSnack("Subject Deleted!!", "success");
      
    });
  }

  render() {
    const { classes, ...rest } = this.props;
    return (
      <div style={{ marginLeft: '20px', marginRight: '20px', overflow: '-webkit-paged-x' }}>
        <RegisterSubject />
        <h3 style={{ marginBottom: '20px' }}>
          My Subjects
       </h3>
        <Grid container spacing={10} justify="space-evenly">
          {this.state.teachersubjects.map((details) => {
            const backColor = (details.status === "Blocked") ? '#FF5454' : '#FFFFFF';
            return (
              <div key={details.subid}>
                <Grid item xs={5}>
                  <Card style={{ width: '350px', marginBottom: '30px' }} elevation={2}>
                    <CardActionArea onClick={() => this.openSubject(details.subid, details.subname, details.status)} style={{ backgroundColor: backColor }}>
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
                          <Grid item xs={1}>
                            <People />
                          </Grid>
                          <Grid item xs={1}>
                            <Typography variant="subtitle2">{details.sstrenght}</Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </CardActionArea>
                    <CardActions style={{ justifyContent: 'center' }}>

                      <Button variant="outlined" color="primary" onClick={(e) => this.handleDeleteSubject(e, details.subid)}>
                        Delete
        </Button>

                    </CardActions>
                  </Card>
                </Grid>







              </div>
            );
          }
          )}

        </Grid>
      </div>
    );
  }
}
mycoursesTeacher.propTypes = {
  classes: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired

};

const mycoursesTeacher1 = withSnackbar(mycoursesTeacher);
export default withStyles(profilePageStyle)(mycoursesTeacher1);