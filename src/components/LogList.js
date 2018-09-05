import React from "react";
import styled from "styled-components";
import firebase from "../firebase";
import { Link } from "react-router-dom";

class LogList extends React.Component {
  state = { notes: {} };

  componentDidMount() {
    const logsRef = firebase
      .database()
      .ref("pages/" + firebase.auth().currentUser.uid);
    logsRef.on("value", snapshot => {
      console.log(snapshot);
      this.setState({
        notes: snapshot.val()
      });
    });
  }

  render() {
    return (
      <Wrapper>
        {Object.entries(this.state.notes).map(([id, name]) => (
          <ListItem key={id}>
            <Link to={"/" + id}>{name}</Link>
          </ListItem>
        ))}
      </Wrapper>
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
