/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * File, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
"use strict";

const IMAGES = [
        "images/tracking-protection.svg#enabled",
        "images/tracking-protection.svg#disabled"
    ],
    ALTERNATE_IMAGES = [
        "images/tracking-protection-dark.svg#enabled",
        "images/tracking-protection-dark.svg#disabled"
    ],
    TOOLTIPS = [
        "tooltipDisable",
        "tooltipEnable"
    ],
    ENABLED = 0,
    DISABLED = 1,
    ALWAYS_ENABLED = "always",
    setState = async (enabled) => {
        if(enabled === undefined) {
            const { value: mode } = await browser.privacy.websites.trackingProtectionMode.get({});
            enabled = mode !== ALWAYS_ENABLED;
        }

        const index = enabled ? ENABLED : DISABLED;

        const {
            theme,
            disabledMode
        } = await browser.storage.local.get({
            theme: "dark",
            disabledMode: "private_browsing"
        });

        console.log(disabledMode);

        const path = theme === "dark" ? IMAGES[index] : ALTERNATE_IMAGES[index];

        browser.browserAction.setIcon({
            path
        });
        browser.browserAction.setTitle({
            title: browser.i18n.getMessage(TOOLTIPS[index])
        });

        const value = enabled ? ALWAYS_ENABLED : disabledMode;
        browser.privacy.websites.trackingProtectionMode.set({
            value
        });
    };

browser.browserAction.onClicked.addListener(setState);

browser.runtime.onStartup.addListener(() => {
    browser.privacy.websites.trackingProtectionMode.get({}).then(({ value: mode }) => {
        const isEnabled = mode === ALWAYS_ENABLED;
        setState(isEnabled);
    });
});

browser.runtime.onInstalled.addListener(() => {
    browser.privacy.websites.trackingProtectionMode.get({}).then(({ value: mode }) => {
        if(mode !== ALWAYS_ENABLED) {
            browser.storage.local.set({
                disabledMode: mode
            });
        }
    });
});
