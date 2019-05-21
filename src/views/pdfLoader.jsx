import React from "react";
// nodejs library that concatenates classes
import PropTypes from "prop-types";
import classNames from "classnames";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// @material-ui/icons
import Button from '@material-ui/core/Button';
//firebase
import fire from './Firebase/fire';
import fireAdmin from './Admin/fire_admin';
import TextField from "@material-ui/core/TextField";

class PDFLoader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: [],
      email:""
    };
  }

  getDetails = () => {
    var emails=this.state.email;
    fireAdmin.auth().getUserByEmail(emails)
      .then(function (userRecord) {
        // See the UserRecord reference doc for the contents of userRecord.
        console.log('Successfully fetched user data:', userRecord.toJSON());

      })
      .catch(function (error) {
        console.log('Error fetching user data:', error);
      });
  }

  change = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  render() {
    const { classes, ...rest } = this.props;
    return (
      <div style={{ marginLeft: '20px', marginRight: '20px' }}>

        <TextField
          name="email"
          label="Email"
          className={classes.textField}
          hintText="Email"
          onChange={e => this.change(e)}
          value={this.state.email}
        />

        <Button component="span" className={classes.button} onClick={() => this.getDetails()}>
          UP
        </Button>


      </div>
    );
  }
}

export default withStyles()(PDFLoader);
