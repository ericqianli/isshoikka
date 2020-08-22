/**
 * Copyright 2015-present Isshoikka. All Rights Reserved.
 *
 */

import React, { Component } from "react";

const classNames = require("classnames");

const MIDDOT = "\u2022";
const STEP = 6;

export default class LoadingIndicator extends Component {
    _getMiddots() {
        let middots: Array<any> = [];
        for (let i = 0; i < STEP; i++) {
            middots.push(
                <div
                    key={"middot_" + i}
                    className={classNames(
                        "loadingIndicatorText",
                        "loadingIndicatorDot" + i
                    )}
                >
                    {MIDDOT}
                </div>
            );
        }
        return middots;
    }

    render() {
        return <div className="loadingIndicator">{this._getMiddots()}</div>;
    }
}
