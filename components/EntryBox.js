export class EntryBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  handleChange = event => {
    this.setState({ value: event.target.value });
  };
  numberOfLines = () => {
    if (!this.state.value) return 1;
    console.log(this.state.value.match(/\n/g));
    return (this.state.value.match(/\n/g) || []).length + 1;
  };

  render() {
    return (
      <div className="wrapper">
        <style jsx>{`
          .wrapper {
            padding: 0 75px;
          }
          textarea {
            background-color: white;
            border-left: 3px solid #ddd;
            color: #333;
            width: 100%;
            box-sizing: content-box;
            padding: 0px 10px;
            line-height: 30px;
            resize: none;
          }
          textarea:focus {
            border-left: 3px solid orangered;
            outline: none;
          }
        `}</style>
        <textarea
          placeholder="Type something here..."
          rows={this.numberOfLines()}
          value={this.state.value}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

export default EntryBox;
