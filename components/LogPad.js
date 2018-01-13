import Block from "~/components/Block";
import EntryBox from "~/components/EntryBox";

import moment from "moment";

export class LogPad extends React.Component {
  constructor(props) {
    super(props);
  }
  state = { newEntries: [] };
  handleNewEntry = contents => {
    this.setState({
      newEntries: [
        ...this.state.newEntries,
        {
          contents,
          timestamp: moment().format("h:mm A")
        }
      ]
    });
  };
  render() {
    return (
      <React.Fragment>
        {this.state.newEntries.map((entry, idx) => (
          <Block timestamp={entry.timestamp} content={entry.contents} key={idx}>
            {/* {entry.contents} */}
          </Block>
        ))}
        <EntryBox onSubmit={this.handleNewEntry} />
      </React.Fragment>
    );
  }
}

export default LogPad;
