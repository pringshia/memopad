import React, { Component } from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { Link } from "react-router-dom";
import firebase from "../firebase";
import styled from "styled-components";

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
  state = { email: "" };
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
              Have a log-in link sent to your email:
            </div>
            <form
              onSubmit={e => {
                alert(this.state.email);
                e.preventDefault();
              }}
            >
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
