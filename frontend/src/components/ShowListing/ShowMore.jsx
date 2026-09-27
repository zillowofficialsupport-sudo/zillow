import React, { useState } from 'react';

const ShowMore = ({ text }) => {
  const [isExpanded, setExpanded] = useState(false);
  const maxWords = 35;
  const words = (text || "").split(/\s+/).filter(Boolean);

  return (
    <div className="overview-text">
      {isExpanded ? text : words.slice(0, maxWords).join(" ")}
      {words.length > maxWords && (
        <button type="button" onClick={() => setExpanded(!isExpanded)}>
          {isExpanded ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  );
};

export default ShowMore;
