/**
 * Copyright 2015-present Isshoikka. All Rights Reserved.
 *
 */

import Immutable from "immutable";
import NumberConverter from "../util/NumberConverter";
import React, { Component } from "react";

const ChineseCharMap = Immutable.List("零壹貳參肆伍陸柒捌玖".split(""));
const ChineseNumberBaseChar = "E030";
const MIDDOT = "\u2022";

type Props = {
    index: number;
};

class ChapterNumber extends Component<Props> {

    constructor(props: Props) {
        super(props);
    }

    _getChineseIndex(): string {
        let index = this.props.index;
        if (index == 0) {
            return "序";
        }
        let chars = "";
        while (index > 0) {
            chars = ChineseCharMap.get(index % 10) + chars;
            index = Math.floor(index / 10);
        }
        return chars;
    }

    _getChineseChar(index: number): string {
        index = index % 10;
        const char = (parseInt(ChineseNumberBaseChar, 16) + index).toString(16);
        return char;
    }

    _getEnglishIndex(): string {
        const index = this.props.index;
        let word = "";
        if (index == 0) {
            word = "prelude";
        } else {
            word = NumberConverter.toWords(this.props.index);
        }
        return this._capitalizeFirstLetter(word);
    }

    // again, firefox doesn't like text-transform for vertical layout
    _capitalizeFirstLetter(word: string) {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }

    render() {
        return (
            <span className="chapter">
                {this._getChineseIndex()}
                {MIDDOT}
                {this._getEnglishIndex()}
            </span>
        );
    }
}

export default ChapterNumber;
