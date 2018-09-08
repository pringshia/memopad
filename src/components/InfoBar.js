import React from "react";
import styled from "styled-components";

const InfoBar = ({ children, ...props }) => {
  return (
    <Wrapper {...props}>
      <hr />
      <div className="info block dosis">{children}</div>
    </Wrapper>
  );
};

export default InfoBar;

const Wrapper = styled.div`
  .block {
    padding: 3px 75px;
    margin-bottom: -3px;
    position: relative;
    font-size: 10px;
    color: #aaa;
    text-transform: uppercase;
  }
  :global(.tag) {
    margin-right: 10px;
    font-size: 14px;
    cursor: pointer;
  }
  :global(.tag.selected) {
    color: #0091ff;
  }
`;
