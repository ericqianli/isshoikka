/**
 * Copyright 2015-present Isshoikka. All Rights Reserved.
 *
 */

// import TitleImageOneDark from "../images/6-low.jpg";

import AsyncRequest from "../core/AsyncRequest";
import Immutable from "immutable";
import IsshoikkaArrangement from "../entities/IsshoikkaArrangement";
import IsshoikkaImage from "../entities/IsshoikkaImage";
import IsshoikkaPlant from "../entities/IsshoikkaPlant";
import IsshoikkaArrangementActionConstants from "../constants/IsshoikkaArrangementActionConstants";
import IsshoikkaPlantActionConstants from "../constants/IsshoikkaPlantActionConstants";

import * as arrangementsData from "../data/arrangements.json";
import * as plantsData from "../data/plants.json";
import * as arrangementPlantMapData from "../data/arrangement_plant_map.json";

import type { ArrangementList, PlantList } from "./IsshoikkaInitializer";
import type { ImageQuality } from "../entities/IsshoikkaImage";
import type { PlantMap } from "../stores/IsshoikkaPlantStore";

const ISSHOIKKA_PLANT_DB_CONTROLLER_URI =
    "/php/controllers/IsshoikkaPlantDBController.php";
const ISSHOIKKA_MASK_URL = "./images/mask.png";
// const ISSHOIKKA_MASK_URL = process.env.PUBLIC_URL + "/images/mask.png";

function getAsyncRequestPromise(uri: string, data: FormData): Promise<Object> {
    return new Promise((resolve) =>
        new AsyncRequest()
            .setURI(uri)
            .setMethod("POST")
            .setHandler(resolve)
            .send(data)
    );
}

const IsshoikkaDBUtil = {
    getAllArrangements(): Promise<ArrangementList> {
        const arrangements: any[] = (arrangementsData as any).default;

        return new Promise((resolve) =>
            resolve(
                Immutable.List(arrangements).map(
                    (row: any) => new IsshoikkaArrangement(row)
                )
            )
        );
    },

    loadMask(): Promise<void> {
        return new Promise((resolve: any) => {
            let image = new Image();
            image.src = ISSHOIKKA_MASK_URL;
            image.onload = resolve;
        });
    },

    loadImageByArrangement(
        arrangement: IsshoikkaArrangement,
        quality: ImageQuality
    ): Promise<IsshoikkaImage> {
        return new Promise((resolve) => {
            let image = new Image();
            const imageUrl = arrangement.getImageURI(quality);
            console.log("imageUrl", imageUrl);

            image.onload = () => {
                console.log("!!!image loaded");
                const isshoikkaImage = new IsshoikkaImage({
                    arrangement_id: arrangement.getID(),
                    url: imageUrl,
                    width: image.width,
                    height: image.height,
                    quality,
                });
                resolve(isshoikkaImage);
            };

            image.onerror = (error) => {
                console.log("!!!loading image error", error);
            };

            // image.src = require(imageUrl);
            // const ImageSrc = require("../images/6-low.jpg");
            // const ImageSrc = require(imageUrl);
            // image.src = ImageSrc;

            // image.src = import(imageUrl);

            image.src = imageUrl;
        });
    },

    getAllPlants(): Promise<PlantList> {
        const plants: any[] = (plantsData as any).default;

        return new Promise((resolve) =>
            resolve(
                Immutable.List(plants).map(
                    (row: any) => new IsshoikkaPlant(row)
                )
            )
        );
    },

    getAllPlantsWithArrangementID(): Promise<PlantList> {
        const plants: any[] = (plantsData as any).default;
        const plantMap = Immutable.Map(
            plants.map((entry) => [entry.id, entry])
        );

        const arrangementPlantMap: any[] = (arrangementPlantMapData as any)
            .default;

        const plantsWithArrangementIDs: any[] = [];

        for (const { arrangement_id, plant_id } of arrangementPlantMap) {
            plantsWithArrangementIDs.push({
                ...plantMap.get(plant_id),
                arrangement_id,
            });
        }

        return new Promise((resolve) =>
            resolve(
                Immutable.List(plantsWithArrangementIDs).map(
                    (row: any) => new IsshoikkaPlant(row)
                )
            )
        );
    },

    getPlantListPromise(action: string): Promise<PlantList> {
        let data = new FormData();
        data.append("action", action);
        return getAsyncRequestPromise(
            ISSHOIKKA_PLANT_DB_CONTROLLER_URI,
            data
        ).then((response: any) => {
            if (!response || !response.payload) {
                return Immutable.List();
            }
            return Immutable.List(
                response.payload.map((row: any) => new IsshoikkaPlant(row))
            );
        });
    },

    getPlantMap(): Promise<PlantMap> {
        return this.getAllPlants().then((plantList) => {
            return Immutable.Map(
                plantList
                    .groupBy((plant) => plant.getID())
                    .map((plantCollection) => plantCollection.toList())
            );
        });
    },

    getPlantsByArrangement(
        arrangementID: string
    ): Promise<Immutable.Map<string, IsshoikkaPlant>> {
        let data = new FormData();
        data.append(
            "action",
            IsshoikkaPlantActionConstants.LOAD_BY_ARRANGEMENT_ID
        );
        data.append("arrangement_id", arrangementID);

        return getAsyncRequestPromise(
            ISSHOIKKA_PLANT_DB_CONTROLLER_URI,
            data
        ).then((response: any) => {
            if (!response || !response.payload) {
                return Immutable.Map();
            }
            return Immutable.Map(
                response.payload.map((row: any) => [
                    row.id,
                    new IsshoikkaPlant(row),
                ])
            );
        });
    },
};

export default IsshoikkaDBUtil;
