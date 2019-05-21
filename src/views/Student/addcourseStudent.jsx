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
import ReviewPanel from '../Subject/reviewPanel.jsx'
//firebase
import fire from "../Firebase/fire.js";
import MoreDetailsSubject from "./moredetailsSubject.jsx";
import Star from '@material-ui/icons/Star';
import StarBorder from '@material-ui/icons/StarBorder';

class addcourseStudent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allsubjects: [],
      opens: false,
      singlesub: null,
      ratings: 0
    };

  }

  componentDidMount = () => {

    let currentComponent = this;

    fire.database().ref('subjects/').on('value', function (snapshot) {
      var allsub = [];
      snapshot.forEach(function (childSnapshot) {
        allsub = allsub.concat(childSnapshot.val());
      });
      currentComponent.setState({
        allsubjects: allsub
      });
    });

  }

  handleDetailsSubject = (details) => {
    console.log(details);
    this.childAddDims.handleClickOpen(details);
    this.setState({
      opens: true,
      singlesub: details
    })
  }

  closeOff = () => {
    this.setState({
      opens: false
    })
  }

  render() {
    const { classes, ...rest } = this.props;
    return (
      <div style={{ marginLeft: '20px', marginRight: '20px' }}>

        <MoreDetailsSubject onRef={ref => (this.childAddDims = ref)} />



        <h3 style={{ marginBottom: '20px' }}>
          Search Subject
       </h3>
        <Grid container spacing={10} justify="space-evenly">
          {this.state.allsubjects.map((details) =>
            <div key={details.subid}>
              <Grid item xs={5}>
                <Card style={{ width: '350px', marginBottom: '30px' }} elevation={2}>
                  <CardActionArea onClick={() => this.handleDetailsSubject(details)}>
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
                        <Grid item xs={10} zeroMinWidth>
                          <Typography gutterBottom variant="subtitle1" noWrap>
                            {details.subname}
                          </Typography>
                          <Typography gutterBottom>Category : {details.category}</Typography>
                          <Typography color="textSecondary">ID: {details.subid}</Typography>
                        </Grid>

                        <Grid item xs={1}>
                          <People />
                        </Grid>
                        <Grid item xs={1} zeroMinWidth>
                          <Typography variant="subtitle2">{details.sstrenght}</Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </CardActionArea>
                  <CardActions style={{ justifyContent: 'space-around' }}>
                    {details.review.RT === 5 ? (
                      <div>
                        <Star />
                        <Star />
                        <Star />
                        <Star />
                        <Star />
                      </div>
                    ) : (
                        <div>
                          {details.review.RT === 4 ? (
                            <div>
                              <Star />
                              <Star />
                              <Star />
                              <Star />
                              <StarBorder />
                            </div>
                          ) : (
                            <div>
                          {details.review.RT === 3 ? (
                            <div>
                              <Star />
                              <Star />
                              <Star />
                              <StarBorder />
                              <StarBorder />
                            </div>
                          ) : (
                            <div>
                          {details.review.RT === 2 ? (
                            <div>
                              <Star />
                              <Star />
                              <StarBorder />
                              <StarBorder />
                              <StarBorder />
                            </div>
                          ) : (
                            <div>
                          {details.review.RT === 1 ? (
                            <div>
                              <Star />
                              <StarBorder />
                              <StarBorder />
                              <StarBorder />
                              <StarBorder />
                            </div>
                          ) : (
                            <div>
                          {details.review.RT === 0 ? (
                            <div>
                              <StarBorder />
                              <StarBorder />
                              <StarBorder />
                              <StarBorder />
                              <StarBorder />
                            </div>
                          ) : (
                            <div>
                            <Typography variant="subtitle2">No Reviews Given</Typography>
                            </div>
                        )}
                        </div>
                        )}
                        </div>
                        )}
                        </div>
                        )}
                        </div>
                        )}
                        </div>
                      )}

                    <ReviewPanel AllReview={details.review.allreviews}/>

                  </CardActions>
                </Card>
              </Grid>


            </div>)}

        </Grid>
      </div>
    );
  }
}

export default withStyles(profilePageStyle)(addcourseStudent);