import React, { Component } from "react";
import FirebaseLogPad from "./components/FirebaseLogPad";
import LogList from "./components/LogList";
import EmailAuth from "./components/EmailAuth";
import Splash from "./pages/Splash";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect
} from "react-router-dom";
import firebase from "./firebase";
import moment from "moment";

class App extends Component {
  state = { isSignedIn: null };

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
              <Route
                exact
                path="/writings_app_auth_endpoint"
                component={EmailAuth}
              />
              <Route exact path="/" component={Splash} />
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
                <Route
                  exact
                  path="/writings_app_auth_endpoint"
                  render={() => <Redirect to="/" />}
                />

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
