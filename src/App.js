import React, { Component } from "react";
import LogPad from "./components/LogPad";

class App extends Component {
  render() {
    return (
      <div className="p-8 pt-16">
        <h1 className="title dosis text-4xl uppercase">Memopad</h1>
        <LogPad page={this.props.page} />
      </div>
    );
  }
}

export default App;
