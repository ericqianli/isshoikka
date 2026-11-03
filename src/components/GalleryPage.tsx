/**
 * Copyright 2015-present Isshoikka. All Rights Reserved.
 *
 */

import ChapterIndex from "../util/ChapterIndex";
import GalleryFan from "./GalleryFan";
import IsshoikkaArrangement from "../entities/IsshoikkaArrangement";
import IsshoikkaArrangementStore from "../stores/IsshoikkaArrangementStore";
import IsshoikkaInitializerActions from "../actions/IsshoikkaInitializerActions";
import React, { Component } from "react";

import type { ArrangementMap } from "../stores/IsshoikkaArrangementStore";

const MIDDOT = "·";

type State = {
    arrangementMap: ArrangementMap;
};

function getState(): State {
    return {
        arrangementMap: IsshoikkaArrangementStore.getArrangementMap(),
    };
}

export default class GalleryPage extends Component<{}, State> {
    constructor(props: {}) {
        super(props);
        this.state = getState();
        this._onChange = this._onChange.bind(this);
    }

    componentDidMount() {
        IsshoikkaArrangementStore.addChangeListener(this._onChange);
        IsshoikkaInitializerActions.loadAll();
    }

    componentWillUnmount() {
        IsshoikkaArrangementStore.removeChangeListener(this._onChange);
    }

    _onChange() {
        this.setState(getState());
    }

    _getTile(arrangement: IsshoikkaArrangement) {
        const id = arrangement.getID();
        const label =
            ChapterIndex.toChinese(id) +
            " " +
            MIDDOT +
            " " +
            ChapterIndex.toEnglish(id);
        return (
            <a
                key={id}
                className="galleryTile"
                href={"#" + id}
                aria-label={label}
            >
                <GalleryFan arrangement={arrangement} />
            </a>
        );
    }

    render() {
        const tiles = this.state.arrangementMap
            .valueSeq()
            .map((arrangement) => this._getTile(arrangement))
            .toArray();
        return (
            <div className="gallery">
                <div className="galleryGrid">{tiles}</div>
            </div>
        );
    }
}
