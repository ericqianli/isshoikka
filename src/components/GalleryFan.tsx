/**
 * Copyright 2015-present Isshoikka. All Rights Reserved.
 *
 */

import IsshoikkaArrangement from "../entities/IsshoikkaArrangement";
import IsshoikkaDBUtil from "../util/IsshoikkaDBUtil";
import IsshoikkaImage from "../entities/IsshoikkaImage";
import React, { Component } from "react";

const classNames = require("classnames");

// Same resting zoom as Fan.tsx (MIN_ZOOM_RATIO), so a gallery fan frames the
// photo exactly like the main page does before any zoom or pan.
const ZOOM_RATIO: number = 0.92;

type Props = {
    arrangement: IsshoikkaArrangement;
};

type State = {
    image: IsshoikkaImage | null;
};

function clamp01(value: number): number {
    return Math.max(0, Math.min(1, value));
}

class GalleryFan extends Component<Props, State> {
    _unmounted: boolean = false;

    constructor(props: Props) {
        super(props);
        this.state = { image: null };
    }

    componentDidMount() {
        IsshoikkaDBUtil.loadImageByArrangement(this.props.arrangement, "low").then(
            (image) => {
                if (!this._unmounted) {
                    this.setState({ image });
                }
            }
        );
    }

    componentWillUnmount() {
        this._unmounted = true;
    }

    // Mirrors Fan._getStyle at the resting zoom: the short side of the photo is
    // fitted to 92% of the square and centered; the long side slides by the
    // arrangement's configured offset. Percent positioning in CSS applies the
    // same (container - image) * offset formula that Fan computes in pixels.
    _getStyle(): Object {
        const image = this.state.image;
        if (image == null) {
            return {};
        }
        const dimension = image.getDimension();
        const portrait = dimension.height / dimension.width > 1;
        const offset = this.props.arrangement.getImageOffset();
        const percent = ZOOM_RATIO * 100 + "%";
        return {
            backgroundImage: "url(" + image.getUrl() + ")",
            backgroundSize: portrait ? percent + " auto" : "auto " + percent,
            backgroundPosition:
                (portrait ? 50 : clamp01(offset.x) * 100) +
                "% " +
                (portrait ? clamp01(offset.y) * 100 : 50) +
                "%",
        };
    }

    render() {
        return (
            <div
                className={classNames("galleryFan", {
                    fadein: this.state.image != null,
                })}
                style={this._getStyle()}
            >
                <div className="galleryMask" />
            </div>
        );
    }
}

export default GalleryFan;
