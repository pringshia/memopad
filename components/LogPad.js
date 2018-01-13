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
  handleNewEntry = contents => {
    const currentTime = moment();
    this.setState({
      newEntries: [
        ...this.state.newEntries,
        {
          contents,
          timestamp: currentTime,
          id: this.hashCode(currentTime.valueOf() + contents)
        }
      ]
    });
  };
  render() {
    let last = null,
      nodes = [];
    this.state.newEntries.forEach((entry, i) => {
      if (
        last &&
        last.timestamp.format("YYYY-MM-DD hh:mm") ===
          entry.timestamp.format("YYYY-MM-DD hh:mm")
      ) {
        nodes.push(<Block content={entry.contents} key={entry.id} />);
      } else {
        console.log("here", i);
        nodes.push(
          <Block
            timestamp={entry.timestamp.format("h:mm A")}
            content={entry.contents}
            key={entry.id}
          />
        );
      }
      last = entry;
    });
    console.log(nodes);
    return (
      <React.Fragment>
        {nodes}
        <EntryBox onSubmit={this.handleNewEntry} />
      </React.Fragment>
    );
  }
}

export default LogPad;
