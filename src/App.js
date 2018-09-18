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
import { Machinate, Transition, withMachine, States } from "machinate";
import { Inspector } from "machinate-plugins-inspector";

const scheme = {
  Auth: ["SignedIn", "SignedOut", "Unknown"],
  Display: {
    states: ["List", "Sheet", "Unknown"],
    deps: { "Auth.SignedIn": "Unknown" }
  },
  List: { states: ["Loaded", "Unknown"], deps: { "Display.List": "Unknown" } },
  Sheet: {
    states: ["Loaded", "New", "Unauthorized", "Unknown"],
    deps: { "Display.Sheet": "Unknown" }
  }
};

const AuthDetection = withMachine(
  class extends Component {
    componentDidMount() {
      const { transition, external } = this.props;
      external("firebase auth detection", () => {
        this.unregisterAuthObserver = firebase
          .auth()
          .onAuthStateChanged(user => {
            !!user ? transition("Auth.SignedIn") : transition("Auth.SignedOut");
          });
      });
      // .onAuthStateChanged(user => this.setState({ isSignedIn: !!user }));
    }
    componentWillUnmount() {
      if (this.unregisterAuthObserver) {
        this.unregisterAuthObserver();
      }
    }
    render() {
      return null;
    }
  }
);

class App extends Component {
  render() {
    const { Transition, External, lastForceTime } = this.props;

    return (
      <Router>
        <div className="pl-2 pr-2 sm:p-8 sm:pt-16 pt-16">
          <Inspector />

          <States
            of="Auth"
            SignedIn={() => (
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
                  <Route
                    exact
                    path="/"
                    render={props => (
                      <External name="router-change">
                        <Transition to="Display.List" />
                      </External>
                    )}
                  />
                  <Route
                    exact
                    path="/writings_app_auth_endpoint"
                    render={() => <Redirect to="/" />}
                  />

                  <Route
                    exact
                    path="/:page"
                    render={props => (
                      <External name="router-change">
                        <Transition
                          to="Display.Sheet"
                          data={props.match.params}
                        />
                      </External>
                    )}
                  />
                </Switch>
                <States
                  of="Display"
                  Unknown={() => <div className="spinner" />}
                  Sheet={({ data }) => <FirebaseLogPad params={data} />}
                  List={({ data }) => <LogList params={data} />}
                />
              </React.Fragment>
            )}
            SignedOut={() => (
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
            )}
            Unknown={() => (
              <React.Fragment>
                <External
                  name="detect firebase auth"
                  fallback={<div className="spinner" />}
                >
                  <AuthDetection />
                  <div className="spinner" />
                </External>
              </React.Fragment>
            )}
          />
        </div>
      </Router>
    );
  }
}

const WiredApp = withMachine(App);

export default () => (
  <Machinate
    scheme={scheme}
    initial={{ Auth: "Unknown" }}
    ref={mach => (window.machine = mach)}
  >
    {/* {React.createElement(withMachine(App), null, null)} */}
    <WiredApp />
  </Machinate>
);
