/**
 * Copyright 2015-present Isshoikka. All Rights Reserved.
 *
 */

import invariant from "invariant";

const READY_STATE_CHANGE_EVENT = "readystatechange";

type Method = "GET" | "POST";
type Handler = (response: any) => void;

export default class AsyncRequest {
    // TODO: add error handler.
    // TODO: add params.

    _xhr: XMLHttpRequest | null;
    _uri: string | null = null;
    _method: Method;
    _handler: Handler | null = null;

    constructor() {
        this._xhr = new XMLHttpRequest();
        this._method = "GET";
    }

    setURI(uri: string): AsyncRequest {
        this._uri = uri;
        return this;
    }

    setMethod(method: Method): AsyncRequest {
        this._method = method;
        return this;
    }

    setHandler(handler: Handler): AsyncRequest {
        this._handler = handler;
        return this;
    }

    send(data: FormData) {
        invariant(this._xhr != null, "XMLHttpRequest must be initialized.");
        invariant(this._uri != null, "URI must be non-null.");
        const xhr = this._xhr as XMLHttpRequest;
        const uri = this._uri as string;
        xhr.open(this._method, uri, true);
        xhr.onload = (_event: Event) => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    const payload = JSON.parse(xhr.responseText);
                    const response = {
                        status: "success",
                        payload,
                    };
                    if (this._handler != null) {
                        this._handler(response);
                    }
                } else {
                    console.error(xhr.statusText);
                }
            }
        };
        xhr.onerror = function (event: Event) {
            console.error(xhr.statusText);
        };
        xhr.send(data);
    }
}
