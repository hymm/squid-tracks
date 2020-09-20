import React from 'react';
import { FaCaretDown } from 'react-icons/fa';

const TableHeader = ({ sort, text, sortColumn, setState }) => {
  return (
    <th onClick={() => setState(sort)} style={{ cursor: 'pointer' }}>
      {sort.sortColumn === sortColumn ? <FaCaretDown /> : null}
      {text}
    </th>
  );
};

export default TableHeader;
