'use client';
import { useState } from 'react';

export default function SynopsisClient({ text }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > 300;
  return (
    <>
      <div className={`synopsis ${expanded ? 'expanded' : ''}`} style={{ maxHeight: expanded ? 'none' : 120 }}>
        {text}
      </div>
      {isLong && (
        <button className="synopsis-toggle" onClick={() => setExpanded(e => !e)}>
          {expanded ? '▲ Sembunyikan' : '▼ Baca selengkapnya'}
        </button>
      )}
    </>
  );
}
