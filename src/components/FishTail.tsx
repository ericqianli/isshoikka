/**
 * Copyright 2015-present Isshoikka. All Rights Reserved.
 *
 */

import React, { Component } from "react";

const classNames = require("classnames");

type Size = "small" | "large";
type Style = "single" | "double";

type Props = {
    size: Size;
    style: Style;
    tailFontSize: number;
    children: any;
    className: string | null;
    showStart: boolean;
    showEnd: boolean;
};

class FishTail extends Component<Props> {
    static defaultProps: Props = {
        size: "small",
        style: "single",
        tailFontSize: 0,
        children: [],
        className: null,
        showStart: true,
        showEnd: true,
    };

    constructor(props: Props) {
        super(props);
    }

    _getStartChar(): string {
        if (this.props.size == "small") {
            if (this.props.style == "single") {
                return "\uE05A";
            } else {
                return "\uE052";
            }
        } else {
            if (this.props.style == "single") {
                return "\uE05E";
            } else {
                return "\uE056";
            }
        }
    }

    _getEndChar(): string {
        if (this.props.size == "small") {
            if (this.props.style == "single") {
                return "\uE05B";
            } else {
                return "\uE053";
            }
        } else {
            if (this.props.style == "single") {
                return "\uE05F";
            } else {
                return "\uE057";
            }
        }
    }

    render() {
        const isSmall = this.props.size == "small";
        const fishTailStartChar = this._getStartChar();
        const fishTailEndChar = this._getEndChar();
        const startClass = isSmall
            ? "fishTailStartSmall"
            : "fishTailStartLarge";
        const endClass = isSmall ? "fishTailEndSmall" : "fishTailEndLarge";
        const style = this.props.tailFontSize
            ? {
                  fontSize: this.props.tailFontSize + "px",
                  lineHeight: this.props.tailFontSize + "px",
              }
            : {};
        const start = this.props.showStart ? (
            <span
                className={classNames("fishTailStart", startClass)}
                style={style}
            >
                {fishTailStartChar}
            </span>
        ) : null;
        const end = this.props.showEnd ? (
            <span className={classNames("fishTailEnd", endClass)} style={style}>
                {fishTailEndChar}
            </span>
        ) : null;
        return (
            <span className={classNames("fishTail", this.props.className)}>
                {start}
                {this.props.children}
                {end}
            </span>
        );
    }
}

export default FishTail;
