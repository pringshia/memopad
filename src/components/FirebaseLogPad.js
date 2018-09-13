import React from "react";
import { Link } from "react-router-dom";
import LogPad from "./LogPad";
import NewLogPad from "./NewLogPad";
import moment from "moment";
import firebase from "../firebase";
import { serializeEntries, deserializeEntries } from "../utils";

export default class FirebaseLogPad extends React.Component {
  state = { entries: [], selectedTag: null, newPage: null, unauthorized: null };

  componentDidMount() {
    firebase
      .database()
      .ref("pages/" + this.getPagePath())
      .on(
        "value",
        snapshot => {
          const pageDetails = snapshot.val();
          if (!pageDetails) {
            this.setState({ newPage: true });
          } else {
            this.setState({ title: pageDetails.title });
            const logsRef = firebase
              .database()
              .ref("logs/" + this.getPagePath());
            logsRef.on("value", snapshot => {
              this.setState({
                entries: deserializeEntries(snapshot.val()),
                newPage: false
              });
            });
          }
        },
        error => {
          if (error.code === "PERMISSION_DENIED") {
            this.setState({ unauthorized: true });
          }
        }
      );
  }

  synchronize() {
    firebase
      .database()
      .ref("logs/" + this.getPagePath())
      .set(serializeEntries(this.state.entries));
  }

  hashCode = str => {
    var hash = 0,
      i,
      chr;
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
      chr = str.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  };

  handlePageName = name => {
    firebase
      .database()
      .ref("pages/" + this.getPagePath())
      .set({
        title: name ? name : this.getPage(),
        createdAt: moment().format()
      });

    this.setState({ newPage: false });
  };

  getPage = () => this.props.match.params.page || "Default";
  getPagePath = () => {
    return (
      (this.props.userId
        ? this.props.userId + "/"
        : firebase.auth().currentUser.uid + "/") + this.getPage()
    );
  };

  handleNewEntry = contents => {
    const currentTime = moment();
    this.setState(
      {
        entries: [
          ...this.state.entries,
          {
            type: "entry",
            contents,
            timestamp: currentTime,
            id: this.hashCode(currentTime.valueOf() + contents)
          }
        ]
      },
      this.synchronize
    );
  };

  handleDelete = id => {
    this.setState(
      {
        entries: this.state.entries.filter(entry => entry.id !== id)
      },
      this.synchronize
    );
  };

  handleInsertBefore = id => {
    const entryIndex = this.state.entries.findIndex(entry => entry.id === id);
    const headerContents = prompt("Header name:");
    if (!headerContents) return;
    const currentTime = moment();
    const headerBlock = {
      type: "header",
      contents: headerContents,
      timestamp: currentTime,
      id: this.hashCode(currentTime.valueOf() + headerContents)
    };
    let newArray = [...this.state.entries];
    newArray.splice(entryIndex, 0, headerBlock);
    this.setState(
      {
        entries: newArray
      },
      this.synchronize
    );
  };

  handleEdit = id => {
    const entry = this.state.entries.find(entry => entry.id === id);
    const newContents = prompt("Editing:", entry.contents);

    if (!newContents) return;

    const newEntry = { ...entry, contents: newContents };
    this.setState(
      {
        entries: this.state.entries.map(
          entry => (entry.id === id ? newEntry : entry)
        )
      },
      this.synchronize
    );
  };

  handleImport = data => {
    this.setState(
      {
        entries: deserializeEntries(data)
      },
      this.synchronize
    );
  };

  render() {
    return (
      <React.Fragment>
        <h1 className="title dosis text-4xl uppercase">
          <Link to="/">Memopad</Link>{" "}
          {this.state.title && (
            <span className="subtitle">/ {this.state.title}</span>
          )}
        </h1>
        {this.state.unauthorized === true ? (
          <h3 style={{ marginLeft: 75 }}>
            You do not have permissions to view this page.
          </h3>
        ) : (
          <div>
            {this.state.newPage === null ? null : this.state.newPage ===
            true ? (
              <NewLogPad
                {...this.props}
                defaultPageName={this.getPage()}
                onPageName={this.handlePageName}
              />
            ) : (
              <LogPad
                readOnly={this.props.readOnly}
                title={this.state.title}
                entries={this.state.entries}
                onInsertBefore={this.handleInsertBefore}
                onDelete={this.handleDelete}
                onEdit={this.handleEdit}
                onNewEntry={this.handleNewEntry}
                onImport={this.handleImport}
              />
            )}
          </div>
        )}
      </React.Fragment>
    );
  }
}
