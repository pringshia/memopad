const Block = props => {
  return (
    <React.Fragment>
      <style jsx>{`
        .block {
          margin-left: 75px;
          margin-bottom: 10px;
          position: relative;
        }
        span.timestamp {
          position: absolute;
          left: -75px;
          text-align: right;
          width: 75px;
          color: #aaa;
        }
      `}</style>

      <div className="block">
        {props.timestamp && (
          <span className="timestamp dosis text-sm pr-4">
            {props.timestamp}
          </span>
        )}
        {props.children}
      </div>
    </React.Fragment>
  );
};

export default Block;
