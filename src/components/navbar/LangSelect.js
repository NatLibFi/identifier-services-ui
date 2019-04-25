import React, { useState } from 'react';
import LanguageIcon from '@material-ui/icons/Language';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import { Menu, MenuItem, Select } from '@material-ui/core';


const LangSelect = () => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    }
    const handleClose = () => {
        setAnchorEl(null);
    }
    return (
        <>
            <LanguageIcon
                aria-owns={anchorEl ? 'language-menu' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
                style={{ marginLeft: 20 }}
            />&nbsp;<span>EN</span>
            <ArrowDropDown onClick={handleClick} />
            <Menu
                id="language-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >

                <MenuItem onClick={handleClose}>Sv</MenuItem>
                <MenuItem onClick={handleClose}>En</MenuItem>
            </Menu>
        </>
    )
}

export default LangSelect;