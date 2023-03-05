/**
 * Copyright 2015-present Isshoikka. All Rights Reserved.
 *
 * @providesModule IsshoikkaArrangementStore
 * @flow
 */

import assign from "object-assign";
import invariant from "invariant";
import Immutable from "immutable";
import IsshoikkaArrangement from "../entities/IsshoikkaArrangement";
import IsshoikkaDispatcher from "../dispatcher/IsshoikkaDispatcher";
import IsshoikkaArrangementActionConstants from "../constants/IsshoikkaArrangementActionConstants";
import IsshoikkaInitializerActionConstants from "../constants/IsshoikkaInitializerActionConstants";

import { EventEmitter } from "events";

const CHANGE_EVENT = "change";

export type ArrangementMap = Immutable.Map<number, IsshoikkaArrangement>;

let _arrangementMap: ArrangementMap = Immutable.Map();

function storeAllArrangements(
    arrangementList: Immutable.List<IsshoikkaArrangement>
) {
    _arrangementMap = Immutable.Map(
        arrangementList.map((arrangement) => [arrangement.getID(), arrangement])
    ).sort(
        (arrangementA, arrangementB) =>
            arrangementA.getID() - arrangementB.getID()
    );
    console.log('store _arrangementMap', _arrangementMap);
    IsshoikkaArrangementStore.emitChange();
}

const IsshoikkaArrangementStore: any = assign(
    {},
    EventEmitter.prototype,
    {
        getArrangementMap(): ArrangementMap {
            return _arrangementMap;
        },

        getArrangementByID(arrangementID: number): IsshoikkaArrangement {
            const arrangement = _arrangementMap.get(arrangementID);
            invariant(
                arrangement,
                "Arrangement with ID " + arrangementID + " must exist."
            );
            return arrangement as IsshoikkaArrangement;
        },

        getFirstArrangement(): IsshoikkaArrangement {
            const arrangement = _arrangementMap.first();
            invariant(arrangement, "Must have at least one arrangement.");
            return arrangement as IsshoikkaArrangement;
        },

        getLastArrangement(): IsshoikkaArrangement {
            const arrangement = _arrangementMap.last();
            invariant(arrangement, "Must have at least one arrangement.");
            return arrangement as IsshoikkaArrangement;
        },

        getNextArrangement(arrangementID: number): IsshoikkaArrangement | null {
            if (_arrangementMap.count() == 0) {
                return null;
            }
            const lastArrangement = _arrangementMap.last() as IsshoikkaArrangement;
            const lastArrangementID = lastArrangement.getID();
            while (arrangementID < lastArrangementID) {
                arrangementID++;
                const nextArrangement = _arrangementMap.get(arrangementID);
                if (nextArrangement) {
                    return nextArrangement;
                }
            }
            return null;
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
    }
);

IsshoikkaArrangementStore.dispatchToken = IsshoikkaDispatcher.register(
    function (action: any) {
        switch (action.actionType) {
            case IsshoikkaInitializerActionConstants.LOAD_ALL:
                storeAllArrangements(action.arrangementList);
                break;
            case IsshoikkaArrangementActionConstants.LOAD_BY_ID:
                //readPlantsByArrangementID(action.arrangementID);
                break;
            default:
                break;
        }
    }
);

export default IsshoikkaArrangementStore;
