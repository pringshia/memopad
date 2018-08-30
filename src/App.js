import React, { Component } from "react";
import LogPad from "./components/LogPad";
import { BrowserRouter as Router, Route } from "react-router-dom";
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
          <React.Fragment>
            <a
              className="dosis text-xs uppercase cursor-pointer logout"
              onClick={() => firebase.auth().signOut()}
            >
              Log out
            </a>
            <Router>
              <Route path="/:page?" component={LogPad} />
            </Router>
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default App;
