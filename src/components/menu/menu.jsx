import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useState, createContext, useContext, useRef } from 'react';

import styles from './menu.css';

export const isMobileMode = () => {
    try {
        const stored = localStorage.getItem('AESettings');
        if (!stored) return false;
        const settings = JSON.parse(stored);
        return settings.EnableMobileTouchDrag === true;
    } catch (e) {
        return false;
    }
};

const MenuContext = createContext({
    expandedIndex: null,
    setExpandedIndex: () => {}
});

let menuItemCounter = 0;

const MenuComponent = ({
    className = '',
    children,
    componentRef,
    place = 'right'
}) => {
    const mobileMode = isMobileMode();
    const [expandedIndex, setExpandedIndex] = useState(null);
    const menuKeyRef = useRef(++menuItemCounter);

    const handleMenuClick = (e) => {
        const target = e.target;
        const menuItem = target.closest(`.${styles.menuItem}`);
        if (!menuItem) return;
        
        const menuItems = Array.from(menuItem.parentElement.children);
        const clickedIndex = menuItems.indexOf(menuItem);
        
        if (clickedIndex === expandedIndex) {
            setExpandedIndex(null);
        } else {
            setExpandedIndex(clickedIndex);
        }
    };

    return (
        <MenuContext.Provider value={{ expandedIndex, setExpandedIndex, menuKey: menuKeyRef.current }}>
            <ul
                className={classNames(
                    styles.menu,
                    className,
                    {
                        [styles.left]: place === 'left',
                        [styles.right]: place === 'right',
                        [styles.mobileModeMenu]: mobileMode
                    }
                )}
                ref={componentRef}
                onClick={mobileMode ? handleMenuClick : undefined}
            >
                {React.Children.map(children, (child, index) => {
                    if (React.isValidElement(child) && child.type === MenuItem) {
                        return React.cloneElement(child, {
                            _menuIndex: index,
                            _expandedIndex: expandedIndex
                        });
                    }
                    return child;
                })}
            </ul>
        </MenuContext.Provider>
    );
};

MenuComponent.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    componentRef: PropTypes.func,
    place: PropTypes.oneOf(['left', 'right'])
};

const Submenu = ({children, className, place, ...props}) => (
    <div
        className={classNames(
            styles.submenu,
            className,
            {
                [styles.left]: place === 'left',
                [styles.right]: place === 'right'
            }
        )}
    >
        <MenuComponent
            place={place}
            {...props}
        >
            {children}
        </MenuComponent>
    </div>
);

Submenu.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    place: PropTypes.oneOf(['left', 'right'])
};

const MenuItem = ({
    children,
    className,
    expanded: initialExpanded = false,
    onClick,
    shortcut,
    _menuIndex,
    _expandedIndex
}) => {
    const mobileMode = isMobileMode();
    
    const isExpanded = mobileMode && _menuIndex !== undefined 
        ? _expandedIndex === _menuIndex 
        : initialExpanded;

    const handleClick = (e) => {
        e.stopPropagation();
        if (onClick) {
            onClick(e);
        }
    };

    const expanded = isExpanded;

    return (
        <li
            className={classNames(
                styles.menuItem,
                styles.hoverable,
                className,
                {[styles.expanded]: expanded},
                {[styles.mobileMode]: mobileMode}
            )}
            onClick={handleClick}
        >
            {children}
            {shortcut && <span className={styles.shortcut}>{shortcut}</span>}
        </li>
    );
};

MenuItem.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    expanded: PropTypes.bool,
    onClick: PropTypes.func,
    shortcut: PropTypes.string,
    _menuIndex: PropTypes.number,
    _expandedIndex: PropTypes.number
};


const addDividerClassToFirstChild = (child, id) => (
    child && React.cloneElement(child, {
        className: classNames(
            child.className,
            {[styles.menuSection]: id === 0}
        ),
        key: id
    })
);

const MenuSection = ({children}) => (
    <React.Fragment>{
        React.Children.map(children, addDividerClassToFirstChild)
    }</React.Fragment>
);

MenuSection.propTypes = {
    children: PropTypes.node
};

export {
    MenuComponent as default,
    MenuItem,
    MenuSection,
    Submenu
};
