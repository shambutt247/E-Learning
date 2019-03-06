import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";

import "assets/scss/material-kit-react.scss?v=1.4.0";

// pages for this product
import Components from "views/Components/Components.jsx";
import LandingPage from "views/LandingPage/LandingPage.jsx";
import ProfilePage from "views/ProfilePage/ProfilePage.jsx";
import LoginMainPage from "views/MainPage/LoginMainPage.jsx";
import LoginPage from "views/LoginPage/LoginPage.jsx";

//Firebase initialization
import Firebase, { FirebaseContext } from "views/Firebase";

var hist = createBrowserHistory();

ReactDOM.render(
  <FirebaseContext.Provider value={new Firebase()}>
  <Router history={hist}>
    <Switch>
      <Route path="/landing-page" component={LandingPage} />
      <Route path="/profile-page" component={ProfilePage} />
      <Route path="/login-page" component={LoginPage} />
      <Route path="/components" component={Components} />
      <Route path="/" component={LoginMainPage} />
    </Switch>
  </Router>
  </FirebaseContext.Provider>,
  document.getElementById("root")
);
