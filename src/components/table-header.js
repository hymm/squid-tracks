import React from 'react';
import { Glyphicon } from 'react-bootstrap';

const TableHeader = ({ sort, text, sortColumn, setState }) => {
  return (
    <th onClick={() => setState(sort)} style={{ cursor: 'pointer' }}>
      {sort.sortColumn === sortColumn ? (
        <Glyphicon glyph="triangle-bottom" />
      ) : null}
      {text}
    </th>
  );
};

export default TableHeader;
