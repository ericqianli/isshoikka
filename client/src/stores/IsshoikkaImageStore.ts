/**
 * Copyright 2015-present Isshoikka. All Rights Reserved.
 *
 */

import assign from "object-assign";
import Immutable from "immutable";
import IsshoikkaArrangement from "../entities/IsshoikkaArrangement";
import IsshoikkaArrangementActionConstants from "../constants/IsshoikkaArrangementActionConstants";
import IsshoikkaArrangementStore from "./IsshoikkaArrangementStore";
import IsshoikkaArrangementNavigationActionConstants from "../constants/IsshoikkaArrangementNavigationActionConstants";
import IsshoikkaArrangementNavigationStore from "./IsshoikkaArrangementNavigationStore";
import IsshoikkaDispatcher from "../dispatcher/IsshoikkaDispatcher";
import IsshoikkaImage from "../entities/IsshoikkaImage";
import IsshoikkaImageActions from "../actions/IsshoikkaImageActions";
import IsshoikkaImageActionConstants from "../constants/IsshoikkaImageActionConstants";
import IsshoikkaInitializerActionConstants from "../constants/IsshoikkaInitializerActionConstants";

import { EventEmitter } from "events";

const CHANGE_EVENT = "change";

export type ImageMap = Immutable.Map<number, IsshoikkaImage>;

let _imageMap: ImageMap = Immutable.Map();
let _maskLoaded: boolean = false;

function storeImage(image: IsshoikkaImage) {
    const oldImage = _imageMap.get(image.getArrangementID());
    if (!oldImage || oldImage.getQuality() == "low") {
        _imageMap = _imageMap.set(image.getArrangementID(), image);
    }
}

function hasImage(id: number): boolean {
    return _imageMap.has(id);
}

function getCurrentArrangement(): IsshoikkaArrangement {
    const currentArrangementID = IsshoikkaArrangementNavigationStore.getCurrentArrangementID();
    return IsshoikkaArrangementStore.getArrangementByID(currentArrangementID);
}

const IsshoikkaImageStore = assign({}, EventEmitter.prototype, {
    getImageMap(): ImageMap {
        return _imageMap;
    },

    isMaskLoaded(): boolean {
        return _maskLoaded;
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
    IsshoikkaDispatcher.waitFor([
        IsshoikkaArrangementStore.dispatchToken,
        IsshoikkaArrangementNavigationStore.dispatchToken,
    ]);

    switch (action.actionType) {
        //case IsshoikkaArrangementActionConstants.LOAD_ALL:
        case IsshoikkaInitializerActionConstants.LOAD_ALL:
            IsshoikkaImageActions.loadByArrangement(getCurrentArrangement());
            break;
        case IsshoikkaInitializerActionConstants.LOAD_MASK:
            _maskLoaded = true;
            IsshoikkaImageStore.emitChange();
            break;
        case IsshoikkaImageActionConstants.LOAD_BY_ARRANGEMENT:
            storeImage(action.image);
            IsshoikkaImageStore.emitChange();
            break;
        case IsshoikkaArrangementActionConstants.LOAD_BY_ID:
            //readPlantsByArrangementID(action.arrangementID);
            break;
        case IsshoikkaArrangementNavigationActionConstants.MOVE_NEXT:
        case IsshoikkaArrangementNavigationActionConstants.MOVE_PREVIOUS:
        case IsshoikkaArrangementNavigationActionConstants.MOVE_FIRST:
        case IsshoikkaArrangementNavigationActionConstants.MOVE_LAST:
            const currentArrangement = getCurrentArrangement();
            if (hasImage(currentArrangement.getID())) {
                IsshoikkaImageStore.emitChange();
            } else {
                IsshoikkaImageActions.loadByArrangement(
                    getCurrentArrangement()
                );
            }
            break;
        default:
            break;
    }
});

export default IsshoikkaImageStore;
