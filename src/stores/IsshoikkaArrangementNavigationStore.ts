/**
 * Copyright 2015-present Isshoikka. All Rights Reserved.
 *
 */

import assign from "object-assign";
import invariant from "invariant";

import IsshoikkaArrangement from "../entities/IsshoikkaArrangement";
import IsshoikkaArrangementNavigationActionConstants from "../constants/IsshoikkaArrangementNavigationActionConstants";
import IsshoikkaArrangementStore from "./IsshoikkaArrangementStore";
import IsshoikkaClientStore from "../util/IsshoikkaClientStore";
import IsshoikkaDispatcher from "../dispatcher/IsshoikkaDispatcher";
import IsshoikkaInitializerActionConstants from "../constants/IsshoikkaInitializerActionConstants";

import { EventEmitter } from "events";

const CHANGE_EVENT = "change";

let _currentArrangementID = 0;

function setCurrentArrangementID(id: number) {
    _currentArrangementID = id;
    IsshoikkaClientStore.set("currentArrangementID", id);
}

const IsshoikkaArrangementNavigationStore: any = assign(
    {},
    EventEmitter.prototype,
    {
        getCurrentArrangementID(): number {
            return _currentArrangementID;
        },

        hasPreviousArrangement(): boolean {
            return (
                _currentArrangementID >
                IsshoikkaArrangementStore.getFirstArrangement().getID()
            );
        },

        hasNextArrangement(): boolean {
            return (
                _currentArrangementID <
                IsshoikkaArrangementStore.getLastArrangement().getID()
            );
        },

        getPreviousArrangement(): IsshoikkaArrangement | null {
            let id = _currentArrangementID;
            while (id > 0) {
                id--;
                const previousArrangement = IsshoikkaArrangementStore.getArrangementByID(
                    id
                );
                if (previousArrangement) {
                    return previousArrangement;
                }
            }
            return null;
        },

        getNextArrangement(): IsshoikkaArrangement | null {
            let id = _currentArrangementID;
            while (
                id < IsshoikkaArrangementStore.getLastArrangement().getID()
            ) {
                id++;
                const nextArrangement = IsshoikkaArrangementStore.getArrangementByID(
                    id
                );
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

IsshoikkaArrangementNavigationStore.dispatchToken = IsshoikkaDispatcher.register(
    function (action: any) {
        IsshoikkaDispatcher.waitFor([IsshoikkaArrangementStore.dispatchToken]);
        switch (action.actionType) {
            case IsshoikkaInitializerActionConstants.LOAD_ALL:
                let arrangementID = IsshoikkaClientStore.get(
                    "currentArrangementID"
                );
                if (!arrangementID) {
                    const firstArrangement = IsshoikkaArrangementStore.getFirstArrangement();
                    arrangementID = firstArrangement.getID();
                }
                invariant(
                    typeof arrangementID == "number",
                    "arrangement ID must be a number"
                );
                setCurrentArrangementID(arrangementID);
                break;
            case IsshoikkaArrangementNavigationActionConstants.MOVE_NEXT:
                const nextArrangement = IsshoikkaArrangementNavigationStore.getNextArrangement();
                if (nextArrangement) {
                    setCurrentArrangementID(nextArrangement.getID());
                    IsshoikkaArrangementNavigationStore.emitChange();
                }
                break;
            case IsshoikkaArrangementNavigationActionConstants.MOVE_PREVIOUS:
                const previousArrangement = IsshoikkaArrangementNavigationStore.getPreviousArrangement();
                if (previousArrangement) {
                    setCurrentArrangementID(previousArrangement.getID());
                    IsshoikkaArrangementNavigationStore.emitChange();
                }
                break;
            case IsshoikkaArrangementNavigationActionConstants.MOVE_FIRST:
                const firstArrangement = IsshoikkaArrangementStore.getFirstArrangement();
                setCurrentArrangementID(firstArrangement.getID());
                IsshoikkaArrangementNavigationStore.emitChange();
                break;
            case IsshoikkaArrangementNavigationActionConstants.MOVE_LAST:
                const lastArrangement = IsshoikkaArrangementStore.getLastArrangement();
                setCurrentArrangementID(lastArrangement.getID());
                IsshoikkaArrangementNavigationStore.emitChange();
                break;
            default:
                break;
        }
    }
);

export default IsshoikkaArrangementNavigationStore;
