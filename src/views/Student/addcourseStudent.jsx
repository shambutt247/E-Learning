import React from "react";
// nodejs library that concatenates classes
import PropTypes from "prop-types";

import classNames from "classnames";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// @material-ui/icons
import profilePageStyle from "assets/jss/material-kit-react/views/profilePage.jsx";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import People from '@material-ui/icons/People';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import pict from '../../assets/img/bg.jpg';
import ReviewPanel from '../Subject/reviewPanel.jsx'
import TextField from '@material-ui/core/TextField';
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
      allsubs:[],
      opens: false,
      singlesub: null,
      ratings: 0,
      selection:"none",
      search: "",
      search2:""
    };

  }

  componentDidMount = () => {

    let currentComponent = this;

    fire.database().ref('subjects/').on('value', function (snapshot) {
      var allsub = [];
      snapshot.forEach(function (childSnapshot) {
        if(childSnapshot.val().status!=="Blocked"){
          allsub = allsub.concat(childSnapshot.val());
        }
            });
      currentComponent.setState({
        allsubjects: allsub,
        allsubs:allsub
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

  handleMatric = () =>{
    let ac2=this.state.allsubjects.filter(x => x.category.includes("Matric"));
    this.setState({
      allsubs:ac2
    });

this.setState({
selection:"Matric"
});
  }

  handleInter = () =>{
    let ac2=this.state.allsubjects.filter(x => x.category.includes("Intermediate"));
    this.setState({
      allsubs:ac2
    });
    this.setState({
    selection:"Intermediate"
    });
  }

  handleAll = () =>{
    let ac2=this.state.allsubjects;
    this.setState({
      allsubs:ac2
    });
    this.setState({
    selection:"All"
    });
  }

  change = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSearch = () =>{
    
    if(this.state.search!=="" && this.state.search!==this.state.search2){
      var st=this.state.search;
    let ac2=this.state.allsubjects.filter(x => x.subname.toLowerCase().includes(this.state.search));
    this.setState({
      allsubs:ac2,
      search2:st
    });
  } else if(this.state.search==="" && this.state.search2!==""){
    this.setState({
      allsubs:this.state.allsubjects,
      search2:""
    });
  }
  }

  render() {
    const { classes, ...rest } = this.props;
    this.handleSearch();
    return (
      <div style={{ marginLeft: '20px', marginRight: '20px' }}>

        <MoreDetailsSubject onRef={ref => (this.childAddDims = ref)} />



        <h3 style={{ marginBottom: '20px' }}>
          Search Subject
       </h3>
       <div style={{textAlign:'center',borderBottom:'inset',paddingBottom:'18px'}}>
       <Button onClick={()=>this.handleMatric()} color="primary" autoFocus>
              Matric
            </Button>
            <Button onClick={()=>this.handleInter()} color="primary" autoFocus>
              Intermediate
            </Button>
            <Button onClick={()=>this.handleAll()} color="primary" autoFocus>
              All
            </Button>
            {this.state.selection!=='none' ? (
              <TextField
              name="search"
              placeholder="Subject Name...."
              className={classes.textField}
              hintText="Search"
              onChange={e => this.change(e)}
              value={this.state.search}
            />
            ):(null)}
            
       </div>
       

            {this.state.selection==="none" ? (
            <div style={{textAlign:'center',marginTop:'25px'}}>
              Please Select an Option Above !
            </div>
          ):(
        <Grid container spacing={4} justify="center" style={{marginTop:'50px'}}>
            
            {this.state.allsubs.map((details) =>

              <Grid item xs={4} style={{textAlign:'center'}}>

                  <div key={details.subid}>
              
                <Card style={{ width: '350px', marginBottom: '30px' }} elevation={2}>
                  <CardActionArea onClick={() => this.handleDetailsSubject(details)}>
                    <CardMedia
                      objectFit="cover"
                      image={require("assets/img/bg.jpg")}
                      title={details.subname}
                      style={{ height: '150px' }}
                    />
                    <CardContent style={{padding:'9px'}}>
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
                  <CardActions style={{ justifyContent: 'center' }}>
                    {Array.apply(null,Array(parseInt(details.review.RT,10))).map((i)=>
                          <Star  />
                          )}
                          {Array.apply(null,Array(5-parseInt(details.review.RT,10))).map((i)=>
                          <StarBorder  />
                          )}

                    <ReviewPanel AllReview={details.review.allreviews} AnyRev={details.review.total}/>

                  </CardActions>
                </Card>
              
              </div>
              </Grid>



            )}
            
        </Grid>
        )}
      </div>
    );
  }
}

export default withStyles(profilePageStyle)(addcourseStudent);
