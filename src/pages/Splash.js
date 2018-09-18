import React, { Component } from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { Link } from "react-router-dom";
import firebase from "../firebase";
import styled from "styled-components";
import { getRootUrl } from "../utils";
import ErrorBoundary from "../components/ErrorBoundary";
import { withMachine } from "machinate";

import "../firebase-ui.css";

class Splash extends Component {
  uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: "popup",
    signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
    callbacks: {
      // Avoid redirects after sign-in.
      signInSuccessWithAuthResult: () => false
    }
  };

  actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be whitelisted in the Firebase Console.
    url: getRootUrl() + "/writings_app_auth_endpoint",
    // This must be true.
    handleCodeInApp: true
    // iOS: {
    //   bundleId: "com.example.ios"
    // },
    // android: {
    //   packageName: "com.example.android",
    //   installApp: true,
    //   minimumVersion: "12"
    // }
  };

  state = { email: "" };

  handleSubmit = e => {
    const email = this.state.email;
    firebase
      .auth()
      .sendSignInLinkToEmail(email, this.actionCodeSettings)
      .then(function() {
        // The link was successfully sent. Inform the user.
        // Save the email locally so you don't need to ask the user for it again
        // if they open the link on the same device.
        window.localStorage.setItem("emailForSignIn", email);
        alert("Email sent!");
      })
      .catch(function(error) {
        console.error(error);
        // Some error occurred, you can inspect the code: error.code
      });

    e.preventDefault();
  };

  // componentWillUnmount() {
  //   this.unregisterAuthObserver();
  // }

  render() {
    const { External } = this.props;
    return (
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
        <AuthWrapper>
          <div style={{ marginTop: 20 }}>
            <ErrorBoundary>
              <External
                name="firebase auth"
                fallback={<FallbackFirebaseAuthButton />}
              >
                <StyledFirebaseAuth
                  uiConfig={this.uiConfig}
                  firebaseAuth={firebase.auth()}
                />
              </External>
            </ErrorBoundary>
          </div>
          <div className="or-separator">&mdash; or &mdash;</div>

          <div style={{ marginLeft: 24 }}>
            <div style={{ fontSize: 15 }}>
              Have an instant login link sent to your email:
            </div>
            <form onSubmit={this.handleSubmit}>
              <input
                style={{
                  fontSize: 16,
                  border: "1px solid #999",
                  padding: "10px 14px",
                  borderRadius: 4
                }}
                value={this.state.email}
                onChange={e => this.setState({ email: e.target.value })}
              />
              <button type="submit" className="send-email">
                Send Email
              </button>
            </form>
          </div>
        </AuthWrapper>
      </React.Fragment>
    );
  }
}

export default withMachine(Splash);

const AuthWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 50px;

  @media (max-width: 768px) {
    & {
      flex-direction: column;
      align-items: flex-start;
    }

    div.or-separator {
      margin: 0px 0px 10px 24px;
      width: 175px;
      text-align: center;
    }
  }

  .or-separator {
    font-style: italic;
    width: 70px;
    text-align: center;
    color: #888;
    margin-top: 20px;
  }

  .send-email {
    border: 1px solid #0079ff;
    background-color: #f3fbff;
    color: #0079ff;
    border-radius: 4px;
    font-family: Roboto, Helvetica, Arial, sans-serif;
    font-weight: 500;
    font-size: 14px;
    padding: 11px;
    margin-left: 10px;
  }
`;

const FallbackFirebaseAuthButton = () => (
  <div id="firebaseui_container" lang="en">
    <div className="firebaseui-container firebaseui-page-provider-sign-in firebaseui-id-page-provider-sign-in firebaseui-use-spinner">
      <div className="firebaseui-card-content">
        <form onsubmit="return false;">
          <ul className="firebaseui-idp-list">
            <li className="firebaseui-list-item">
              <button
                className="firebaseui-idp-button mdl-button mdl-js-button mdl-button--raised firebaseui-idp-google firebaseui-id-idp-button"
                data-provider-id="google.com"
                data-upgraded=",MaterialButton"
              >
                <span className="firebaseui-idp-icon-wrapper">
                  <img
                    className="firebaseui-idp-icon"
                    alt=""
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  />
                </span>
                <span className="firebaseui-idp-text firebaseui-idp-text-long">
                  Sign in with Google
                </span>
                <span className="firebaseui-idp-text firebaseui-idp-text-short">
                  Google
                </span>
              </button>
            </li>
          </ul>
        </form>
      </div>
      <div className="firebaseui-card-footer firebaseui-provider-sign-in-footer" />
    </div>
  </div>
);
