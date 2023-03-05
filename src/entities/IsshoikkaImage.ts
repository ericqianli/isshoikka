/**
 * Copyright 2015-present Isshoikka. All Rights Reserved.
 *
 */

import type { Dimension } from "../components/Fan";

export type ImageQuality = "low" | "high";

export default class IsshoikkaImage {
    _arrangement_id: number;
    _url: string;
    _dimension: Dimension;
    _quality: ImageQuality;

    constructor(row: any) {
        this._arrangement_id = row.arrangement_id;
        this._url = row.url.toString();
        this._dimension = {
            width: parseInt(row.width),
            height: parseInt(row.height),
        };
        this._quality = row.quality;
    }

    getArrangementID(): number {
        return this._arrangement_id;
    }

    getUrl(): string {
        return this._url;
    }

    getCoverUrl(): string {
        return "/images/" + this._arrangement_id + ".png";
    }

    getDimension(): Dimension {
        return this._dimension;
    }

    getQuality(): ImageQuality {
        return this._quality;
    }
}
