import React from "react";
import styled from "styled-components";
import autosize from "autosize";

export class EntryBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: "" };
  }
  componentDidMount() {
    this.inputRef.focus();
    autosize(this.inputRef);
  }
  handleChange = event => {
    this.setState({ value: event.target.value });
  };
  numberOfLines = () => {
    if (!this.state.value) return 1;
    return (this.state.value.match(/\n/g) || []).length + 1;
  };
  handleKeyDown = event => {
    const { allowEmptySubmissions = false } = this.props;
    if (event.keyCode === 13 && !event.shiftKey) {
      const contents = this.state.value;
      this.setState({ value: "" }, () => {
        autosize.update(this.inputRef);
        if (allowEmptySubmissions) {
          this.props.onSubmit(contents);
        } else if (contents) {
          this.props.onSubmit(contents);
        }
      });
      event.preventDefault();
    }
  };

  render() {
    return (
      <Wrapper>
        <textarea
          style={{ fontSize: this.props.fontSize || "inherit" }}
          placeholder={this.props.placeholder || "Type something here..."}
          ref={ref => (this.inputRef = ref)}
          rows={1}
          value={this.state.value}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
        />
      </Wrapper>
    );
  }
}

export default EntryBox;

const Wrapper = styled.div`
  & {
    padding: 0 75px;

    position: relative;
    left: -13px;
    top: -3px;
  }
  textarea {
    background-color: white;
    border-left: 3px solid #ddd;
    color: #333;
    width: 100%;
    box-sizing: content-box;
    padding: 3px 10px;
    line-height: 1.3em;
    resize: none;
    border-radius: 0;
  }
  textarea:focus {
    border-left: 3px solid orangered;
    outline: none;
  }
`;
