import React, { Component } from "react";
import LogPad from "./components/LogPad";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import firebase from "./firebase";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

class App extends Component {
  state = { isSignedIn: null };
  uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: "popup",
    signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
    callbacks: {
      // Avoid redirects after sign-in.
      signInSuccessWithAuthResult: () => false
    }
  };

  componentDidMount() {
    this.registerAuthObserver = firebase
      .auth()
      .onAuthStateChanged(user => this.setState({ isSignedIn: !!user }));
  }
  render() {
    return (
      <div className="pl-2 pr-2 sm:p-8 sm:pt-16 pt-16">
        <h1 className="title dosis text-4xl uppercase">Memopad</h1>
        {this.state.isSignedIn === null ? null : !this.state.isSignedIn ? (
          <StyledFirebaseAuth
            uiConfig={this.uiConfig}
            firebaseAuth={firebase.auth()}
          />
        ) : (
          <Router>
            <React.Fragment>
              <div className="dosis text-xs uppercase navbar">
                <Link to="/" className="logo">
                  M
                </Link>
                <a
                  className="cursor-pointer"
                  onClick={() => firebase.auth().signOut()}
                >
                  Log out
                </a>
              </div>
              <Switch>
                <Route
                  exact
                  path="/public/:page?"
                  render={props => <LogPad public readOnly {...props} />}
                />
                <Route exact path="/:page?" component={LogPad} />
              </Switch>
            </React.Fragment>
          </Router>
        )}
      </div>
    );
  }
}

export default App;
