import React from "react";
import { Link } from "react-router-dom";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import GridContainer from "../../components/Grid/GridContainer.jsx";
import GridItem from "../../components/Grid/GridItem.jsx";
import Grid from "@material-ui/core/Grid";
import Button from "components/CustomButtons/Button.jsx";
import Card from "../../components/Card/Card.jsx";
import CardBody from "../../components/Card/CardBody.jsx";
import CardFooter from "../../components/Card/CardFooter.jsx";
import CustomInput from "../../components/CustomInput/CustomInput.jsx";
import CustomHeaderLinks from "components/Header/CustomHeaderLinks.jsx";
import Header from "components/Header/Header.jsx";
import typographyStyle from "assets/jss/material-kit-react/views/componentsSections/typographyStyle.jsx";
import loginPageStyle from "../../assets/jss/material-kit-react/views/loginPage.jsx";
import imageAvatar from "assets/img/faces/avatar.jpg";
import image from "assets/img/bg7.jpg";
import Paper from '@material-ui/core/Paper';
import SignUpForm from "./SignUpForm.jsx";
import { FirebaseContext } from '../Firebase';

class LoginMainPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentDidMount() {

  }
  SignInCheck(){
    //Check Account then Proceed to Link
    //else
    //Issue Red Flags
  }
  render() {
    const { classes, ...rest  } = this.props;
    return (
      <div>
      <Header
          color="transparent"
          brand="E-Learning Portal !"
          rightLinks={<FirebaseContext.Consumer>
      {Firebase => <SignUpForm Firebase={Firebase} />}
    </FirebaseContext.Consumer>}
          fixed
          changeColorOnScroll={{
            height: 200,
            color: "white"
          }}
          {...rest}
        />
        <div
          className={classes.pageHeader}
          style={{
            backgroundImage: "url(" + image + ")",
            backgroundSize: "cover",
            backgroundPosition: "top center"
          }}
        >
        <div className={classes.container}>
            <GridContainer justify="space-around" alignItems="center" spacing={16}>
              <GridItem xs={5}>
                <Card className={classes[this.state.cardAnimaton]}>
                  <form className={classes.form}>
                    <CardBody>
                      <h3 className={classes.title}>
                        <b>Sign in</b>
                      </h3>
                      <CustomInput
                        labelText="Account Name or Roll Number"
                        id="email"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          type: "regular"
                        }}
                      />
                      <CustomInput
                        labelText="Password"
                        id="password"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          type: "password"
                        }}
                      />
                      <font size="2">
                        No Account? </font>
                        <font size="2" color="blue">
                          Sign Up from the top!
                        </font>
                    
                    </CardBody>
                    <CardFooter className={classes.cardFooter}>
                      <Link to={"/main-page"} className={classes.link}>
                        <GridItem>
                          <Button color="info" onClick={this.SignInCheck}>
                            Next
                          </Button>
                        </GridItem>
                      </Link>
                    </CardFooter>
                  </form>
                </Card>
              </GridItem>
            </GridContainer>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(loginPageStyle)(LoginMainPage);
