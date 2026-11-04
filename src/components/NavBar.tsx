/**
 * Copyright 2015-present Isshoikka. All Rights Reserved.
 *
 */

import IsshoikkaRouteUtil from "../util/IsshoikkaRouteUtil";
import React, { Component } from "react";

const classNames = require("classnames");

// "about/" is a static page shipped in public/about, so it is a path, not a hash.
const LINKS = [
    { key: "home", label: "Home", href: "#" },
    { key: "gallery", label: "Gallery", href: "#gallery" },
    { key: "about", label: "About", href: "about/" },
];

// Vertical corner labels in the top right, after the language toggle on
// xuanguang.starlia.ai: Latin runs sideways, items separated by a short rule.
class NavBar extends Component {
    render() {
        const current = IsshoikkaRouteUtil.isGallery() ? "gallery" : "home";
        return (
            <nav className="navCorner" aria-label="Site">
                {LINKS.map((link, index) => [
                    index > 0 ? (
                        <span key={link.key + "-sep"} className="navSeparator">
                            |
                        </span>
                    ) : null,
                    <a
                        key={link.key}
                        className={classNames("navLink", {
                            navLinkCurrent: current === link.key,
                        })}
                        href={link.href}
                    >
                        {link.label}
                    </a>,
                ])}
            </nav>
        );
    }
}

export default NavBar;
