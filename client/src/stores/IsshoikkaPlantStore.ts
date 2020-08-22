/**
 * Copyright 2015-present Isshoikka. All Rights Reserved.
 *
 */

import assign from "object-assign";
import Immutable from "immutable";
import IsshoikkaDBUtil from "../util/IsshoikkaDBUtil";
import IsshoikkaDispatcher from "../dispatcher/IsshoikkaDispatcher";
import IsshoikkaPlant from "../entities/IsshoikkaPlant";
import IsshoikkaInitializerActionConstants from "../constants/IsshoikkaInitializerActionConstants";

import { EventEmitter } from "events";

import type { PlantList } from "../util/IsshoikkaInitializer";

const CHANGE_EVENT = "change";

export type PlantMap = Immutable.Map<number, Immutable.List<IsshoikkaPlant>>;

let _plantMap: PlantMap = Immutable.Map();

function processRequest(event: Event) {
    const request = event.currentTarget as XMLHttpRequest | null;
    if (request === null) {
        return;
    }
    const readyState = request.readyState;
    const status = request.status;

    if (readyState == 4 && status == 200) {
        const response = JSON.parse(request.responseText);

        _plantMap = Immutable.Map(
            response.map((row: any) => {
                return [row.id, new IsshoikkaPlant(row)];
            })
        );
        IsshoikkaPlantStore.emitChange();
    }
}

function storeAllPlants(plantList: PlantList) {
    _plantMap = Immutable.Map(
        plantList
            .groupBy((plant) => plant.getArrangementID())
            .map((plantList) =>
                plantList
                    .toList()
                    .sort((plantA, plantB) => plantA.compare(plantB))
            )
    );
    IsshoikkaPlantStore.emitChange();
}

// TODO: move to actions
function readAllPlants() {
    IsshoikkaDBUtil.getPlantMap().then((plantMap) => {
        _plantMap = plantMap;
        IsshoikkaPlantStore.emitChange();
    });
}

const IsshoikkaPlantStore = assign({}, EventEmitter.prototype, {
    getPlantMap(): PlantMap {
        return _plantMap;
    },

    emitChange() {
        (this as any).emit(CHANGE_EVENT);
    },

    addChangeListener(callback: any) {
        (this as any).on(CHANGE_EVENT, callback);
    },

    removeChangeListener(callback: any) {
        (this as any).removeListener(CHANGE_EVENT, callback);
    },
});

IsshoikkaDispatcher.register(function (action: any) {
    switch (action.actionType) {
        case IsshoikkaInitializerActionConstants.LOAD_ALL:
            storeAllPlants(action.plantList);
            break;
        default:
            break;
    }
});

export default IsshoikkaPlantStore;
