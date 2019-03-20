import React from "react";
import history from "../../history";
import classNames from "classnames";
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
import TextField from "@material-ui/core/TextField";
import profile from "assets/img/faces/christian.jpg";
import Fab from '@material-ui/core/Fab';
//firebase
import fire from "../Firebase/fire.js";

class LoginMainPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      err: "",
      failedlogin: false,
      roleActor: null,
      actorSelected: true
    };
  }

  SignInCheck = () => {

    const { email, password } = this.state;

    fire.auth().signInWithEmailAndPassword(email, password).then(authUser => {
      this.LoggedIn(authUser);
    })
      .catch(error => {
        this.FailedLog(error.message)
      });

  }


  FailedLog = (err) => {
    this.setState({
      err: err,
      failedlogin: true
    }, () => {
      console.log(this.state.error);
    });
  }

  LoggedIn = (authUser) => {

    localStorage.setItem("uid", JSON.stringify(authUser.user));
    fire.database().ref('/users/' + authUser.user.uid).once('value').then(function(snapshot) {
      var userType=snapshot.val().userType;
      if (userType === "student") {
        history.push('/home-student');
      }
      else if (userType === "teacher") {
        history.push('/home-teacher');
      }
    }).catch(error=>{
      this.FailedLog(error.message);
    });
  }

  change = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  changeActor = (actorer) => {
    if (this.state.actorSelected) {
      this.setState({
        actorSelected: false,
        roleActor:""
      });
    } else {
      this.setState({
        actorSelected: true,
        roleActor:actorer
      });
    }

  };

  render() {
    const { classes, ...rest } = this.props;
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
          {this.state.actorSelected ? (
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
                        <div style={{ marginTop: "10px" }} />
                        <TextField
                          name="password"
                          label="Password"
                          className={classes.textField}
                          hintText="Password"
                          onChange={e => this.change(e)}
                          value={this.state.password}
                          fullWidth
                          error={this.state.failedlogin}
                          helperText={this.state.err}
                        />
                        <div style={{ marginTop: "5px" }} />
                        <font size="2">
                          No Account? </font>
                        <font size="2" color="blue">
                          Sign Up from the top!
                        </font>

                      </CardBody>
                      <CardFooter className={classes.cardFooter} justifyContent="center">
                      {/*<Button color="info" onClick={() => this.changeActor("")}>
                          Change Actor
                          </Button>*/}
                        <Button color="info" onClick={this.SignInCheck}>
                          Next
                          </Button>
                        

                      </CardFooter>
                    </form>
                  </Card>
                </GridItem>
              </GridContainer>
            </div>
          ) : (
              <div className={classes.container} >
                <GridContainer justify="flex-end" alignItems="center" spacing={16} style={{marginTop:'100px'}} >
                  <GridItem xs={5}>
                  <Fab onClick={()=>this.changeActor('teacher')}  style={{ width: '200px', height: '200px' }}>
                      <img src={profile}  style={{ borderRadius: '100%',width:'200px'}} />
                      
                      </Fab>
                    <div style={{width:'200px',textAlign:'center',marginTop:'20px'}}>
                    Teacher
                      
                    </div>

                  </GridItem>
                  <GridItem xs={5}>
                  <Fab onClick={()=>this.changeActor("student")}  style={{ width: '200px', height: '200px' }}>
                      <img src={profile}  style={{ borderRadius: '100%',width:'200px'}} />
                      
                      </Fab>
                    <div style={{width:'200px',textAlign:'center',marginTop:'20px'}}>
                    Students
                      
                    </div>
                    
                  </GridItem>
                </GridContainer>
              </div>




            )}

        </div>
      </div>
    );
  }
}


export default withStyles(loginPageStyle)(LoginMainPage);
