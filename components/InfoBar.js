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
        `}
      </style>
      <hr />
      <div className="info block dosis">{props.children}</div>
    </React.Fragment>
  );
};

export default InfoBar;
