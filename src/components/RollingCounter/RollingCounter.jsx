import React, { useEffect, useState } from 'react';
import './RollingCounter.css';

function RollingDigit({ digit }) {
  const digits = [...Array(10).keys()];
  const [translateY, setTranslateY] = useState(0);

  useEffect(() => {
    setTranslateY(-digit * 1.5); // Matches digit height
  }, [digit]);

  return (
    <div className="digit-container">
      <div
        className="digit-strip"
        style={{ transform: `translateY(${translateY}em)` }}
      >
        {digits.map((d) => (
          <div key={d} className="digit">{d}</div>
        ))}
      </div>
    </div>
  );
}

export default function RollingCounter({ value, children }) {
  const padded = value.toString().padStart(6, '0');

  return (
    <div className="counter-wrapper">
      <div className="counter">
        {padded.split('').map((char, i) => (
          <RollingDigit key={i} digit={parseInt(char, 10)} />
        ))}
      </div>
      {children && <span className="counter-label">{children}</span>}
    </div>
  );
}
