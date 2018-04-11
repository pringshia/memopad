import React from "react";
import styled from "styled-components";

import TrashIcon from "../icons/Trash";
import EditIcon from "../icons/Edit";
import c from "classnames";

const Header = props => {
  return (
    <Wrapper onClick={() => false}>
      <div className={c("header block dosis", { editable: !props.readOnly })}>
        {!props.readOnly && (
          <span className="controls dosis text-sm pr-4">
            <span
              className="btn"
              onClick={() => props.onDelete(props.entry.id)}
            >
              <TrashIcon size={16} />
            </span>
            <span className="btn" onClick={() => props.onEdit(props.entry.id)}>
              <EditIcon size={16} />
            </span>
          </span>
        )}
        <div className="header_name">{props.entry.contents}</div>
      </div>
    </Wrapper>
  );
};

export default Header;

const Wrapper = styled.div`
  .block.header {
    margin-top: 35px;
    color: orangered;
    font-size: 20px;
  }
  .header_name {
    border-bottom: 1px dotted #ddd;
    padding-bottom: 4px;
  }

  .block {
    padding: 0 75px;
    margin-bottom: 10px;
    position: relative;
  }
  .header:hover span.timestamp {
    display: none;
  }
  .header:hover span.controls {
    display: block;
  }
  .controls {
    display: none;
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none;
  }
  span.controls,
  span.timestamp {
    position: absolute;
    left: -10px;
    text-align: right;
    width: 85px;
    color: #aaa;
  }
  @keyframes pop {
    0% {
      transform: scale(0.01);
      opacity: 0;
    }
    40% {
      opacity: 1;
    }
    80% {
      transform: scale(1.25);
    }
    100% {
      transform: scale(1);
    }
  }
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  .btn {
    cursor: pointer;
    vertical-align: middle;
    margin-left: 4px;
    display: inline-block;
    animation: pop 0.1s ease-out;
    animation-fill-mode: backwards;
  }
  .controls .btn:nth-child(1) {
    animation-delay: 0.25s;
  }
  .controls .btn:nth-child(2) {
    animation-delay: 0.15s;
  }
  .controls .btn:nth-child(3) {
    animation-delay: 0.05s;
  }

  .timestamp {
    animation: fadeIn 0.1s ease-out;
  }
`;
