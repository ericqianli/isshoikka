/**
 * Copyright 2015-present Isshoikka. All Rights Reserved.
 *
 */

import Arrow from "./Arrow";
import IsshoikkaArrangementNavigationActions from "../actions/IsshoikkaArrangementNavigationActions";
import React, { Component } from "react";
import Screen from "./Screen";

import type { ArrangementMap } from "../stores/IsshoikkaArrangementStore";
import type { ImageMap } from "../stores/IsshoikkaImageStore";
import type { Layout } from "./Fan";
import type { PlantMap } from "../stores/IsshoikkaPlantStore";
import IsshoikkaArrangement from "../entities/IsshoikkaArrangement";

const WIDTH_RATIO: number = 0.4; // e.g. 0.3 | 0.4 | 0.3
const HEIGHT_RATIO: number = 0.76; // e.g. 0.12 | 0.76 | 0.12
const VERTICAL_RATIO: number = 0.8;

const DEFAULT_SIZE: number = 800;
const MAX_SIZE: number = 1200;
const MIN_SIZE: number = 400;

const SIDE_WIDTH: number = 100; // reserved for navigation arrows

const KEY_CODE = {
    LEFT: 37,
    RIGHT: 39,
    HOME: 36,
    END: 35,
    PAGEUP: 33,
    PAGEDOWN: 34,
};

type State = {
    fanSize: number;
    layout: Layout;
};

type Props = {
    arrangementID: number;
    arrangementMap: ArrangementMap;
    fontLoaded: boolean;
    imageMap: ImageMap;
    maskLoaded: boolean;
    plantMap: PlantMap;
};

export default class IsshoikkaPage extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            fanSize: DEFAULT_SIZE,
            layout: "horizontal",
        };
    }

    componentDidMount() {
        window.addEventListener("resize", this._handleResize.bind(this));
        window.addEventListener("keydown", this._handleKeyDown.bind(this));
        this._handleResize();
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this._handleResize.bind(this));
        window.removeEventListener("keydown", this._handleKeyDown.bind(this));
    }

    _getSize(nextLayout: Layout): number {
        const clientWidth = document.documentElement.clientWidth;
        const clientHeight = document.documentElement.clientHeight;
        let size = DEFAULT_SIZE;
        if (nextLayout == "horizontal") {
            size = Math.min(
                clientHeight * HEIGHT_RATIO,
                clientWidth * WIDTH_RATIO
            );
        } else {
            size = clientWidth * VERTICAL_RATIO;
        }
        size = Math.round(size);
        if (size > MAX_SIZE) {
            size = MAX_SIZE;
        }
        if (size < MIN_SIZE) {
            size = MIN_SIZE;
        }
        return size;
    }

    _getLayout(): Layout {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        return windowWidth > windowHeight ? "horizontal" : "vertical";
    }

    _handleResize() {
        const nextLayout = this._getLayout();
        const nextSize = this._getSize(nextLayout);
        this.setState({
            fanSize: nextSize,
            layout: nextLayout,
        });
    }

    _getLeftArrow(fontSize: number) {
        const arrangementMap = this.props.arrangementMap;
        if (arrangementMap == null || arrangementMap.count() == 0) {
            return null;
        }
        const lastArrangement = arrangementMap.last() as IsshoikkaArrangement;
        if (this.props.arrangementID < lastArrangement.getID()) {
            return (
                <Arrow
                    direction="left"
                    width={2 * fontSize}
                    size={1.2 * fontSize}
                />
            );
        }
        return null;
    }

    _getRightArrow(fontSize: number) {
        const arrangementMap = this.props.arrangementMap;
        if (arrangementMap == null || arrangementMap.count() == 0) {
            return null;
        }
        const firstArrangement = arrangementMap.first() as IsshoikkaArrangement;
        if (this.props.arrangementID > firstArrangement.getID()) {
            return (
                <Arrow
                    direction="right"
                    width={2 * fontSize}
                    size={1.2 * fontSize}
                />
            );
        }
        return null;
    }

    _getScreenWidth(fontSize: number): number {
        return Math.max(
            document.body.clientWidth - 4 * fontSize,
            this.state.fanSize
        );
    }

    _handleKeyDown(event: KeyboardEvent) {
        const keyCode = event.keyCode;
        if (!keyCode) {
            return;
        }
        switch (keyCode) {
            case KEY_CODE.LEFT:
            case KEY_CODE.PAGEDOWN:
                event.preventDefault();
                event.stopPropagation();
                IsshoikkaArrangementNavigationActions.moveToNextArrangement();
                break;
            case KEY_CODE.RIGHT:
            case KEY_CODE.PAGEUP:
                event.preventDefault();
                event.stopPropagation();
                IsshoikkaArrangementNavigationActions.moveToPreviousArrangement();
                break;
            case KEY_CODE.HOME:
                event.preventDefault();
                event.stopPropagation();
                IsshoikkaArrangementNavigationActions.moveToFirstArrangement();
                break;
            case KEY_CODE.END:
                event.preventDefault();
                event.stopPropagation();
                IsshoikkaArrangementNavigationActions.moveToLastArrangement();
                break;
            default:
                break;
        }
    }

    render() {
        const fontSize = Math.round(this.state.fanSize * 0.03);
        return (
            <div
                id="index"
                style={{
                    height:
                        this.state.layout == "horizontal" ? "100%" : "initial",
                    fontSize,
                }}
            >
                <div id="header" />
                <div id="main">
                    <div id="left">{this._getLeftArrow(fontSize)}</div>
                    <Screen
                        arrangement={
                            this.props.arrangementMap.get(
                                this.props.arrangementID
                            ) || null
                        }
                        fanSize={this.state.fanSize}
                        fontLoaded={this.props.fontLoaded}
                        image={
                            this.props.imageMap.get(this.props.arrangementID) ||
                            null
                        }
                        layout={this.state.layout}
                        maskLoaded={this.props.maskLoaded}
                        plantList={
                            this.props.plantMap.get(this.props.arrangementID) ||
                            null
                        }
                        width={this._getScreenWidth(fontSize)}
                        widthRatio={WIDTH_RATIO}
                    />
                    <div id="right">{this._getRightArrow(fontSize)}</div>
                </div>
                <div id="footer" />
            </div>
        );
    }
}
