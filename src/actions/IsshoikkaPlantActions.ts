/**
 * Copyright 2015-present Isshoikka. All Rights Reserved.
 *
 */

import IsshoikkaDispatcher from "../dispatcher/IsshoikkaDispatcher";
import IsshoikkaPlantActionConstants from "../constants/IsshoikkaPlantActionConstants";

const IsshoikkaPlantActions = {
    loadAllPlants() {
        IsshoikkaDispatcher.dispatch({
            actionType: IsshoikkaPlantActionConstants.LOAD_ALL,
        });
    },

    loadPlantsByArrangementID(arrangementID: string) {
        IsshoikkaDispatcher.dispatch({
            actionType: IsshoikkaPlantActionConstants.LOAD_BY_ARRANGEMENT_ID,
            arrangementID: arrangementID,
        });
    },
};

export default IsshoikkaPlantActions;
