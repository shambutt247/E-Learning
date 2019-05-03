import React from "react";
// nodejs library that concatenates classes
import PropTypes from "prop-types";
import { PDFReader } from 'react-read-pdf';
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

class PDFLoader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      completed:null,
      url:null,
      pdfURL:null,
      currentPage:1,
      numPages: null,
      pageNumber: 1,
    };
  }

  getImage = () =>{

let oldState=this;
// Create a root reference
var Ref = fire.storage().ref();

Ref.child('images/DASApplicationForm.pdf').getDownloadURL().then(function(url) {
  oldState.setState({ pdfURL: url });
 }).catch(function(error) {
  console.error(error);
 });
 
  }

  UpPage = () =>{
    var curr=this.state.currentPage+1;
this.setState({
currentPage:curr
});
  }

  DownPage = () =>{
    var curr=this.state.currentPage-1;
    this.setState({
    currentPage:curr
    });
  }
  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages });
  }
  onDocumentComplete = (totalPage) => {
    console.log(totalPage);
    console.log("heelo");
  }

  render() {
    const { pageNumber, numPages } = this.state;
    const { classes, ...rest } = this.props;
    return (
      <div style={{ marginLeft: '20px', marginRight: '20px' }}>

      
      <Button component="span" className={classes.button} onClick={()=>this.getImage()}>
          Retrieve
        </Button>
        
          {this.state.pdfURL!=null ? (
            <div>
            <div style={{overflow:'scroll',height:590}}>
            <PDFReader url={this.state.pdfURL}
            showAllPage={true}
            OnDocumentComplete={totalPage=>this.onDocumentComplete(totalPage)}
            width={650}
            page={this.state.currentPage}/>
           </div>
           
            
           
           <Button component="span" className={classes.button} onClick={()=>this.UpPage()}>
          UP
        </Button>
        <Button component="span" className={classes.button} onClick={()=>this.DownPage()}>
         DOWN
        </Button>
        </div>
          ):(
<div></div>
          )}
            
      </div>
    );
  }
}

export default withStyles()(PDFLoader);
/*<div style={{overflow:'scroll',height:590}}>
            <PDFReader url={this.state.pdfURL}
            showAllPage={true}
            OnDocumentComplete={(totalPage)=>this.onDocumentComplete(totalPage)}
            width={650}
            page={this.state.currentPage}/>
           </div>*/