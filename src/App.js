import React, { Component } from "react";
import LogPad from "./components/LogPad";
import { BrowserRouter as Router, Route } from "react-router-dom";

class App extends Component {
  render() {
    return (
      <div className="p-8 pt-16">
        <h1 className="title dosis text-4xl uppercase">Memopad</h1>
        <Router>
          <Route path="/:page?" component={LogPad} />
        </Router>
      </div>
    );
  }
}

export default App;
