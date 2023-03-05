/**
 * Copyright 2015-present Isshoikka. All Rights Reserved.
 *
 */

import IsshoikkaDispatcher from "../dispatcher/IsshoikkaDispatcher";
import IsshoikkaArrangementNavigationActionConstants from "../constants/IsshoikkaArrangementNavigationActionConstants";

const IsshoikkaArrangementNavigationActions = {
    moveToPreviousArrangement() {
        IsshoikkaDispatcher.dispatch({
            actionType:
                IsshoikkaArrangementNavigationActionConstants.MOVE_PREVIOUS,
        });
    },

    moveToNextArrangement() {
        IsshoikkaDispatcher.dispatch({
            actionType: IsshoikkaArrangementNavigationActionConstants.MOVE_NEXT,
        });
    },

    moveToFirstArrangement() {
        IsshoikkaDispatcher.dispatch({
            actionType:
                IsshoikkaArrangementNavigationActionConstants.MOVE_FIRST,
        });
    },

    moveToLastArrangement() {
        IsshoikkaDispatcher.dispatch({
            actionType: IsshoikkaArrangementNavigationActionConstants.MOVE_LAST,
        });
    },
};

export default IsshoikkaArrangementNavigationActions;
