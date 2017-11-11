/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * File, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
"use strict";

const SETTINGS = [
        "disabledMode",
        "theme"
    ],
    setSetting = (name, val) => browser.storage.local.set({
        [name]: val
    }),
    addListener = (element) => {
        element.addEventListener("change", () => {
            setSetting(element.id, element.value);
        }, {
            passive: true
        });
    };

window.addEventListener("load", () => {
    const getSettings = {};
    for(const setting of SETTINGS) {
        const el = document.getElementById(setting);
        getSettings[setting] = el.value;
        console.log(el.value);
        addListener(el);
    }
    browser.storage.local.get(getSettings).then((settings) => {
        for(const setting in settings) {
            const el = document.getElementById(setting);
            console.log(settings[setting]);
            el.value = settings[setting];
        }
    });
}, {
    passive: true,
    once: true
});
