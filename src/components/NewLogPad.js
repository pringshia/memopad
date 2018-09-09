import React from "react";
import EntryBox from "./EntryBox";

export default props => (
  <EntryBox
    fontSize={25}
    allowEmptySubmissions={true}
    placeholder={`Enter a title for this new page...\nOr just hit enter to call it '${
      props.defaultPageName
    }'`}
    onSubmit={props.onPageName}
  />
);
