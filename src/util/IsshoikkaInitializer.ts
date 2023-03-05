/**
 * Copyright 2015-present Isshoikka. All Rights Reserved.
 *
 */

import Immutable from "immutable";

import IsshoikkaArrangement from "../entities/IsshoikkaArrangement";
import IsshoikkaDBUtil from "./IsshoikkaDBUtil";
import IsshoikkaFontUtil from "./IsshoikkaFontUtil";
import IsshoikkaPlant from "../entities/IsshoikkaPlant";

export type ArrangementList = Immutable.List<IsshoikkaArrangement>;
export type PlantList = Immutable.List<IsshoikkaPlant>;

type IsshoikkaData = {
    arrangementList: ArrangementList;
    plantList: PlantList;
};

const IsshoikkaInitializer = {
    loadMask(): Promise<void> {
        return IsshoikkaDBUtil.loadMask();
    },

    loadAllFonts(): Promise<boolean> {
        return IsshoikkaFontUtil.loadAll();
    },

    loadAllArrangementsAndPlants(): Promise<IsshoikkaData> {
        return new Promise((resolve) =>
            IsshoikkaDBUtil.getAllArrangements().then((arrangementList) =>
                IsshoikkaDBUtil.getAllPlantsWithArrangementID().then(
                    (plantList) =>
                        resolve({
                            arrangementList,
                            plantList,
                        })
                )
            )
        );
    },
};

export default IsshoikkaInitializer;
