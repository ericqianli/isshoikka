/**
 * Copyright 2015-present Isshoikka. All Rights Reserved.
 *
 */

import IsshoikkaArrangementNavigationActions from "../actions/IsshoikkaArrangementNavigationActions";
import React, { Component } from "react";

var classNames = require("classnames");

type Direction = "left" | "right";
type Color = "bright" | "dark";

type Props = {
    direction: Direction;
    width: number;
    size: number;
};

class Arrow extends Component<Props> {
    constructor(props: Props) {
        super(props);
        this._onClick = this._onClick.bind(this);
    }

    _getArrowClass(color: Color): string {
        if (color == "bright") {
            if (this.props.direction == "left") {
                return "arrowLeft";
            }
            if (this.props.direction == "right") {
                return "arrowRight";
            }
        }
        if (color == "dark") {
            if (this.props.direction == "left") {
                return "arrowLeftDark";
            }
            if (this.props.direction == "right") {
                return "arrowRightDark";
            }
        }
        return "";
    }

    _onClick(_event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        if (this.props.direction == "left") {
            IsshoikkaArrangementNavigationActions.moveToNextArrangement();
        }
        if (this.props.direction == "right") {
            IsshoikkaArrangementNavigationActions.moveToPreviousArrangement();
        }
    }

    render() {
        const width = 48;
        const size = 48;
        return (<div
            className={classNames(
                "arrow",
                this._getArrowClass("dark")
            )}
            style={{
                width: width + "px",
                backgroundSize: size + "px  auto",
            }}
        />);


        return (
            <div className="sideNavigation" onClick={this._onClick}>
                <div
                    className={classNames(
                        "arrow",
                        this._getArrowClass("bright")
                    )}
                    style={{
                        width: width + "px",
                        backgroundSize: size + "px  auto",
                    }}
                >
                    <div
                        className={classNames(
                            "arrow",
                            this._getArrowClass("dark")
                        )}
                        style={{
                            width: width + "px",
                            backgroundSize: size + "px  auto",
                        }}
                    />
                </div>
            </div>
        );
    }
}

export default Arrow;
