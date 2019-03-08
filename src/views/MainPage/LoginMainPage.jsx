import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import GridContainer from "../../components/Grid/GridContainer.jsx";
import GridItem from "../../components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "../../components/Card/Card.jsx";
import CardBody from "../../components/Card/CardBody.jsx";
import CardFooter from "../../components/Card/CardFooter.jsx";
import Header from "components/Header/Header.jsx";
import loginPageStyle from "../../assets/jss/material-kit-react/views/loginPage.jsx";
import image from "assets/img/bg7.jpg";
import SignUpForm from "./SignUpForm.jsx";
import { withFirebase } from '../Firebase';
import TextField from "@material-ui/core/TextField";

class LoginMainPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email:"",
      password:"",
      err:"",
      failedlogin:false,
      authUser:null
    };
  }
  componentDidMount = () => {
    this.listener = this.props.Firebase.auth.onAuthStateChanged(authUser => {
      authUser
        ? this.setState({ authUser },()=>{console.log(authUser)})
        : this.setState({ authUser: null },()=>{console.log(authUser)});
    });
  }
  

  componentWillUnmount = () => {
    this.listener();
  }

  SignInCheck = () => {
    const { email, password } = this.state;

    this.props.Firebase
    .doSignInWithEmailAndPassword(email, password)
    .then(() => {
      this.LoggedIn();
    })
    .catch(error => {
      this.FailedLogin(error.message);
    });
  }

  FailedLogin = (err) =>{
    this.setState({
      err:err,
      failedlogin:true
    },()=>{
      console.log(this.state.error);
    });
  }
  LoggedIn= () =>{
    this.setState({
      email:"",
      password:""
    });
    this.props.history.push('/profile-page');
  }
  change = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };
  render() {
    const { classes, ...rest  } = this.props;
    return (
      <div>
      <Header
          color="transparent"
          brand="E-Learning Portal !"
          rightLinks={<SignUpForm />}
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
                      <TextField
                  name="email"
                  label="Email"
                  className={classes.textField}
                  hintText="Email"
                  onChange={e => this.change(e)}
                  value={this.state.email}
                  fullWidth
                />
                <div style={{ marginTop: "10px"}} />
                <TextField
                  name="password"
                  label="Password"
                  className={classes.textField}
                  hintText="Password"
                  onChange={e => this.change(e)}
                  value={this.state.Password}
                  fullWidth
                  error={this.state.failedlogin}
                  helperText={this.state.err}
                />
                <div style={{ marginTop: "5px"}} />
                      <font size="2">
                        No Account? </font>
                        <font size="2" color="blue">
                          Sign Up from the top!
                        </font>
                    
                    </CardBody>
                    <CardFooter className={classes.cardFooter} justifyContent="center">
                      
                          <Button color="info" onClick={this.SignInCheck}>
                            Next
                          </Button>
                        
                      
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


export default withStyles(loginPageStyle)(withFirebase(LoginMainPage));
