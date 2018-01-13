import TrashIcon from "~/icons/Trash";
import EditIcon from "~/icons/Edit";

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
          padding-left: 75px;
          margin-bottom: 10px;
          position: relative;
        }
        .block:hover span.timestamp {
          display: none;
        }
        .block:hover span.controls {
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
          left: 0px;
          text-align: right;
          width: 75px;
          color: #aaa;
        }
        @keyframes pop {
          0% {
            transform: scale(0.01);
            opacity: 0;
          }
          80% {
            transform: scale(1.3);
            opacity: 1;
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
          animation-delay: 0.15s;
        }
        .controls .btn:nth-child(2) {
          animation-delay: 0.05s;
        }

        .timestamp {
          animation: fadeIn 0.1s ease-out;
        }
      `}</style>

      <div className="block">
        {!props.hideTimestamp && (
          <span className="timestamp dosis text-sm pr-4">
            {props.entry.timestamp.format("h:mm A")}
          </span>
        )}
        <span className="controls dosis text-sm pr-4">
          <span className="btn" onClick={() => props.onDelete(props.entry.id)}>
            <TrashIcon size={18} />
          </span>
          <span className="btn" onClick={() => props.onEdit(props.entry.id)}>
            <EditIcon size={18} />
          </span>
        </span>
        {
          <div
            dangerouslySetInnerHTML={{ __html: marked(props.entry.contents) }}
          />
        }
      </div>
    </React.Fragment>
  );
};

export default Block;
