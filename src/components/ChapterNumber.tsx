/**
 * Copyright 2015-present Isshoikka. All Rights Reserved.
 *
 */

import ChapterIndex from "../util/ChapterIndex";
import React, { Component } from "react";

const MIDDOT = "•";

type Props = {
    index: number;
};

class ChapterNumber extends Component<Props> {
    render() {
        return (
            <span className="chapter">
                {ChapterIndex.toChinese(this.props.index)}
                {MIDDOT}
                {ChapterIndex.toEnglish(this.props.index)}
            </span>
        );
    }
}

export default ChapterNumber;
