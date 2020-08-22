/**
 * Copyright 2015-present Isshoikka. All Rights Reserved.
 *
 */

import IsshoikkaDBUtil from "../util/IsshoikkaDBUtil";
import IsshoikkaDispatcher from "../dispatcher/IsshoikkaDispatcher";
import IsshoikkaArrangementActionConstants from "../constants/IsshoikkaArrangementActionConstants";

const IsshoikkaArrangementActions = {
    loadAllArrangements() {
        IsshoikkaDBUtil.getAllArrangements().then((arrangementList) => {
            IsshoikkaDispatcher.dispatch({
                actionType: IsshoikkaArrangementActionConstants.LOAD_ALL,
                arrangementList,
            });
        });
    },
};

export default IsshoikkaArrangementActions;
