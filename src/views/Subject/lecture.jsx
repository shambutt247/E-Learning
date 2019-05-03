import React from 'react';
import PropTypes from 'prop-types';
import VideoPlayer from "react-happy-video";
import { PDFReader } from 'react-read-pdf';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import ArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import ArrowRight from '@material-ui/icons/KeyboardArrowRight';
import Fab from '@material-ui/core/Fab';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';

import fire from '../Firebase/fire';

const styles = {
  appBar: {
    position: 'relative',
  },
  flex: {
    flex: 1,
  },
};

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class lecture extends React.Component {
  state = {
    open: false,
    dataLecture:null,
    chapter:null,
    videoURL:null,
    pdfURL:null,
    currentPage:1,
    teacher:false,
    LectureDoc:false,
    LectureVideo:false,
    uploadingDoc:null,
    uploadingVid:null
  };

  componentDidMount = () => {
    this.props.onRef(this);
      let oldState=this;
      // Create a root reference
      var Ref = fire.storage().ref();
      
      Ref.child('images/Skyrim.mp4').getDownloadURL().then(function(url) {
       oldState.setState({ videoURL: url });
      }).catch(function(error) {
       console.error(error);
      });

      Ref.child('images/DASApplicationForm.pdf').getDownloadURL().then(function(url) {
        oldState.setState({ pdfURL: url });
       }).catch(function(error) {
        console.error(error);
       });
      
        }
  
        onDocumentLoadSuccess = ({ totalPage }) => {
          this.setState({ numPages:totalPage });
          console.log(totalPage);
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

  handleClickOpen = (title,chapter) => {
    this.setState({ 
      open: true,
      dataLecture:title,
      chapter:chapter
    });
  };

  uploadVideo = (file) =>{
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
     oldState.setState({ uploadingVid: progress });
     
    });
    
      }

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;

    return (
      <div>
        
        <Dialog
          fullScreen
          open={this.state.open}
          onClose={this.handleClose}
          TransitionComponent={Transition}
        >
          <AppBar className={classes.appBar}>
            <Toolbar>
              
              <Typography variant="h6" color="inherit" className={classes.flex}>
                Chapter {this.state.chapter} , Lecture {this.state.dataLecture}
              </Typography>
              <IconButton color="inherit" onClick={this.handleClose} aria-label="Close">
                <CloseIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
          <Grid container spacing={12} style={{marginLeft:'12px',marginRight:'12px',marginTop:'12px'}}>

   <Grid item xs={6}>
   <input
        accept="video/*"
        style={{display:'none'}}
        id="button-file-video"
        type="file"
        onChange={(e)=>this.uploadVideo(e)}
      />
      <label htmlFor="button-file-video">
      <Button component="span" className={classes.button}>
        Upload Video
      </Button>
      </label>
   

<LinearProgress variant="determinate" value={this.state.uploadingVid} style={{width:'150px',height:'10px'}}/>

   <VideoPlayer
        width="650px"
        color="#3b3346"
        source={this.state.videoURL}
    />

   </Grid>
   <Grid item xs={6}>

<Button onClick={()=>this.uploadDoc()} className={classes.button}>
  Upload Doc
</Button>

<LinearProgress variant="determinate" value={this.state.uploadingDoc} style={{width:'150px',height:'10px'}}/>

  {this.state.pdfURL!=null ? (
            <div>
            <div style={{overflow:'scroll',height:525}}>
            <PDFReader url={this.state.pdfURL}
            width={650}
            page={this.state.currentPage}/>
           </div>
           <Grid item style={{textAlign:'center'}}>
        <Fab onClick={()=>this.DownPage()} size="small" className={classes.fab} style={{marginRight:'5px'}}>
        <ArrowLeft />
      </Fab>
       
        <Fab onClick={()=>this.UpPage()} size="small" className={classes.fab}>
        <ArrowRight />
      </Fab>
      </Grid>
        </div>
          ):(
<div>
  <p>Loading....</p>
</div>
          )}

  
</Grid>
   </Grid>

        </Dialog>
      </div>
    );
  }
}

lecture.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(lecture);

  /* 
  <div>
        <Document
          file={this.state.pdfURL}
          onLoadSuccess={this.onDocumentLoadSuccess}
        >
          <Page pageNumber={pageNumber} />
        </Document>
        <p>Page {pageNumber} of {numPages}</p>
      </div>
           */
