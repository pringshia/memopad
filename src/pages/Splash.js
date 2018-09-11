import React, { Component } from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { Link } from "react-router-dom";
import firebase from "../firebase";

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
    );
  }
}

export default Splash;
