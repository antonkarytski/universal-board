import React from 'react';

import './styles.scss';

const ColorPickerItem = (props) => {
    return (
        <div
            style={ props.isActive ? { borderColor: props.color } : {}}
            className="palette-color-item-container"
            onClick={props.changeColor}
        >
            <div className={`palette-color-item ${props.classColor}`} />
        </div>
    );
};

export default ColorPickerItem;