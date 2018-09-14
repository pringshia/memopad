import React, { Component } from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { Link } from "react-router-dom";
import firebase from "../firebase";
import styled from "styled-components";
import { getRootUrl } from "../utils";

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

  render() {
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
            <StyledFirebaseAuth
              uiConfig={this.uiConfig}
              firebaseAuth={firebase.auth()}
            />
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
              <button type="submit" className="send-email btn">
                Send Email
              </button>
            </form>
          </div>
        </AuthWrapper>
      </React.Fragment>
    );
  }
}

export default Splash;

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
    margin-left: 10px;
  }
`;
