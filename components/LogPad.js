import Block from "~/components/Block";
import EntryBox from "~/components/EntryBox";

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
    const newContents = prompt("Replace contents", entry.contents);

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
            contents,
            timestamp: currentTime,
            id: this.hashCode(currentTime.valueOf() + contents)
          }
        ]
      },
      this.synchronize
    );
  };
  synchronize() {
    if (localStorage) {
      localStorage.setItem(
        "memopad_logentriesv01",
        JSON.stringify(
          this.state.newEntries.map(e => ({
            ...e,
            timestamp: e.timestamp.toJSON()
          }))
        )
      );
    }
  }
  componentDidMount() {
    if (localStorage) {
      const data = localStorage.getItem("memopad_logentriesv01");
      if (data) {
        this.setState({
          newEntries: JSON.parse(data).map(e => ({
            ...e,
            timestamp: moment(e.timestamp)
          }))
        });
      }
    }
  }
  render() {
    let last = null,
      nodes = [];
    this.state.newEntries.forEach((entry, i) => {
      if (
        last &&
        last.timestamp.format("YYYY-MM-DD hh:mm") ===
          entry.timestamp.format("YYYY-MM-DD hh:mm")
      ) {
        nodes.push(
          <Block
            onDelete={this.handleDelete}
            onEdit={this.handleEdit}
            hideTimestamp
            entry={entry}
            key={entry.id}
          />
        );
      } else {
        nodes.push(
          <Block
            onDelete={this.handleDelete}
            onEdit={this.handleEdit}
            entry={entry}
            key={entry.id}
          />
        );
      }
      last = entry;
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
