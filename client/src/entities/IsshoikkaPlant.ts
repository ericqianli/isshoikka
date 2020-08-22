/**
 * Copyright 2015-present Isshoikka. All Rights Reserved.
 *
 */

var converter = require("hanyu-pinyin");
var chineseConv = require("chinese-conv");

export default class IsshoikkaPlant {
    _id: number;
    _arrangement_id: number;
    _chineseName: string;
    _japaneseName: string;
    _englishName: string;

    constructor(row: any) {
        this._id = row.id;
        this._arrangement_id = row.arrangement_id;
        this._chineseName = row.chinese_name;
        this._japaneseName = row.japanese_name;
        this._englishName = row.english_name;
    }

    getID(): number {
        return this._id;
    }

    getArrangementID(): number {
        return this._arrangement_id;
    }

    getChineseName(): string {
        return this._chineseName;
    }

    getJapaneseName(): string {
        return this._japaneseName;
    }

    getEnglishName(): string {
        return this._englishName;
    }

    getFirstChinesePinyin(): string {
        if (!this._chineseName || !this._chineseName.length) {
            return "";
        }
        return converter.pinyin(chineseConv.sify(this._chineseName[0]));
    }

    compare(plant: IsshoikkaPlant): number {
        const diff =
            this.getChineseName().length - plant.getChineseName().length;
        if (diff != 0) {
            return diff;
        }
        if (this.getChineseName().length == 0) {
            return 0;
        }
        return this.getFirstChinesePinyin().localeCompare(
            plant.getFirstChinesePinyin()
        );
    }
}
