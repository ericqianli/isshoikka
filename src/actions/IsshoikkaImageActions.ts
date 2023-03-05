/**
 * Copyright 2015-present Isshoikka. All Rights Reserved.
 *
 */

import IsshoikkaArrangement from "../entities/IsshoikkaArrangement";
import IsshoikkaDispatcher from "../dispatcher/IsshoikkaDispatcher";
import IsshoikkaDBUtil from "../util/IsshoikkaDBUtil";
import IsshoikkaImageActionConstants from "../constants/IsshoikkaImageActionConstants";

import type { ImageQuality } from "../entities/IsshoikkaImage";

function loadByArrangement(
    arrangement: IsshoikkaArrangement,
    quality: ImageQuality
) {
    IsshoikkaDBUtil.loadImageByArrangement(arrangement, quality).then(
        (image) => {
            IsshoikkaDispatcher.dispatch({
                actionType: IsshoikkaImageActionConstants.LOAD_BY_ARRANGEMENT,
                image,
                quality,
            });
        }
    );
}

const IsshoikkaImageActions = {
    loadByArrangement(arrangement: IsshoikkaArrangement) {
        loadByArrangement(arrangement, "low");
        //loadByArrangement(arrangement, 'high');
    },
};

export default IsshoikkaImageActions;
