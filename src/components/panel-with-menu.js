import React from 'react';
import './panel-with-menu.css';

const PanelWithMenu = ({ children, header, menu, className }) => (
  <div className={[`card card-default card-with-menu`, className].join(' ')}>
    <div className="card-header nav navbar-default">
      <div className="mr-auto">{header}</div>
      {menu}
    </div>
    <div className="card-body">{children}</div>
  </div>
);

export default PanelWithMenu;
