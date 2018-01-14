import Block from "~/components/Block";
import EntryBox from "~/components/EntryBox";
import Header from "~/components/Header";
import InfoBar from "~/components/InfoBar";

import moment from "moment";

export class LogPad extends React.Component {
  constructor(props) {
    super(props);
  }
  state = { newEntries: [] };
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
  synchronize() {
    if (localStorage) {
      localStorage.setItem(
        "memopad_logentriesv01" + this.props.page,
        JSON.stringify(
          this.state.newEntries.map(e => ({
            ...e,
            timestamp: e.timestamp.toJSON()
          }))
        )
      );
    }
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
    if (localStorage) {
      const storedData = localStorage.getItem(
        "memopad_logentriesv01" + this.props.page
      );
      if (storedData) {
        const data = this.migrateData(JSON.parse(storedData));
        this.setState({
          newEntries: data.map(e => ({
            ...e,
            timestamp: moment(e.timestamp)
          }))
        });
      }
    }
  }
  gatherHashTags = entries => {
    let tags = {};
    const regex = /(^|\s)([#@][a-z\d-]+)/g;

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
    console.log(this.gatherHashTags(this.state.newEntries));
    let last = null,
      nodes = [];
    this.state.newEntries.forEach((entry, i) => {
      if (entry.type === "header") {
        nodes.push(
          <Header
            onDelete={this.handleDelete}
            onEdit={this.handleEdit}
            entry={entry}
            key={entry.id}
          />
        );
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
          />
        );
        last = entry;
      }
    });
    return (
      <React.Fragment>
        {nodes}
        <EntryBox onSubmit={this.handleNewEntry} />
      </React.Fragment>
    );
  }
}

export default LogPad;
