import React from "react";
import history from "../../history";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// @material-ui/icons
import Button from "components/CustomButtons/Button.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Camera from "@material-ui/icons/CameraAlt";
import profile from "assets/img/faces/christian.jpg";
import profilePageStyle from "assets/jss/material-kit-react/views/profilePage.jsx";
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Avatar from 'react-avatar-edit'
import Done from '@material-ui/icons/Done';
import LinearProgress from '@material-ui/core/LinearProgress';
//Firebase
import fire from "../Firebase/fire.js";

class profileStudent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Name: null,
      Acr: null,
      src: null,
      uploadPicture: false,
      preview: null,
      ppicture: null,
      completed: null,
      uplad: null
    };
  }
  componentDidMount = () => {
    if("uid" in localStorage){
      
      var user = localStorage.getItem("uid");
      var user1 = JSON.parse(user);
      var nameInitial = user1.displayName;
      var acr = nameInitial.split(' ').map(x => x[0]).join('');
      var PhtoURL = user1.photoURL
      if (PhtoURL === null) {
        this.setState({
          ppicture: false
        });
      } else {
        this.setState({
          ppicture: true,
          preview: PhtoURL
        });
      }
      this.setState({
        Name: user1.displayName,
        Acr: acr
      }, () => {
        console.log(this.state.Name);
      });

    }else {
      history.push('/');
    };
    
  }

  onClose = () => {
    this.setState({ preview: null })
  }

  onCrop = (preview) => {
    this.setState({
      preview,
      ppicture: true
    })
  }

  uploadingScreen = () => {
    this.setState({
      uploadPicture: true
    });
  }

  uploadedPicture = () => {
    let database=fire.database();
    let oldState = this;
    var user = fire.auth().currentUser;
    var Ref = fire.storage().ref();
    var progress = null;
    var prog = Ref.child('users/' + user.uid + '/Images/profileimg.jpg').putString(this.state.preview, 'data_url');

    prog.on('state_changed', function (snapshot) {

      progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      oldState.setState({ completed: progress });

    }, function (error) {
      console.log(error.message);
    }, function () {
      // Upload completed successfully, now we can get the download URL
      prog.snapshot.ref.getDownloadURL().then(function (downloadURL) {
        user.updateProfile({
          photoURL: downloadURL
        })
        var updates = {};
        updates['users/' + user.uid + '/profImage'] = downloadURL;
    
        database.ref().update(updates);
        oldState.setState({
          uploadPicture: false
        });
        user = fire.auth().currentUser;
        localStorage.setItem("uid", JSON.stringify(user));
      });
    });



  }

  onFileLoad = (file) => {
    this.setState({
      uplad: file
    });
  }

  render() {
    const { classes, ...rest } = this.props;
    const imageClasses = classNames(
      classes.imgRaised,
      classes.imgRoundedCircle
    );
    return (
      <div style={{ marginLeft: '20px', marginRight: '20px' }}>
        <div className={classes.container}>
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={6}>
              <div style={{ textAlign: 'center' }}>
                <div>
                  {this.state.ppicture ? (
                    <img src={this.state.preview} className={imageClasses} style={{ widht: '160px', height: '160px', marginLeft: '52px' }} />
                  ) : (
                      <a style={{ marginBottom: '200px' }}>No Image</a>
                    )}

                  <Tooltip title="Change Picture">
                    <IconButton onClick={() => this.uploadingScreen()}>
                      <Camera />
                    </IconButton>
                  </Tooltip>
                </div>
                <div>
                  <h3>{this.state.Name}</h3>
                  <h6>STUDENT</h6>
                </div>
              </div>
            </GridItem>
            {this.state.uploadPicture ? (
              <GridItem xs={12} sm={12} md={6}>

                <div style={{ textAlign: '-webkit-center' }}>
                  <Avatar
                    width={390}
                    height={295}
                    onCrop={this.onCrop}
                    onClose={this.onClose}
                    onFileLoad={(file) => this.onFileLoad(file)}
                    src={this.state.src}
                  />
                  <LinearProgress variant="determinate" value={this.state.completed} style={{ width: '150px', height: '10px' }} />
                  <IconButton onClick={() => this.uploadedPicture()}>
                    <Done />
                  </IconButton></div>
              </GridItem>
            ) : (
                <div>

                </div>
              )}



          </GridContainer>
          <div className={classes.description}>
            <p>
              An artist of considerable range, Chet Faker — the name taken
              by Melbourne-raised, Brooklyn-based Nick Murphy — writes,
              performs and records all of his own music, giving it a warm,
                  intimate feel with a solid groove structure.{" "}
            </p>
          </div>

        </div>
      </div>
    );
  }
}

export default withStyles(profilePageStyle)(profileStudent);
