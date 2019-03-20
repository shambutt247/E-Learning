import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// @material-ui/icons
import profilePageStyle from "assets/jss/material-kit-react/views/profilePage.jsx";

class homeTeacher extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount = () => {
  }
  
  render() {
    const { classes, ...rest } = this.props;
    return (
      <div style={{ marginLeft:'20px', marginRight:'20px'}}>
       <h1>
       Hello
       </h1>
       <p className={classes.textCenter}>
                          I think that’s a responsibility that I have, to push
                          possibilities, to show people, this is the level that
                          things could be at. I will be the leader of a company
                          that ends up being worth billions of dollars, because
                          I got the answers. I understand culture. I am the
                          nucleus. I think that’s a responsibility that I have,
                          to push possibilities, to show people, this is the
                          level that things could be at.
                        </p>
       
      </div>
    );
  }
}

export default withStyles(profilePageStyle)(homeTeacher);
