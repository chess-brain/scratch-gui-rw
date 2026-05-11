import PropTypes from 'prop-types';
import React from 'react';

import MenuComponent from '../components/menu/menu.jsx';

const Menu = ({open, children, ...props}) => {
    if (!open) return null;
    
    return (
        <MenuComponent {...props}>
            {children}
        </MenuComponent>
    );
};

Menu.propTypes = {
    children: PropTypes.node,
    open: PropTypes.bool.isRequired
};

export default Menu;
