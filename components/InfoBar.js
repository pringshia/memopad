const InfoBar = props => {
  return (
    <React.Fragment>
      <style jsx>
        {`
          .block {
            padding: 0px 75px;
            margin-bottom: 10px;
            position: relative;
            font-size: 10px;
            color: #666;
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
