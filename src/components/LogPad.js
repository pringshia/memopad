import React from "react";

import Block from "./Block";
import EntryBox from "./EntryBox";
import Header from "./Header";
import InfoBar from "./InfoBar";
import DownloadIcon from "../icons/Download";

import c from "classnames";
import styled from "styled-components";
import { serializeEntries } from "../utils";

export class LogPad extends React.Component {
  state = { selectedTag: null };

  toggleTagFilter = tag => {
    this.setState({ selectedTag: this.state.selectedTag === tag ? null : tag });
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

  migrateData(data) {
    return data.map(d => {
      if (!d.type || d.type === "block") {
        d.type = "entry";
      }
      return d;
    });
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

  handleImport = event => {
    const fileData = new FileReader();
    fileData.onloadend = e => this.props.onImport(e.target.result);
    fileData.readAsText(event.target.files[0]);
  };

  render() {
    let nodes = [];

    const hashtags = this.gatherHashTags(this.props.entries);
    const tags = Object.keys(hashtags);
    if (tags.length > 0) {
      nodes.push(
        <InfoBar key="tags" className="tags-bar">
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
    this.props.entries.forEach((entry, i) => {
      if (entry.type === "header") {
        nodes.push(
          <Header
            onDelete={this.props.onDelete}
            onEdit={this.props.onEdit}
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
              onInsertBefore={this.props.onInsertBefore}
              onDelete={this.props.onDelete}
              onEdit={this.props.onEdit}
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
            nodes.push(<InfoBar noDivider={true} key={timejump}>{timejump}</InfoBar>);
          }
          nodes.push(
            <Block
              onInsertBefore={this.props.onInsertBefore}
              onDelete={this.props.onDelete}
              onEdit={this.props.onEdit}
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
            return { ...node, ...{ props: { ...node.props, subdued: true } } };
          } else return node;
        } else return node;
      });
    }

    return (
      <React.Fragment>
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
                  <EntryBox
                    placeholder="Type something here..."
                    onSubmit={this.props.onNewEntry}
                  />
                  {this.props.entries.length > 0 && (
                    <InfoBar>
                      <span
                        className="export cursor-pointer"
                        onClick={() => {
                          require("js-file-download")(
                            serializeEntries(this.props.entries),
                            (this.props.title || "download") + ".json"
                          );
                        }}
                      >
                        <DownloadIcon size={11} /> Export
                      </span>
                      <label htmlFor="import-data">
                        <span className="export cursor-pointer">
                          <DownloadIcon size={11} /> Import
                        </span>
                      </label>
                      <input
                        type="file"
                        name="import-data"
                        id="import-data"
                        style={{
                          opacity: 0,
                          position: "absolute",
                          zIndex: -1
                        }}
                        onChange={this.handleImport}
                      />
                    </InfoBar>
                  )}
                </React.Fragment>
              )}
            </React.Fragment>
          )}
        </Wrapper>
      </React.Fragment>
    );
  }
}

export default LogPad;

const Wrapper = styled.div`
  .export {
    margin-top: 50px;
    margin-right: 20px;
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
