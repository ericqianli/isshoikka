/**
 * Copyright 2015-present Isshoikka. All Rights Reserved.
 *
 */

import IsshoikkaPage from "./IsshoikkaPage";
import IsshoikkaArrangementStore from "../stores/IsshoikkaArrangementStore";
import IsshoikkaArrangementNavigationStore from "../stores/IsshoikkaArrangementNavigationStore";
import IsshoikkaFontStore from "../stores/IsshoikkaFontStore";
import IsshoikkaImageStore from "../stores/IsshoikkaImageStore";
import IsshoikkaInitializerActions from "../actions/IsshoikkaInitializerActions";
import IsshoikkaPlantStore from "../stores/IsshoikkaPlantStore";
import React, { Component } from "react";

import type { ArrangementMap } from "../stores/IsshoikkaArrangementStore";
import type { ImageMap } from "../stores/IsshoikkaImageStore";
import type { PlantMap } from "../stores/IsshoikkaPlantStore";

type State = {
    arrangementMap: ArrangementMap;
    currentArrangementID: number;
    fontLoaded: boolean;
    imageMap: ImageMap;
    maskLoaded: boolean;
    plantMap: PlantMap;
};

type Props = {};

function getState(): State {
    return {
        arrangementMap: IsshoikkaArrangementStore.getArrangementMap(),
        currentArrangementID: IsshoikkaArrangementNavigationStore.getCurrentArrangementID(),
        fontLoaded: IsshoikkaFontStore.isFontLoaded(),
        imageMap: IsshoikkaImageStore.getImageMap(),
        maskLoaded: IsshoikkaImageStore.isMaskLoaded(),
        plantMap: IsshoikkaPlantStore.getPlantMap(),
    };
}

export default class IsshoikkaFluxContainer extends Component {
    state: State;

    constructor(props: Props) {
        super(props);
        this.state = getState();
        this._onChange = this._onChange.bind(this);
    }

    componentDidMount() {
        IsshoikkaArrangementStore.addChangeListener(this._onChange);
        IsshoikkaArrangementNavigationStore.addChangeListener(this._onChange);
        IsshoikkaFontStore.addChangeListener(this._onChange);
        IsshoikkaImageStore.addChangeListener(this._onChange);
        IsshoikkaPlantStore.addChangeListener(this._onChange);
        // load all fonts, arrangements and plants
        IsshoikkaInitializerActions.loadAll();
    }

    componentWillUnmount() {
        IsshoikkaArrangementStore.removeChangeListener(this._onChange);
        IsshoikkaArrangementNavigationStore.removeChangeListener(this._onChange);
        IsshoikkaFontStore.removeChangeListener(this._onChange);
        IsshoikkaImageStore.removeChangeListener(this._onChange);
        IsshoikkaPlantStore.removeChangeListener(this._onChange);
    }

    _onChange() {
      console.log('on change', getState());
        this.setState(getState());
    }

    render() {
        return (
            <IsshoikkaPage
                arrangementID={this.state.currentArrangementID}
                arrangementMap={this.state.arrangementMap}
                fontLoaded={this.state.fontLoaded}
                imageMap={this.state.imageMap}
                maskLoaded={this.state.maskLoaded}
                plantMap={this.state.plantMap}
            />
        );
    }
}
