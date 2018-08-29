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
    if (this.state.isSignedIn === null) {
      return null;
    }
    if (!this.state.isSignedIn) {
      return (
        <StyledFirebaseAuth
          uiConfig={this.uiConfig}
          firebaseAuth={firebase.auth()}
        />
      );
    }
    return (
      <div className="p-8 pt-16">
        <h1 className="title dosis text-4xl uppercase">Memopad</h1>
        <a
          className="dosis text-xs uppercase cursor-pointer logout"
          onClick={() => firebase.auth().signOut()}
        >
          Log out
        </a>
        <Router>
          <Route path="/:page?" component={LogPad} />
        </Router>
      </div>
    );
  }
}

export default App;
