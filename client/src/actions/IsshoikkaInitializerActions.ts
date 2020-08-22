/**
 * Copyright 2015-present Isshoikka. All Rights Reserved.
 *
 */

import IsshoikkaDispatcher from "../dispatcher/IsshoikkaDispatcher";
import IsshoikkaInitializer from "../util/IsshoikkaInitializer";
import IsshoikkaInitializerActionConstants from "../constants/IsshoikkaInitializerActionConstants";

const IsshoikkaInitializerActions = {
    loadAll(): void {
        this.loadAllFonts();
        this.loadAllArrangementsAndPlants();
        this.loadMask();
    },

    loadMask() {
        IsshoikkaInitializer.loadMask().then(() =>
            IsshoikkaDispatcher.dispatch({
                actionType: IsshoikkaInitializerActionConstants.LOAD_MASK,
            })
        );
    },

    loadAllFonts(): void {
        IsshoikkaInitializer.loadAllFonts().then((fontLoaded) =>
            IsshoikkaDispatcher.dispatch({
                actionType: IsshoikkaInitializerActionConstants.LOAD_ALL_FONTS,
                fontLoaded,
            })
        );
    },

    loadAllArrangementsAndPlants(): void {
        IsshoikkaInitializer.loadAllArrangementsAndPlants().then((data) =>
            IsshoikkaDispatcher.dispatch({
                actionType: IsshoikkaInitializerActionConstants.LOAD_ALL,
                arrangementList: data.arrangementList,
                plantList: data.plantList,
            })
        );
    },
};

export default IsshoikkaInitializerActions;
