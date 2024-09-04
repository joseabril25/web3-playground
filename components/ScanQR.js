import React, { useEffect, useState } from 'react';

const GenerateQr = ({ onClick, text, handleChange }) => { 
  return (
    <div>
      <input type="text" value={text} onChange={handleChange} />
      <button onClick={onClick}>Import</button>
    </div>
  )
};

export default GenerateQr;