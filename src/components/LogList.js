import React from "react";
import styled from "styled-components";
import firebase from "../firebase";
import { Link } from "react-router-dom";
import moment from "moment";

class LogList extends React.Component {
  state = { notes: {} };

  componentDidMount() {
    const logsRef = firebase
      .database()
      .ref("pages/" + firebase.auth().currentUser.uid);
    logsRef.on("value", snapshot => {
      this.setState({
        notes: snapshot.val()
      });
    });
  }

  render() {
    return (
      <React.Fragment>
        <h1 className="title dosis text-4xl uppercase">
          <Link to="/">Memopad</Link>
        </h1>
        <Wrapper>
          {Object.entries(this.state.notes)
            .sort(
              ([_, a], [__, b]) => moment(b.createdAt) - moment(a.createdAt)
            )
            .map(([id, details]) => (
              <ListItem key={id}>
                <Link to={"/" + id}>{details.title}</Link>
              </ListItem>
            ))}
        </Wrapper>
      </React.Fragment>
    );
  }
}

export default LogList;

const Wrapper = styled.div`
  padding: 0 75px;
`;

const ListItem = styled.div`
  margin: 0 0 10px 0;

  a {
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
`;
