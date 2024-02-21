// VersionInfo.js

import React from 'react';
import { FaInfoCircle } from 'react-icons/fa';

const VersionInfo = () => {
  const version = process.env.REACT_APP_VERSION; // Access version from environment variables
  const notes = process.env.REACT_APP_VERSION_TEXT;

  return (
    <div className="version-info">
      <div className="version-number">{`Version ${version}`}</div>
      <FaInfoCircle className="info-icon" />
      {notes && <div className="tooltip">Active licence: {notes}</div>}
    </div>
  );
};

export default VersionInfo;
