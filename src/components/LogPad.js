import React from "react";

import Block from "./Block";
import EntryBox from "./EntryBox";
import Header from "./Header";
import InfoBar from "./InfoBar";
import DownloadIcon from "../icons/Download";

import moment from "moment";
import c from "classnames";
import styled from "styled-components";

import firebase from "../firebase";

export class LogPad extends React.Component {
  state = { newEntries: [], selectedTag: null };

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
  toggleTagFilter = tag => {
    this.setState({ selectedTag: this.state.selectedTag === tag ? null : tag });
  };
  handleEdit = id => {
    const entry = this.state.newEntries.find(entry => entry.id === id);
    const newContents = prompt("Editing:", entry.contents);

    if (!newContents) return;

    const newEntry = { ...entry, contents: newContents };
    this.setState(
      {
        newEntries: this.state.newEntries.map(
          entry => (entry.id === id ? newEntry : entry)
        )
      },
      this.synchronize
    );
  };
  handleInsertBefore = id => {
    const entryIndex = this.state.newEntries.findIndex(
      entry => entry.id === id
    );
    const headerContents = prompt("Header name:");
    const currentTime = moment();
    const headerBlock = {
      type: "header",
      contents: headerContents,
      timestamp: currentTime,
      id: this.hashCode(currentTime.valueOf() + headerContents)
    };
    let newArray = [...this.state.newEntries];
    newArray.splice(entryIndex, 0, headerBlock);
    console.log(newArray);
    this.setState(
      {
        newEntries: newArray
      },
      this.synchronize
    );
  };
  getPage = () => {
    return (
      firebase.auth().currentUser.uid +
      "/" +
      (this.props.match.params.page || "Default")
    );
  };
  handleDelete = id => {
    console.log(id);
    this.setState(
      {
        newEntries: this.state.newEntries.filter(entry => entry.id !== id)
      },
      this.synchronize
    );
  };
  handleNewEntry = contents => {
    const currentTime = moment();
    this.setState(
      {
        newEntries: [
          ...this.state.newEntries,
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
  isBigTimeJump(prev, curr) {
    if (prev === null) {
      return curr.format("ddd, MMM Do");
    }
    if (prev.isSame(curr, "day")) return null;

    const formatted = curr.format("ddd, MMM Do");
    const diffHours = curr.diff(prev, "hours");
    if (diffHours < 16) return formatted;
    else if (diffHours < 48) return `${formatted} / + ${diffHours} hours`;
    else return `${formatted} / + ${curr.diff(prev, "days")} days`;
  }
  serializedEntries() {
    return JSON.stringify(
      this.state.newEntries.map(e => ({
        ...e,
        timestamp: e.timestamp.toJSON()
      }))
    );
  }

  synchronize() {
    firebase
      .database()
      .ref("logs/" + this.getPage())
      .set(this.serializedEntries());

    // if (localStorage) {
    //   localStorage.setItem(
    //     "memopad_logentriesv01" + this.props.page,
    //     this.serializedEntries()
    //   );
    // }
  }
  migrateData(data) {
    return data.map(d => {
      if (!d.type || d.type === "block") {
        d.type = "entry";
      }
      return d;
    });
  }
  componentDidMount() {
    const logsRef = firebase.database().ref("logs/" + this.getPage());
    logsRef.on("value", snapshot => {
      this.setState({
        newEntries: (JSON.parse(snapshot.val()) || []).map(e => ({
          ...e,
          timestamp: moment(e.timestamp)
        }))
      });
    });

    // if (localStorage) {
    //   const storedData = localStorage.getItem(
    //     "memopad_logentriesv01" + this.props.page
    //   );
    //   if (storedData) {
    //     const data = this.migrateData(JSON.parse(storedData));
    //     this.setState({
    //       newEntries: data.map(e => ({
    //         ...e,
    //         timestamp: moment(e.timestamp)
    //       }))
    //     });
    //   }
    // }
  }
  hasHashtag = (entry, tag) => {
    return entry.contents.indexOf(tag) >= 0;
  };
  gatherHashTags = entries => {
    let tags = {};
    const regex = /(^|\s)(#\w*[a-zA-Z]\w*)/g;

    entries.filter(e => e.type === "entry").forEach(entry => {
      let matches;
      while ((matches = regex.exec(entry.contents))) {
        const match = matches[2];

        if (tags[match]) {
          tags[match] += 1;
        } else {
          tags[match] = 1;
        }
      }
    });
    return tags;
  };
  render() {
    let nodes = [];

    const hashtags = this.gatherHashTags(this.state.newEntries);
    const tags = Object.keys(hashtags);
    if (tags.length > 0) {
      nodes.push(
        <InfoBar key="tags">
          {tags.map(tag => (
            <span
              key={tag}
              onClick={() => this.toggleTagFilter(tag)}
              className={c("tag", { selected: this.state.selectedTag === tag })}
            >
              {tag}
            </span>
          ))}
        </InfoBar>
      );
    }

    let last = null;
    this.state.newEntries.forEach((entry, i) => {
      if (entry.type === "header") {
        nodes.push(
          <Header
            onDelete={this.handleDelete}
            onEdit={this.handleEdit}
            entry={entry}
            key={entry.id}
            readOnly={this.props.readOnly}
          />
        );
      } else {
        if (
          this.state.selectedTag &&
          !this.hasHashtag(entry, this.state.selectedTag)
        ) {
        } else if (
          last &&
          last.type === "entry" &&
          last.timestamp.format("YYYY-MM-DD hh:mm") ===
            entry.timestamp.format("YYYY-MM-DD hh:mm")
        ) {
          nodes.push(
            <Block
              onInsertBefore={this.handleInsertBefore}
              onDelete={this.handleDelete}
              onEdit={this.handleEdit}
              hideTimestamp
              entry={entry}
              key={entry.id}
              readOnly={this.props.readOnly}
            />
          );
          last = entry;
        } else {
          const timejump = this.isBigTimeJump(
            last && last.timestamp,
            entry.timestamp
          );
          if (timejump) {
            nodes.push(
              <InfoBar key={this.hashCode(timejump)}>{timejump}</InfoBar>
            );
          }
          nodes.push(
            <Block
              onInsertBefore={this.handleInsertBefore}
              onDelete={this.handleDelete}
              onEdit={this.handleEdit}
              entry={entry}
              key={entry.id}
              readOnly={this.props.readOnly}
            />
          );
          last = entry;
        }
      }
    });

    if (this.state.selectedTag) {
      // for any Headers that don't have  children, show them as subdued
      nodes = nodes.map((node, idx, arr) => {
        if (node.type === Header) {
          if (idx + 1 === arr.length || arr[idx + 1].type === Header) {
            console.log("n", node);
            return { ...node, ...{ props: { ...node.props, subdued: true } } };
          } else return node;
        } else return node;
      });
    }

    return (
      <Wrapper>
        {nodes}
        {!this.props.readOnly && (
          <React.Fragment>
            {this.state.selectedTag ? (
              <InfoBar>
                <span
                  className="cursor-pointer"
                  onClick={() => this.setState({ selectedTag: null })}
                >
                  Input hidden because list is filtered. Click here to remove
                  filter.
                </span>
              </InfoBar>
            ) : (
              <React.Fragment>
                <EntryBox onSubmit={this.handleNewEntry} />
                {this.state.newEntries.length > 0 && (
                  <InfoBar>
                    <span
                      className="export cursor-pointer"
                      onClick={() => {
                        require("js-file-download")(
                          this.serializedEntries(),
                          "test.json"
                        );
                      }}
                    >
                      <DownloadIcon size={11} /> Export
                    </span>
                  </InfoBar>
                )}
              </React.Fragment>
            )}
          </React.Fragment>
        )}
      </Wrapper>
    );
  }
}

export default LogPad;

const Wrapper = styled.div`
  .export {
    margin-top: 50px;
    display: inline-block;
  }
  .export svg {
    vertical-align: text-top;
  }

  .tag.selected {
    color: rgb(0, 145, 255);
  }
  .tag {
    margin-right: 10px;
    font-size: 14px;
    cursor: pointer;
  }
`;
