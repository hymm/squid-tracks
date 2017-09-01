import React from 'react';
import './panel-with-menu.css'

const PanelWithMenu = ({ children, header, menu }) =>
<div className="panel panel-default panel-with-menu">
            <div className="panel-heading nav navbar-default">
                <div className="pull-left">
                     {header}
                </div>
                {menu}
            </div>
            <div className="panel-body">{children}</div>
        </div>;

export default PanelWithMenu;
