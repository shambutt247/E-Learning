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
import LinearProgress from '@material-ui/core/LinearProgress';
//firebase
import fire from './Firebase/fire';

class uploading extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      completed:null,
      url:null
    };
  }

  addFiles = (file) =>{
console.log(file.target.files);
let oldState=this;
// Create a root reference
var Ref = fire.storage().ref();
var progress=null;
var metadata = {
 customMetadata: {
  'location': 'Yosemite, CA, USA',
  'activity': 'Hiking'
}
};
var file = file.target.files[0];
var prog=Ref.child('images/pathetic.jpg').put(file,metadata);

prog.on('state_changed', function(snapshot){

 progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
 oldState.setState({ completed: progress });
 
});

  }

  getImage = () =>{

let oldState=this;
// Create a root reference
var Ref = fire.storage().ref();

Ref.child('images/pathetic.jpg').getDownloadURL().then(function(url) {
 oldState.setState({ url: url });
}).catch(function(error) {
 console.error(error);
});
 
  }

  render() {
    const { classes, ...rest } = this.props;
    return (
      <div style={{ marginLeft: '20px', marginRight: '20px' }}>

      <input
        accept="image/*"
        style={{display:'none'}}
        id="text-button-file"
        multiple
        type="file"
        onChange={(e)=>this.addFiles(e)}
      />
      <label htmlFor="text-button-file">
        <Button component="span" className={classes.button}>
          Upload
        </Button>
      </label>
      <LinearProgress variant="determinate" value={this.state.completed} style={{width:'150px',height:'10px'}}/>
      <Button component="span" className={classes.button} onClick={()=>this.getImage()}>
          Retrieve
        </Button>
        <img src={this.state.url}/>
      </div>
    );
  }
}

export default withStyles()(uploading);