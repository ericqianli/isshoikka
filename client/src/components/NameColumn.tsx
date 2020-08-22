/**
 * Copyright 2015-present Isshoikka. All Rights Reserved.
 *
 */

import FishTail from "./FishTail";
import React, { Component } from "react";

import type IsshoikkaPlant from "../entities/IsshoikkaPlant";

const classNames = require("classnames");

type Props = {
    plant: IsshoikkaPlant;
};

const DASH = "\u30FC";
const STICK = "\u4E28";

class NameColumn extends Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    _formatJapaneseName(name: string): string {
        return name
            .split("")
            .map((char) => (char == DASH ? STICK : char))
            .join("\n");
    }

    render() {
        const plant = this.props.plant;
        this._formatJapaneseName(plant.getJapaneseName());
        return (
            <li>
                <FishTail>{plant.getChineseName()}</FishTail>
                <span className={classNames("japaneseNameColumn")}>
                    {this._formatJapaneseName(plant.getJapaneseName())}
                </span>
                <span
                    className={classNames("englishNameColumn", "verticalText")}
                >
                    {plant.getEnglishName()}
                </span>
            </li>
        );
    }
}

export default NameColumn;
