import React from "react";
import styled from "styled-components";
import firebase from "../firebase";
import { Link } from "react-router-dom";
import moment from "moment";
import { getRootUrl } from "../utils";

class LogList extends React.Component {
  state = { notes: {}, loaded: false };

  componentDidMount() {
    const logsRef = firebase
      .database()
      .ref("pages/" + firebase.auth().currentUser.uid);
    logsRef.on("value", snapshot => {
      this.setState({
        notes: snapshot.val() || {},
        loaded: true
      });
    });
  }

  handleDelete = id => () => {
    if (
      window.confirm(
        `Are you sure you'd like to delete the note named '${id}'?`
      )
    ) {
      firebase
        .database()
        .ref("pages/" + firebase.auth().currentUser.uid + "/" + id)
        .remove();
      firebase
        .database()
        .ref("logs/" + firebase.auth().currentUser.uid + "/" + id)
        .remove();
    }
  };

  handlePublic = id => () => {
    firebase
      .database()
      .ref("pages/" + firebase.auth().currentUser.uid + "/" + id + "/isPublic")
      .set(true);
  };

  handlePrivate = id => () => {
    firebase
      .database()
      .ref("pages/" + firebase.auth().currentUser.uid + "/" + id + "/isPublic")
      .set(false);
  };

  handleRename = id => () => {
    const newTitle = prompt("What would you like to rename the sheet to?");
    if (!newTitle) return;
    firebase
      .database()
      .ref("pages/" + firebase.auth().currentUser.uid + "/" + id + "/title")
      .set(newTitle);
  };

  render() {
    return (
      <React.Fragment>
        <h1 className="title dosis text-4xl uppercase">
          <Link to="/">Memopad</Link>
        </h1>
        <Wrapper>
          {this.state.loaded &&
            Object.entries(this.state.notes).length === 0 && (
              <div>
                <p>You do not have any notes yet.</p>
                <p>
                  Create one by visiting any URL, e.g. type in{" "}
                  <code>
                    <Link to={"/TodaysNotes"}>
                      {getRootUrl()}
                      /TodaysNotes
                    </Link>
                  </code>
                  in the address bar.
                </p>
              </div>
            )}
          {Object.entries(this.state.notes)
            .sort(
              ([_, a], [__, b]) => moment(b.createdAt) - moment(a.createdAt)
            )
            .map(([id, details]) => (
              <ListItem key={id}>
                <span className="note-name">
                  <Link to={"/" + id}>{details.title}</Link>
                </span>
                <span className="note-controls">
                  <button
                    className="dosis danger"
                    onClick={this.handleDelete(id)}
                  >
                    Delete
                  </button>
                  <button
                    className="dosis secondary"
                    onClick={this.handleRename(id)}
                  >
                    Rename
                  </button>

                  {details.isPublic ? (
                    <React.Fragment>
                      <button
                        className="dosis primary"
                        onClick={this.handlePrivate(id)}
                      >
                        Make private
                      </button>
                      <Link
                        className="dosis permalink"
                        to={"/" + firebase.auth().currentUser.uid + "/" + id}
                      >
                        Permalink
                      </Link>
                    </React.Fragment>
                  ) : (
                    <button
                      className="dosis secondary"
                      onClick={this.handlePublic(id)}
                    >
                      Make public
                    </button>
                  )}
                </span>
              </ListItem>
            ))}
        </Wrapper>
      </React.Fragment>
    );
  }
}

export default LogList;

const Wrapper = styled.div`
  padding: 0 75px;
`;

const ListItem = styled.div`
  margin: 0 0 10px 0;
  padding: 1px 5px;

  a {
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }

  &:hover {
    background-color: #f8f8f8;

    .note-controls {
      display: inline-block;
    }
  }

  .note-name {
    width: 400px;
    display: inline-block;
  }

  .note-controls {
    // display: none;
  }

  button {
    margin: 0 10px;
    font-size: 14px;
  }

  .permalink {
    font-size: 11px;
    color: #333;
    text-transform: uppercase;
    border-bottom: 1px solid black;

    &:hover {
      text-decoration: none;
    }
  }

  button.danger {
    color: crimson;
  }

  button.primary {
    color: #0091ff;
  }

  button.secondary {
    color: #999;
  }
`;
