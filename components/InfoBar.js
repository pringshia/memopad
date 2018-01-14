const InfoBar = props => {
  return (
    <React.Fragment>
      <style jsx>
        {`
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
            color: red;
          }
        `}
      </style>
      <hr />
      <div className="info block dosis">{props.children}</div>
    </React.Fragment>
  );
};

export default InfoBar;
