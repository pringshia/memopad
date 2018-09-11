import React, { Component } from "react";
import FirebaseLogPad from "./components/FirebaseLogPad";
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
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ marginTop: 20 }}>
                      <StyledFirebaseAuth
                        uiConfig={this.uiConfig}
                        firebaseAuth={firebase.auth()}
                      />
                    </div>
                    <div
                      style={{
                        fontStyle: "italic",
                        width: 70,
                        textAlign: "center",
                        color: "#888",
                        marginTop: 20
                      }}
                    >
                      &mdash; or &mdash;
                    </div>

                    <div style={{ marginLeft: 24 }}>
                      <div style={{ fontSize: 15 }}>
                        Have a log-in link sent to your email:
                      </div>
                      <input
                        style={{
                          fontSize: 16,
                          border: "1px solid #999",
                          padding: "10px 14px",
                          borderRadius: 4
                        }}
                      />
                      <button
                        style={{
                          border: "1px solid #0079ff",
                          backgroundColor: "#f3fbff",
                          color: "#0079ff",
                          borderRadius: 4,
                          fontFamily: "Roboto,Helvetica,Arial,sans-serif",
                          fontWeight: 500,
                          fontSize: 14,
                          padding: 11,
                          marginLeft: 10
                        }}
                      >
                        Send Email
                      </button>
                    </div>
                  </div>
                </React.Fragment>
              </Route>
              <Route
                exact
                path="/public/:page"
                render={props => (
                  <FirebaseLogPad
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
                  <FirebaseLogPad
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
                    <FirebaseLogPad
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
                    <FirebaseLogPad
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
                <Route exact path="/:page" component={FirebaseLogPad} />
              </Switch>
            </React.Fragment>
          )}
        </div>
      </Router>
    );
  }
}

export default App;
