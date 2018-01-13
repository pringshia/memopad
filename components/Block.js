const marked = require("marked");

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false
});

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
        {<div dangerouslySetInnerHTML={{ __html: marked(props.content) }} />}
      </div>
    </React.Fragment>
  );
};

export default Block;
