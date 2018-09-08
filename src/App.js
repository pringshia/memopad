import React, { Component } from "react";
import LogPad from "./components/LogPad";
import LogList from "./components/LogList";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect
} from "react-router-dom";
import firebase from "./firebase";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import moment from "moment";

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
      <Router>
        <div className="pl-2 pr-2 sm:p-8 sm:pt-16 pt-16">
          {this.state.isSignedIn === null ? null : !this.state.isSignedIn ? (
            <Switch>
              <Route exact path="/">
                <React.Fragment>
                  <h1 className="title dosis text-4xl uppercase">
                    <Link to="/">Memopad</Link>
                  </h1>

                  <h3
                    style={{
                      margin: "10px 20px 40px 75px",
                      fontSize: 45,
                      fontWeight: "normal",
                      fontStyle: "italic",
                      lineHeight: 1.2,
                      color: "#999"
                    }}
                  >
                    Jotting down your stream-of-consciousness
                    <br />
                    made easy.
                  </h3>
                  <StyledFirebaseAuth
                    uiConfig={this.uiConfig}
                    firebaseAuth={firebase.auth()}
                  />
                </React.Fragment>
              </Route>
              <Route
                exact
                path="/public/:page"
                render={props => (
                  <LogPad
                    userId="SqDB1Fv1fMNAhza2ksTQJglKC6v2"
                    readOnly
                    {...props}
                  />
                )}
              />
              <Route
                exact
                path="/:userId/:page"
                render={props => (
                  <LogPad
                    userId={props.match.params.userId}
                    readOnly
                    {...props}
                  />
                )}
              />
              <Route render={() => <Redirect to="/" />} />
            </Switch>
          ) : (
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
                  path="/public/:page"
                  render={props => (
                    <LogPad
                      userId="SqDB1Fv1fMNAhza2ksTQJglKC6v2"
                      readOnly
                      {...props}
                    />
                  )}
                />
                <Route
                  exact
                  path="/:userId/:page"
                  render={props => (
                    <LogPad
                      userId={props.match.params.userId}
                      readOnly
                      {...props}
                    />
                  )}
                />
                <Route
                  exact
                  path="/today"
                  render={() => (
                    <Redirect to={"/" + moment().format("YYYY-MM-DD")} />
                  )}
                />
                <Route exact path="/" component={LogList} />
                <Route exact path="/:page" component={LogPad} />
              </Switch>
            </React.Fragment>
          )}
        </div>
      </Router>
    );
  }
}

export default App;
