/**
 * Copyright 2015-present Isshoikka. All Rights Reserved.
 *
 */

import IsshoikkaImage from "../entities/IsshoikkaImage";
import LoadingIndicator from "./LoadingIndicator";
import React, { Component } from "react";

const classNames = require("classnames");

export type Point = {
    x: number;
    y: number;
};

export type Dimension = {
    width: number;
    height: number;
};

export type Layout = "horizontal" | "vertical";

type State = {
    zoomRatio: number;
    position: Point;
    mouseDown: boolean;
    mouseIn: boolean;
    layout: Layout;
    initialImageSize: Dimension;
    imageSwitching: boolean;
};

// the bleeding prop overflows the mask slightly outside the fan, to hack the
// weird phantom subpixel background overflow bug in Windows.
type Props = {
    image: IsshoikkaImage | null;
    dimension: Dimension;
    bleeding: number;
    maskLoaded: boolean;
    positionOffset: Point;
};

const MIN_ZOOM_RATIO: number = 0.92;
const MAX_ZOOM_RATIO: number = 3.0;
const ZOOM_STEP: number = 0.005;

class Fan extends Component<Props, State> {
    _startMousePosition: Point = { x: 0, y: 0 };
    _startImagePosition: Point = { x: 0, y: 0 };

    _timeoutID: NodeJS.Timeout | null = null;

    static defaultProps = {
        positionOffset: { x: 0.5, y: 0.5 },
        bleeding: 1,
    };

    constructor(props: Props) {
        super(props);
        this.state = {
            zoomRatio: MIN_ZOOM_RATIO,
            position: {
                x: 0,
                y: 0,
            },
            mouseDown: false,
            mouseIn: false,
            layout: "vertical",
            initialImageSize: { width: 0, height: 0 },
            imageSwitching: true,
        };
    }

    componentWillReceiveProps(nextProps: Props) {
        let nextState = this._getStateFromProps(nextProps);

        if (!this._isImageUnchanged(this.props.image, nextProps.image, false)) {
            if (this._timeoutID) {
                clearTimeout(this._timeoutID);
            }
        }

        // when first load, wait for the later between image load and mask load
        if (
            (nextState.imageSwitching && this.props.maskLoaded) ||
            (this.props.image && !this.props.maskLoaded && nextProps.maskLoaded)
        ) {
            this._timeoutID = setTimeout(
                () => this.setState({ imageSwitching: false }),
                10
            );
        }

        this.setState(nextState);
    }

    shouldComponentUpdate(nextProps: Object, nextState: Object): boolean {
        // TODO: optimize
        return true;
    }

    _isImageUnchanged(
        image: IsshoikkaImage | null,
        nextImage: IsshoikkaImage | null,
        strict: boolean
    ): boolean {
        return (
            (image == null && nextImage == null) ||
            (image != null &&
                nextImage != null &&
                image.getArrangementID() == nextImage.getArrangementID() &&
                (!strict || image.getQuality() == nextImage.getQuality()))
        );
    }

    _getStateFromProps(props: Props): State {
        const imageSwitching = this._isImageSwitching(
            this.props.image,
            props.image
        );
        const layout = this._getLayout(props.image, props.dimension);
        const initialImageSize = this._getInitialImageSize(
            props.image,
            layout,
            props.dimension
        );
        let position = this._getInitialPosition(
            props.image,
            initialImageSize,
            props.dimension,
            props.positionOffset
        );
        const size = {
            width: initialImageSize.width * MIN_ZOOM_RATIO,
            height: initialImageSize.height * MIN_ZOOM_RATIO,
        };
        position = this._constrainPosition(position, size, props.dimension);

        if (
            this.props.image != null &&
            props.image != null &&
            this.props.image.getArrangementID() ==
                props.image.getArrangementID() &&
            this.props.image.getUrl() != props.image.getUrl()
        ) {
            return {
                ...this.state,
                initialImageSize,
                imageSwitching,
            };
        }
        return {
            ...this.state,
            zoomRatio: MIN_ZOOM_RATIO,
            position,
            layout,
            initialImageSize,
            imageSwitching,
        };
    }

    _getLayout(image: IsshoikkaImage | null, dimension: Dimension): Layout {
        if (image == null) {
            return "vertical";
        }
        const imageDimension = image.getDimension();
        const containerDimension = dimension;
        const imageRatio = imageDimension.height / imageDimension.width;
        const containerRatio =
            containerDimension.height / containerDimension.width;
        return imageRatio > containerRatio ? "vertical" : "horizontal";
    }

    _getInitialImageSize(
        image: IsshoikkaImage | null,
        layout: Layout,
        dimension: Dimension
    ): Dimension {
        if (image == null) {
            return {
                width: 0,
                height: 0,
            };
        }
        const imageDimension = image.getDimension();
        if (layout == "vertical") {
            return {
                width: dimension.width,
                height:
                    (dimension.width * imageDimension.height) /
                    imageDimension.width,
            };
        } else {
            // horizontal
            return {
                width:
                    (dimension.height * imageDimension.width) /
                    imageDimension.height,
                height: dimension.height,
            };
        }
    }

    _getInitialPosition(
        image: IsshoikkaImage | null,
        initialImageDimension: Dimension,
        containerDimension: Dimension,
        positionOffset: Point
    ): Point {
        if (image == null) {
            return {
                x: 0,
                y: 0,
            };
        }
        return {
            x:
                (containerDimension.width -
                    initialImageDimension.width * MIN_ZOOM_RATIO) *
                positionOffset.x,
            y:
                (containerDimension.height -
                    initialImageDimension.height * MIN_ZOOM_RATIO) *
                positionOffset.y,
        };
    }

    _isImageSwitching(
        image: IsshoikkaImage | null,
        nextImage: IsshoikkaImage | null
    ): boolean {
        if (nextImage == null) {
            return false;
        }
        return (
            image == null ||
            image.getArrangementID() != nextImage.getArrangementID()
        );
    }

    _onMouseDown(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        const startPosition = {
            x: event.clientX,
            y: event.clientY,
        };
        this._startMoving(startPosition);
    }

    _onTouchStart(event: Object) {
        /* TODO: need to optimize ux for touch screen
            const touchPoint = event.changedTouches[0];
            const startPosition = {
              x: touchPoint.clientX,
              y: touchPoint.clientY,
            };
            this._startMoving(startPosition);
        */
    }

    _startMoving(startPosition: Point) {
        this._startMousePosition = startPosition;
        this._startImagePosition = this.state.position;
        this.setState({
            mouseDown: true,
        });
    }

    _onMouseUp(_event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        this.setState({
            mouseDown: false,
        });
    }

    _onTouchEnd(event: Object) {
        this.setState({
            mouseDown: false,
        });
    }

    _onTouchCancel(event: Object) {
        this.setState({
            mouseDown: false,
        });
    }

    _onMouseMove(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        if (!this.state.mouseDown) {
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        const nextPosition = {
            x: event.clientX,
            y: event.clientY,
        };
        this._onMoving(nextPosition);
    }

    _onTouchMove(event: React.TouchEvent<HTMLDivElement>) {
        if (!this.state.mouseDown) {
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        const touchPoint = event.changedTouches[0];
        const nextPosition = {
            x: touchPoint.clientX,
            y: touchPoint.clientY,
        };
        this._onMoving(nextPosition);
    }

    _onMoving(nextPosition: Point) {
        const position = {
            x:
                this._startImagePosition.x +
                nextPosition.x -
                this._startMousePosition.x,
            y:
                this._startImagePosition.y +
                nextPosition.y -
                this._startMousePosition.y,
        };

        const size = {
            width: this.state.zoomRatio * this.state.initialImageSize.width,
            height: this.state.zoomRatio * this.state.initialImageSize.height,
        };

        const nextImagePosition = this._constrainPosition(
            position,
            size,
            this.props.dimension
        );

        this.setState({
            position: nextImagePosition,
        });
    }

    _getMinPosition(dimension: Dimension): Point {
        return {
            x: (dimension.width * (1 - MIN_ZOOM_RATIO)) / 2,
            y: (dimension.height * (1 - MIN_ZOOM_RATIO)) / 2,
        };
    }

    _getMaxPosition(dimension: Dimension): Point {
        return {
            x: (dimension.width * (1 + MIN_ZOOM_RATIO)) / 2,
            y: (dimension.height * (1 + MIN_ZOOM_RATIO)) / 2,
        };
    }

    _constrainPosition(
        position: Point,
        size: Dimension,
        dimension: Dimension
    ): Point {
        const lowerBound = this._getMinPosition(dimension);
        const upperBound = this._getMaxPosition(dimension);
        return {
            x: this._constraint(
                position.x,
                size.width,
                lowerBound.x,
                upperBound.x
            ),
            y: this._constraint(
                position.y,
                size.height,
                lowerBound.y,
                upperBound.y
            ),
        };
    }

    _constraint(
        x: number,
        size: number,
        lowerBound: number,
        upperBound: number
    ): number {
        if (x > lowerBound) {
            return lowerBound;
        }
        if (x + size < upperBound) {
            return upperBound - size;
        }
        return x;
    }

    onWheel(event: React.WheelEvent<HTMLDivElement>) {
        event.preventDefault();
        event.stopPropagation();
        if (
            (this.state.zoomRatio >= MAX_ZOOM_RATIO && event.deltaY > 0) ||
            (this.state.zoomRatio <= MIN_ZOOM_RATIO && event.deltaY < 0)
        ) {
            return;
        }
        let nextZoomRatio =
            this.state.zoomRatio + Math.round(event.deltaY) * ZOOM_STEP;
        if (nextZoomRatio < MIN_ZOOM_RATIO) {
            nextZoomRatio = MIN_ZOOM_RATIO;
        }
        if (nextZoomRatio > MAX_ZOOM_RATIO) {
            nextZoomRatio = MAX_ZOOM_RATIO;
        }

        const fan = document.getElementById("fan");
        if (fan == null) {
            return;
        }
        const boundingClientRect = fan.getBoundingClientRect();

        const offset = {
            x: event.clientX - boundingClientRect.left - this.state.position.x,
            y: event.clientY - boundingClientRect.top - this.state.position.y,
        };

        let nextPosition = this._getNextPosition(
            this.state.position,
            this.state.zoomRatio,
            nextZoomRatio,
            offset
        );

        const nextSize = {
            width: nextZoomRatio * this.state.initialImageSize.width,
            height: nextZoomRatio * this.state.initialImageSize.height,
        };

        nextPosition = this._constrainPosition(
            nextPosition,
            nextSize,
            this.props.dimension
        );

        this.setState({
            zoomRatio: nextZoomRatio,
            position: nextPosition,
        });
    }

    _getNextPosition(
        prevPosition: Point,
        prevRatio: number,
        nextRatio: number,
        offset: Point
    ): Point {
        return {
            x:
                prevPosition.x +
                ((prevRatio - nextRatio) * offset.x) / prevRatio,
            y:
                prevPosition.y +
                ((prevRatio - nextRatio) * offset.y) / prevRatio,
        };
    }

    _getStyle(): Object {
        const height = this.props.dimension.height;
        const width = this.props.dimension.width;
        if (this.props.image && !this.state.imageSwitching) {
            return {
                backgroundImage: "url(" + this.props.image.getUrl() + ")",
                backgroundSize:
                    // (this.state.layout == "horizontal" && "auto ") +
                    (this.state.layout === "horizontal" ? "auto " : "") +
                    this.state.zoomRatio * 100 +
                    "%",
                backgroundPosition:
                    this.state.position.x +
                    "px " +
                    this.state.position.y +
                    "px",
                cursor: this.state.mouseIn ? "move" : "default",
                minWidth: width + "px",
                height: height + "px",
                width: width + "px",
            };
        }
        return {
            height: height + "px",
            width: width + "px",
            backgroundImage: "none",
        };
    }

    _getLoadingIndicator() {
        if (this.props.image != null) {
            return null;
        }
        return <LoadingIndicator />;
    }

    render() {
        const height = this.props.dimension.height;
        const width = this.props.dimension.width;
        const bleeding = this.props.bleeding;
        return (
            <div
                id="fan"
                className={classNames({
                    fadein: !this.state.imageSwitching,
                })}
                style={this._getStyle()}
            >
                <div
                    id="mask"
                    className={classNames("middle")}
                    style={{
                        position: "relative",
                        top: -bleeding + "px",
                        left: -bleeding + "px",
                        cursor: this.state.mouseIn ? "move" : "default",
                        height: height + 2 * bleeding + "px",
                        width: width + 2 * bleeding + "px",
                    }}
                    onWheel={this.onWheel.bind(this)}
                    onMouseEnter={() => this.setState({ mouseIn: true })}
                    onMouseLeave={() =>
                        this.setState({
                            mouseIn: false,
                            mouseDown: false,
                        })
                    }
                    onMouseDown={this._onMouseDown.bind(this)}
                    onMouseMove={this._onMouseMove.bind(this)}
                    onMouseUp={this._onMouseUp.bind(this)}
                    onTouchStart={this._onTouchStart.bind(this)}
                    onTouchEnd={this._onTouchEnd.bind(this)}
                    onTouchMove={this._onTouchMove.bind(this)}
                    onTouchCancel={this._onTouchCancel.bind(this)}
                >
                    {this._getLoadingIndicator()}
                </div>
            </div>
        );
    }
}

export default Fan;
