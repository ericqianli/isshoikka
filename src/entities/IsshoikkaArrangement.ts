/**
 * Copyright 2015-present Isshoikka. All Rights Reserved.
 *
 */

import Immutable from "immutable";

import type { ImageQuality } from "./IsshoikkaImage";
import type { Point } from "../components/Fan";

const IMAGE_PATH = "./images/";
// const IMAGE_PATH = process.env.PUBLIC_URL + "/images/";


export default class IsshoikkaArrangement {
    _id: number;
    _date: string;
    _config: Immutable.Map<string, any>;

    constructor(row: any) {
        this._id = Number(row.id);
        this._date = row.date;
        this._config = Immutable.Map(JSON.parse(row.config));
    }

    getID(): number {
        return this._id;
    }

    getDate(): string {
        return this._date;
    }

    getConfig(): Immutable.Map<string, any> {
        return this._config;
    }

    getImageURI(quality: ImageQuality): string {
        switch (quality) {
            case "low":
                return IMAGE_PATH + this._id + "-low.jpg";
            case "high":
            default:
                return IMAGE_PATH + this._id + ".jpg";
        }
    }

    getImageOffset(): Point {
        let x = this._config.get("offsetX");
        x = x != null ? x : 0.5;
        let y = this._config.get("offsetY");
        y = y != null ? y : 0.5;
        return {
            x,
            y,
        };
    }
}
