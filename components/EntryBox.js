export class EntryBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: "" };
  }
  handleChange = event => {
    this.setState({ value: event.target.value });
  };
  numberOfLines = () => {
    if (!this.state.value) return 1;
    return (this.state.value.match(/\n/g) || []).length + 1;
  };
  handleKeyDown = event => {
    if (event.keyCode === 13) {
      const contents = this.state.value;
      this.setState({ value: "" }, () => this.props.onSubmit(contents));
      event.preventDefault();
    }
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
          onKeyDown={this.handleKeyDown}
        />
      </div>
    );
  }
}

export default EntryBox;
