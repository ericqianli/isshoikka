/**
 * Copyright 2015-present Isshoikka. All Rights Reserved.
 *
 */

import ChapterNumber from "./ChapterNumber";
import Copyright from "./Copyright";
import Fan from "./Fan";
import FishTail from "./FishTail";
import Immutable from "immutable";
import IsshoikkaArrangement from "../entities/IsshoikkaArrangement";
import IsshoikkaImage from "../entities/IsshoikkaImage";
import NameColumn from "./NameColumn";
import React, { Component } from "react";

import type IsshoikkaPlant from "../entities/IsshoikkaPlant";
import type { Layout, Point } from "./Fan";

const classNames = require("classnames");

const TITLE: string = "一生一花";

type Size = "small" | "large";

type Props = {
    arrangement: IsshoikkaArrangement | null;
    fanSize: number;
    fontLoaded: boolean;
    image: IsshoikkaImage | null;
    layout: Layout;
    maskLoaded: boolean;
    plantList: Immutable.List<IsshoikkaPlant> | null;
    width: number;
    widthRatio: number;
};

type State = {
    arrangementSwitching: boolean;
};

class Screen extends Component<Props, State> {
    _timeoutID: NodeJS.Timeout | null = null;

    static defaultProps = {
        layout: "horizontal",
    };

    constructor(props: Props) {
        super(props);
        this.state = {
            arrangementSwitching: false,
        };
    }

    componentWillReceiveProps(nextProps: Props) {
        if (
            (!this.props.fontLoaded &&
                nextProps.fontLoaded &&
                nextProps.arrangement) ||
            (nextProps.fontLoaded &&
                nextProps.arrangement &&
                (this.props.arrangement == null ||
                    nextProps.arrangement.getID() !=
                        this.props.arrangement.getID()))
        ) {
            if (this._timeoutID) {
                clearTimeout(this._timeoutID);
            }
            // switching arrangement. reset fadein style.
            this.setState({ arrangementSwitching: true });
            this._timeoutID = setTimeout(
                () => this.setState({ arrangementSwitching: false }),
                10
            );
        }
    }

    _getWingWidth(): number {
        if (this.props.layout == "horizontal") {
            return Math.floor((this.props.width - this.props.fanSize) / 2);
        } else {
            // vertical
            return this.props.fanSize;
        }
    }

    _getNameColumns(): Array<any> {
        const plantList = this.props.plantList;
        if (!plantList || !Immutable.List.isList(plantList)) {
            return [];
        }
        return plantList
            .map((plant, key) => <NameColumn key={key} plant={plant} />)
            .toArray();
    }

    _getPositionOffset(): Point {
        if (this.props.arrangement) {
            return this.props.arrangement.getImageOffset();
        }
        return { x: 0.5, y: 0.5 };
    }

    _getChapterNumber() {
        if (this.props.arrangement) {
            const number = Number(this.props.arrangement.getID());
            return <ChapterNumber index={number} />;
        }
        return null;
    }

    render() {
        const height = this.props.fanSize;
        const width = this.props.fanSize;
        const wingWidth = this._getWingWidth();
        const fontSize = Math.round(height * 0.03);

        return (
            <div
                className="screen"
                style={{
                    height:
                        this.props.layout == "horizontal" ? height : "initial",
                    flexDirection:
                        this.props.layout == "horizontal"
                            ? "row-reverse"
                            : "column",
                    WebkitFlexDirection:
                        this.props.layout == "horizontal"
                            ? "row-reverse"
                            : "column",
                    justifyContent:
                        this.props.layout == "horizontal"
                            ? "center"
                            : "initial",
                    WebkitJustifyContent:
                        this.props.layout == "horizontal"
                            ? "center"
                            : "initial",
                    width: this.props.width + "px",
                }}
            >
                <div
                    className={classNames("right")}
                    style={{
                        width: wingWidth,
                        height,
                        fontSize: fontSize,
                        visibility: this.props.fontLoaded
                            ? "initial"
                            : "hidden",
                    }}
                >
                    <div className="title">
                        <FishTail size="large">
                            <span>{TITLE}</span>
                        </FishTail>
                        <div id="ying"></div>
                    </div>
                    <div className={classNames("subTitle")}>
                        <div
                            className={classNames({
                                fadein: !this.state.arrangementSwitching,
                            })}
                            style={{
                                visibility:
                                    !this.state.arrangementSwitching &&
                                    this.props.fontLoaded
                                        ? "initial"
                                        : "hidden",
                            }}
                        >
                            {this._getChapterNumber()}
                        </div>
                        <Copyright />
                    </div>
                </div>
                <Fan
                    dimension={{
                        width: width,
                        height: height,
                    }}
                    image={this.props.image}
                    maskLoaded={this.props.maskLoaded}
                    positionOffset={this._getPositionOffset()}
                />
                <div
                    className={classNames("left", {
                        fadein: !this.state.arrangementSwitching,
                    })}
                    style={{
                        width: wingWidth,
                        height,
                        fontSize: fontSize,
                        visibility:
                            this.props.fontLoaded &&
                            !this.state.arrangementSwitching
                                ? "initial"
                                : "hidden",
                    }}
                >
                    <ul className={classNames("menu")}>
                        {this._getNameColumns()}
                    </ul>
                </div>
            </div>
        );
    }
}

export default Screen;