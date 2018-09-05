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
    if (event.keyCode === 13 && !event.shiftKey) {
      const contents = this.state.value;
      this.setState({ value: "" }, () => {
        autosize.update(this.inputRef);
        contents && this.props.onSubmit(contents);
      });
      event.preventDefault();
    }
  };

  render() {
    return (
      <Wrapper>
        <textarea
          placeholder="Type something here..."
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
    line-height: 24px;
    resize: none;
    border-radius: 0;
  }
  textarea:focus {
    border-left: 3px solid orangered;
    outline: none;
  }
`;
