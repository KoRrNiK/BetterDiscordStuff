import React, {useReducer} from "react";
import Settings from "../settings";
// @ts-ignore
import Category from "common/components/category";
import {WebpackModules} from "@zlibrary";
import {FormDivider, FormItem, FormText} from "@discord/forms";
import styles from "./settings.scss";

const SwitchItem = WebpackModules.getByDisplayName("SwitchItem");
const RadioGroup = WebpackModules.getByDisplayName("RadioGroup");
const SettingsOptions = [
    {
        type: "switch",
        name: "Show Updates",
        note: "Shows updates about sessions.",
        id: "showUpdates",
        value: true
    },
    {
        type: "category",
        name: "Updates",
        items: [
            {
                id: "noticeType",
                name: "Notice Type",
                note: "Shows a desktop/toast notification when an update has triggered. Won't show the modal without being manually opened.",
                type: "radio",
                value: 1,
                requires: ["showUpdates"],
                options: [
                    {
                        name: "Desktop Notifications",
                        desc: "Shows a normal desktop notification.",
                        value: 1
                    },
                    {
                        name: "Toast Notification",
                        desc: "Shows a normal toast. Note: this only stays temporarily!",
                        value: 2
                    },
                    {
                        name: "Prompt Modal",
                        desc: "Shows a modal with updates about your account's sessions.",
                        value: 3
                    }
                ]
            },
            {
                id: "showActivityUpdate",
                name: "Activity Update",
                note: "Shows a notice when the activity of a session has updated.",
                type: "switch",
                value: true,
                requires: ["showUpdates"]
            },
            {
                id: "showAdd",
                name: "Session Add",
                note: "Shows a notice when a session was added.",
                type: "switch",
                value: true,
                requires: ["showUpdates"]
            },
            {
                id: "showRemove",
                name: "Session Remove",
                note: "Shows a notice when a session was removed/closed.",
                type: "switch",
                value: true,
                requires: ["showUpdates"]
            }
        ]
    }
];

export function renderSetting(setting, forceUpdate) {
    switch (setting.type) {
        case "switch": return (
            <SwitchItem
                {...setting}
                children={setting.name}
                value={Settings.get(setting.id, setting.value)}
                disabled={setting.requires ? !setting.requires.every(id => Settings.get(id, true)) : false}
                onChange={value => {
                    Settings.set(setting.id, value);
                    forceUpdate();
                }}
            />
        );
        case "category": return (
            <Category
                look={Category.Looks.COMPACT}
                label={setting.name}
                key={setting.name}
            >
                {setting.items.map(item => renderSetting(item, forceUpdate))}
            </Category>
        );
        case "radio": return (
            <React.Fragment>
                <FormItem title={setting.name}>
                    <FormText type="description" className={styles.marginBottom8}>{setting.note}</FormText>
                    <RadioGroup
                        {...setting}
                        value={Settings.get(setting.id, setting.value)}
                        disabled={setting.requires ? !setting.requires.every(id => Settings.get(id, true)) : false}
                        onChange={({value}) => {
                            Settings.set(setting.id, value)
                            forceUpdate();
                        }}
                    />
                </FormItem>
                <FormDivider className={styles.divider} />
            </React.Fragment>
        );
    }
}

export default function SettingsPanel() {
    const [, forceUpdate] = useReducer(n => !n, true);

    return (
        <React.Fragment>
            {SettingsOptions.map(setting => renderSetting(setting, forceUpdate))}
        </React.Fragment>
    );
};