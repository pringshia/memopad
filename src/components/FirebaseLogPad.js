import React from "react";
import { Link } from "react-router-dom";
import LogPad from "./LogPad";
import NewLogPad from "./NewLogPad";
import moment from "moment";
import firebase from "../firebase";
import {
  serializeEntries,
  deserializeEntries,
  convertTimestamps
} from "../utils";
import { withState, States, State } from "machinate";

class FirebaseLogPad extends React.Component {
  state = { entries: [], selectedTag: null, newPage: null, unauthorized: null };

  componentWillUnmount() {
    if (this.firebaseLoadRef) {
      this.firebaseLoadRef.off();
    }
  }

  componentDidMount() {
    const { external, transition } = this.props;

    external("load sheet metadata", () => {
      this.firebaseLoadRef = firebase
        .database()
        .ref("pages/" + this.getPagePath());
      this.firebaseLoadRef.on(
        "value",
        snapshot => {
          const pageDetails = snapshot.val();
          if (!pageDetails) {
            transition("Sheet.New");
            ////
            // this.setState({ newPage: true });
          } else {
            // transition("Sheet.Loaded", { title: pageDetails.title });
            ////
            // this.setState({ title: pageDetails.title });

            external("load sheet contents", () => {
              firebase
                .database()
                .ref("logs/" + this.getPagePath())
                .on("value", snapshot => {
                  transition("Sheet.Loaded", {
                    title: pageDetails.title,
                    entries: deserializeEntries(snapshot.val())
                  });
                  ////
                  // this.setState({
                  //   entries: convertTimestamps(
                  //     deserializeEntries(snapshot.val())
                  //   ),
                  //   newPage: false
                  // });
                });
            });
          }
        },
        error => {
          if (error.code === "PERMISSION_DENIED") {
            transition("Sheet.Unauthorized");
            ////
            // this.setState({ unauthorized: true });
          }
        }
      );
    });
  }

  synchronize() {
    const { external, query } = this.props;

    external("synchronize", () =>
      firebase
        .database()
        .ref("logs/" + this.getPagePath())
        .set(serializeEntries(query("Sheet.Loaded").entries))
    );
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
    const { external, transition } = this.props;

    external("create new page", () =>
      firebase
        .database()
        .ref("pages/" + this.getPagePath())
        .set({
          title: name ? name : this.getPage(),
          createdAt: moment().format()
        })
    );

    transition("Sheet.Loaded", {
      title: name ? name : this.getPage(),
      entries: []
    });

    ////
    // this.setState({ newPage: false });
  };

  getPage = () => this.props.params.page || "Default";
  getPagePath = () => {
    return (
      (this.props.userId
        ? this.props.userId + "/"
        : firebase.auth().currentUser.uid + "/") + this.getPage()
    );
  };

  handleNewEntry = contents => {
    const currentTime = moment();

    const { update } = this.props;

    update("Sheet.Loaded", data => ({
      ...data,
      entries: [
        ...data.entries,
        {
          type: "entry",
          contents,
          timestamp: currentTime.toJSON(),
          id: this.hashCode(currentTime.valueOf() + contents)
        }
      ]
    }));
    this.synchronize();

    ////
    // this.setState(
    //   {
    //     entries: [
    //       ...this.state.entries,
    //       {
    //         type: "entry",
    //         contents,
    //         timestamp: currentTime,
    //         id: this.hashCode(currentTime.valueOf() + contents)
    //       }
    //     ]
    //   },
    //   this.synchronize
    // );
  };

  handleDelete = id => {
    const { update } = this.props;

    update("Sheet.Loaded", data => ({
      ...data,
      entries: data.entries.filter(entry => entry.id !== id)
    }));
    this.synchronize();

    ////
    // this.setState(
    //   {
    //     entries: this.state.entries.filter(entry => entry.id !== id)
    //   },
    //   this.synchronize
    // );
  };

  handleInsertBefore = id => {
    const { update, query } = this.props;

    const entryIndex = query("Sheet.Loaded").entries.findIndex(
      entry => entry.id === id
    );
    const headerContents = prompt("Header name:");
    if (!headerContents) return;
    const currentTime = moment();
    const headerBlock = {
      type: "header",
      contents: headerContents,
      timestamp: currentTime.toJSON(),
      id: this.hashCode(currentTime.valueOf() + headerContents)
    };

    update("Sheet.Loaded", data => {
      let newArray = [...data.entries];
      newArray.splice(entryIndex, 0, headerBlock);

      return { ...data, entries: newArray };
    });
    this.synchronize();

    ////
    // let newArray = [...data.entries];
    // newArray.splice(entryIndex, 0, headerBlock);

    // this.setState(
    //   {
    //     entries: newArray
    //   },
    //   this.synchronize
    // );
  };

  handleEdit = id => {
    const { update, query } = this.props;

    const entry = query("Sheet.Loaded").entries.find(entry => entry.id === id);
    const newContents = prompt("Editing:", entry.contents);

    if (!newContents) return;

    const newEntry = { ...entry, contents: newContents };

    update("Sheet.Loaded", data => ({
      ...data,
      entries: data.entries.map(entry => (entry.id === id ? newEntry : entry))
    }));
    this.synchronize();

    ////
    // this.setState(
    //   {
    //     entries: this.state.entries.map(
    //       entry => (entry.id === id ? newEntry : entry)
    //     )
    //   },
    //   this.synchronize
    // );
  };

  handleImport = data => {
    const { update } = this.props;

    update("Sheet.Loaded", prevData => ({
      ...prevData,
      entries: deserializeEntries(data)
    }));
    this.synchronize();

    ////
    // this.setState(
    //   {
    //     entries: convertTimestamps(deserializeEntries(data))
    //   },
    //   this.synchronize
    // );
  };

  render() {
    return (
      <React.Fragment>
        <h1 className="title dosis text-4xl uppercase">
          <Link to="/">Memopad</Link>{" "}
          <State of="Sheet.Loaded">
            {({ data: { title } }) => (
              <span className="subtitle">/ {title}</span>
            )}
          </State>
        </h1>
        <States
          of="Sheet"
          Unknown={() => <div className="spinner" />}
          Unauthorized={() => (
            <h3 style={{ marginLeft: 75 }}>
              You do not have permissions to view this page.
            </h3>
          )}
          New={() => (
            <NewLogPad
              {...this.props}
              defaultPageName={this.getPage()}
              onPageName={this.handlePageName}
            />
          )}
          Loaded={({ data }) => {
            // console.log("here");
            return (
              <LogPad
                readOnly={this.props.readOnly}
                title={data.title}
                entries={convertTimestamps(data.entries)}
                onInsertBefore={this.handleInsertBefore}
                onDelete={this.handleDelete}
                onEdit={this.handleEdit}
                onNewEntry={this.handleNewEntry}
                onImport={this.handleImport}
              />
            );
          }}
        />
      </React.Fragment>
    );
  }
}

export default withState("Display.Sheet", FirebaseLogPad);
