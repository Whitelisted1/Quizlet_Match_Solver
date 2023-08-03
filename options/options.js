async function getData(key){ return new Promise(resolve => { chrome.storage.local.get(key, function (data) { resolve(Object.values(data)[0]); }); }); }
async function storeData(key, value){ await chrome.storage.local.set({[key]: value}); }

async function getMultipleDataValues(keys){ return new Promise(resolve => { chrome.storage.local.get(keys, function (data) { resolve(data); }); }) }
async function storeMultipleDataValues(keys){ await chrome.storage.local.set(keys); }

const STRING_TYPE = 0;
const INTEGER_TYPE = 1;
const BOOL_TYPE = 2;
const ARRAY_TYPE = 3;

const settingsKeys = [
    'defaultTargetTime',
    'accurateTime'
];

const settingsKeyTypes = [
    INTEGER_TYPE,
    BOOL_TYPE
];

const settingsDefaultValues = [
    3000,
    false
];

async function saveSettings() {
    storedSettingsValues = { };

    for (var i = 0; i < settingsKeys.length; i++) {
        thisKey = settingsKeys[i];
        thisType = settingsKeyTypes[i];

        element = document.getElementById(thisKey);

        if (thisType == STRING_TYPE || thisType == INTEGER_TYPE) {
            storedSettingsValues[thisKey] = element.value;
        }
        else if (thisType == BOOL_TYPE) {
            storedSettingsValues[thisKey] = element.checked;
        }
    }


    await storeMultipleDataValues(storedSettingsValues);
}

async function fetchAndDisplaySettings() {
    const settingsValues = await getMultipleDataValues(settingsKeys);

    for (var i = 0; i < settingsKeys.length; i++) {
        thisKey = settingsKeys[i];
        thisType = settingsKeyTypes[i];
        keyValue = settingsValues[thisKey];

        if (keyValue == undefined) {
            thisKeyDefaultValue = settingsDefaultValues[i];
            await storeData(thisKey, thisKeyDefaultValue);
            settingsValues[thisKey] = thisKeyDefaultValue;
            i--;
            continue;
        }

        element = document.getElementById(thisKey);

        element.addEventListener("change", async (e) => {
            thisType = settingsKeyTypes[ settingsKeys.indexOf(e.srcElement.id) ];
            
            if (thisType == STRING_TYPE || thisType == INTEGER_TYPE) {
                await storeData(e.srcElement.id, e.srcElement.value);
            }
            else if (thisType == BOOL_TYPE) {
                await storeData(e.srcElement.id, e.srcElement.checked);
            }
        });

        if (thisType == STRING_TYPE || thisType == INTEGER_TYPE) {
            element.value = keyValue;
        }
        else if (thisType == BOOL_TYPE) {
            element.checked = keyValue;
        }

    }
}

window.addEventListener("load", async () => {
    document.getElementById("resetSettings").addEventListener("click", () => {
        chrome.storage.local.clear();
        fetchAndDisplaySettings();
    });

    // document.getElementById("applySettings").addEventListener("click", () => {
    //     saveSettings();
    // });

    await fetchAndDisplaySettings();
});