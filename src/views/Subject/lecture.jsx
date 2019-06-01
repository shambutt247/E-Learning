import React from 'react';
import PropTypes from 'prop-types';
import VideoPlayer from "react-happy-video";
import { PDFReader } from 'react-read-pdf';

import Paper from '@material-ui/core/Paper';
import DeleteIcon from '@material-ui/icons/Delete';
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
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import fire from '../Firebase/fire';
import Commentbox from './commentBox.jsx';

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
    dataLecture: null,
    chapter: null,
    videoURL: null,
    pdfURL: null,
    currentPage: 1,
    actor: null,
    subid: null,
    isDoc: false,
    isVideo: false,
    uploadingDoc: null,
    uploadingVid: null,
    cancelDoc: false,
    cancelVideo: false,
    videoUploadStatus:"Uploading...",
    docUploadStatus:"Uploading..."
  };

  componentDidMount = () => {
    this.props.onRef(this);

  }

  LoadVideo = () => {
    let oldState = this;

    var chap = this.state.chapter;
    var lec = this.state.dataLecture;
    var subi = this.state.subid;

    var Ref = fire.storage().ref();

    Ref.child('Subjects/' + subi + '/Materials/Chapter ' + chap + '/Lecture ' + lec + '/Video/' + chap + lec + 'Video.mp4').getDownloadURL().then(function (url) {
      oldState.setState({ videoURL: url });
    }).catch(function (error) {
      console.error(error);
    });
  }

  LoadDocument = () => {
    let oldState = this;
    var chap = this.state.chapter;
    var lec = this.state.dataLecture;
    var subi = this.state.subid;
    var Ref = fire.storage().ref();

    Ref.child('Subjects/' + subi + '/Materials/Chapter ' + chap + '/Lecture ' + lec + '/Doc/' + chap + lec + 'Doc.pdf').getDownloadURL().then(function (url) {
      oldState.setState({ pdfURL: url });
    }).catch(function (error) {
      console.error(error);
    });
  }

  UpPage = () => {
    var curr = this.state.currentPage + 1;
    this.setState({
      currentPage: curr
    });
  }

  DownPage = () => {
    if (this.state.currentPage > 1) {
      var curr = this.state.currentPage - 1;
      this.setState({
        currentPage: curr
      });
    }

  }

  handleClickOpen = (title, chapter, subid, actor, isDoc, isVideo) => {
    this.setState({
      open: true,
      dataLecture: title,
      chapter: chapter,
      subid: subid,
      actor: actor,
      isDoc: isDoc,
      isVideo: isVideo
    }, () => {
      if (isDoc) {
        this.LoadDocument();
      }

      if (isVideo) {
        this.LoadVideo();
      }
    });

  };

  uploadVideo = (file) => {

    let oldState = this;
    // Create a root reference
    var chap = this.state.chapter;
    var lec = this.state.dataLecture;
    var subi = this.state.subid;

    var Ref = fire.storage().ref();
    var progress = null;
    var file = file.target.files[0];
    var prog = Ref.child('Subjects/' + subi + '/Materials/Chapter ' + chap + '/Lecture ' + lec + '/Video/' + chap + lec + 'Video.mp4').put(file);

    prog.on('state_changed', function (snapshot) {

      progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100 | 0;
      oldState.setState({ uploadingVid: progress });

      if (oldState.state.cancelVideo) {
        oldState.setState({
          cancelVideo: false,
          uploadingVid: null,
          videoUploadStatus:"Uploading..."
        });
        prog.cancel();
      }

    }, function (error) {
      console.log(error)
    }, function () {

      prog.snapshot.ref.getDownloadURL().then(function (url) {
        oldState.setState({ videoURL: url });
      });


      var database = fire.database();
      var updates = {};
      updates['subjects/' + subi + '/Materials/Chapter ' + chap + '/Lectures/Lecture ' + lec + '/LectureVideo'] = true;

      database.ref().update(updates);

    });

  }

  uploadDoc = (file) => {

    let oldState = this;
    // Create a root reference
    var chap = this.state.chapter;
    var lec = this.state.dataLecture;
    var subi = this.state.subid;

    var Ref = fire.storage().ref();
    var progress = null;
    var file = file.target.files[0];
    var prog = Ref.child('Subjects/' + subi + '/Materials/Chapter ' + chap + '/Lecture ' + lec + '/Doc/' + chap + lec + 'Doc.pdf').put(file);

    prog.on('state_changed', function (snapshot) {

      progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100 | 0;
      oldState.setState({
        uploadingDoc: progress,
      });

      if (oldState.state.cancelDoc) {
        oldState.setState({
          cancelDoc: false,
          uploadingDoc: null,
          docUploadStatus:"Uploading..."
        });
        prog.cancel();
      }

    }, function (error) {
      console.log(error)
    }, function () {

      prog.snapshot.ref.getDownloadURL().then(function (url) {
        oldState.setState({ pdfURL: null }, () => {
          oldState.setState({ pdfURL: url });
        });
      });

      var database = fire.database();
      var updates = {};
      updates['subjects/' + subi + '/Materials/Chapter ' + chap + '/Lectures/Lecture ' + lec + '/LectureDoc'] = true;

      database.ref().update(updates);

    });

  }

  handleClose = () => {
    this.setState({
      open: false,
      videoURL: null,
      pdfURL: null,
      currentPage: 1,
      actor: null,
      subid: null,
      isDoc: false,
      isVideo: false,
      uploadingDoc: null,
      uploadingVid: null
    });
  };

  DeleteVideo = () => {

    if (this.state.isVideo) {
      let oldState = this;
      // Create a root reference
      var chap = this.state.chapter;
      var lec = this.state.dataLecture;
      var subi = this.state.subid;

      var Ref = fire.storage().ref();

      Ref.child('Subjects/' + subi + '/Materials/Chapter ' + chap + '/Lecture ' + lec + '/Video/' + chap + lec + 'Video.mp4').delete().then(function () {

        oldState.setState({
          videoURL: null,
          isVideo: false
        });

        var database = fire.database();
        var updates = {};
        updates['subjects/' + subi + '/Materials/Chapter ' + chap + '/Lectures/Lecture ' + lec + '/LectureVideo'] = false;
        updates['subjects/' + subi + '/Materials/Chapter ' + chap + '/Lectures/Lecture ' + lec + '/LectureComments'] = null;
        database.ref().update(updates);

      }).catch(function (error) {
        console.log(error);
      });
    }

  }

  DeletePDF = () => {

    if (this.state.isDoc) {
      let oldState = this;
      // Create a root reference
      var chap = this.state.chapter;
      var lec = this.state.dataLecture;
      var subi = this.state.subid;

      var Ref = fire.storage().ref();

      Ref.child('Subjects/' + subi + '/Materials/Chapter ' + chap + '/Lecture ' + lec + '/Doc/' + chap + lec + 'Doc.pdf').delete().then(function () {

        oldState.setState({
          pdfURL: null,
          isDoc: false
        });

        var database = fire.database();
        var updates = {};
        updates['subjects/' + subi + '/Materials/Chapter ' + chap + '/Lectures/Lecture ' + lec + '/LectureDoc'] = false;

        database.ref().update(updates);

      }).catch(function (error) {
        console.log(error);
      });
    }

  }

  cancelUploadVideo = () => {
    this.setState({
      cancelVideo: true,
      videoUploadStatus:"Cancelling...Please Wait"
    });
  }

  cancelUploadDoc = () => {
    this.setState({
      cancelDoc: true,
      docUploadStatus:"Cancelling...Please Wait"
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

        <Dialog
          fullScreen
          open={this.state.open}
          onClose={this.handleClose}
          TransitionComponent={Transition}
        >
          <AppBar className={classes.appBar} style={{height:'50px'}}>
            <Toolbar>

              <Typography variant="h6" color="inherit" className={classes.flex}>
                Chapter {this.state.chapter} , Lecture {this.state.dataLecture}
              </Typography>
              <IconButton color="inherit" onClick={this.handleClose} aria-label="Close">
                <CloseIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
          <Grid container spacing={12} style={{ marginLeft: '12px', marginRight: '12px', marginTop: '12px' }} >

            <Grid item xs={6}>
              {this.state.actor === "teacher" ? (

                <div style={{ textAlign: 'center' }}>

                  <input
                    accept="video/*"
                    style={{ display: 'none' }}
                    id="button-file-video"
                    type="file"
                    onChange={(e) => this.uploadVideo(e)}
                  />
                  {(this.state.uploadingVid<100 && this.state.uploadingVid>=1) ? (null):(
                    <div>
                    <label htmlFor="button-file-video">
                    <Button component="span" className={classes.button}>
                      Upload Video
                  </Button>
                  </label>
                  <div style={{ marginLeft: '15px', display: 'inline' }} />
                  <Fab size="small" onClick={() => this.DeleteVideo()}>
                    <DeleteIcon fontSize="small" />
                  </Fab>
                  </div>
                    )}
                  
                  <LinearProgress variant="determinate" value={this.state.uploadingVid} style={{ height: '10px', marginRight: '12px', marginBottom: '10px' }} />
                  {this.state.uploadingVid < 100 ? (
                    <div>
                      {this.state.uploadingVid >= 1 ? (
                        <div style={{marginBottom:'15px'}}>
                          {this.state.cancelVideo ? (
                            <p style={{marginBottom:'0px'}}>Cancelling...Please Wait</p>
                          ):(
                            <p style={{marginBottom:'0px'}}>Uploading...{this.state.uploadingVid}%</p>
                          )}
                          <Button component="span" className={classes.button} onClick={() => this.cancelUploadVideo()}>
                            Cancel
                          </Button>
                        </div>
                      ) : (
                          <div>

                          </div>
                        )}
                    </div>
                  ) : (
                      <div>
                        <p>Uploaded !</p>
                      </div>
                    )}
                </div>

              ) : (null)}

              {this.state.videoURL != null ? (
                <div>

                <VideoPlayer
                  width="650px"
                  color="#3b3346"
                  source={this.state.videoURL}
                />
                  <Commentbox 
                    subid={this.state.subid}
                    chapter={this.state.chapter}
                    lecture={this.state.dataLecture}
                    actor={this.state.actor}
                  />
                </div>

              ) : (
                  <div>
                    {this.state.isVideo ? (
                      <div style={{ textAlign: 'center' }}>
                        <CircularProgress className={classes.progress} />
                      </div>
                    ) : (
                        <div style={{ textAlign: 'center' }}>
                          <p>No Video Uploaded</p>
                        </div>
                      )}

                  </div>
                )}


            </Grid>
            <Grid item xs={6}>
              {this.state.actor === "teacher" ? (

                <div style={{ textAlign: 'center' }}>
                  <input
                    accept=".pdf"
                    style={{ display: 'none' }}
                    id="button-file-doc"
                    type="file"
                    onChange={(e) => this.uploadDoc(e)}
                  />

                  {(this.state.uploadingDoc<100 && this.state.uploadingDoc>=1) ? (null):(
                    <div>
                  <label htmlFor="button-file-doc">
                    <Button component="span" className={classes.button}>
                      Upload Doc
                    </Button>
                  </label>
                  <div style={{ marginLeft: '15px', display: 'inline' }} />
                  <Fab size="small" onClick={() => this.DeletePDF()}>
                    <DeleteIcon fontSize="small" />
                  </Fab>
                  </div>
                  )}
                  <LinearProgress variant="determinate" value={this.state.uploadingDoc} style={{ marginLeft: '12px', height: '10px', marginBottom: '10px' }} />
                  {this.state.uploadingDoc < 100 ? (
                    <div>
                      {this.state.uploadingDoc >= 1 ? (
                        <div style={{marginBottom:'15px'}}>
                          {this.state.cancelDoc ? (
                            <p style={{marginBottom:'0px'}}>Cancelling...Please Wait</p>
                          ):(
                            <p style={{marginBottom:'0px'}}>Uploading...{this.state.uploadingDoc}%</p>
                          )}
                          
                          <Button component="span" className={classes.button} onClick={() => this.cancelUploadDoc()}>
                            Cancel
                           </Button>
                        </div>
                      ) : (
                          <div>

                          </div>
                        )}
                    </div>
                  ) : (
                      <div>
                        <p>Uploaded !</p>
                      </div>
                    )}
                </div>

              ) : (null)}

              {this.state.pdfURL != null ? (
                <div>
                  <div style={{ overflow: 'scroll', height: 525 }}>
                    <PDFReader url={this.state.pdfURL}
                      width={650}
                      page={this.state.currentPage} />
                  </div>
                  <Grid item style={{ textAlign: 'center' }}>
                    <Fab onClick={() => this.DownPage()} size="small" className={classes.fab} style={{ marginRight: '5px' }}>
                      <ArrowLeft />
                    </Fab>

                    <Fab onClick={() => this.UpPage()} size="small" className={classes.fab}>
                      <ArrowRight />
                    </Fab>
                  </Grid>
                </div>
              ) : (
                  <div>
                    {this.state.isDoc ? (
                      <div style={{ textAlign: 'center' }}>
                        <CircularProgress className={classes.progress} />
                      </div>
                    ) : (
                        <div style={{ textAlign: 'center' }}>
                          <p>No Document Uploaded</p>
                        </div>
                      )}
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

