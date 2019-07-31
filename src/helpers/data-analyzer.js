import {customRoundUp} from "./math";
import constants from '../constants/analyzer';

//list of mp to filter
//item to filter
//mpNameField: field name of mpName
//mpGroupField: field name of mpGroup
//return index of item in group and items of same group {idx : -1, list : []}

export const getSameMpSubSubGroupList = function (list, item, mpNameField, mpGroupField) {
    let groupName = item[mpGroupField];
    let mpName = item[mpNameField];
    let res = {idx: -1, list: []};

    for (let i = 0; i < list.length; i++) {
        let element = list[i];

        if (groupName.includes("HNI-MP") || groupName.includes("HCM-MP") || groupName.includes('KGG-MP')) {
            let inGroupCondition = (element[mpNameField].includes(groupName) == true);
            //HNI-MP-01-01
            //HNI-MP-01-02
            //["HNI", "MP", "01", "01"]

            let listSplitItemName = mpName.split("-");
            let listSplitName = element[mpNameField].split("-");
            if (listSplitItemName.length < 4 || listSplitName.length < 4) {
                return {idx: 0, list: [item]}
            }
            let subGroupCondition = (listSplitItemName[2] == listSplitName[2]);
            let subSubGroupItem = parseInt(listSplitItemName[3]);
            let subSubGroup = parseInt(listSplitName[3]);
            let subSubGroupCondition = false;
            if (subSubGroupItem % 2 == 0 && (subSubGroup == subSubGroupItem - 1 || subSubGroup == subSubGroupItem)) {
                subSubGroupCondition = true;
            }
            else {
                if (subSubGroupItem % 2 == 1 && (subSubGroup == subSubGroupItem + 1 || subSubGroup == subSubGroupItem)) {
                    subSubGroupCondition = true;
                }
            }

            if (inGroupCondition && subGroupCondition && subSubGroupCondition) {
                res.list.push(element);
            }
        }
        else if (element[mpNameField].includes(groupName)) {
            res.list.push(element);
        }
    }

    for (let [idx, e] of res.list.entries()) {
        if (item[mpNameField] == e[mpNameField])
            res.idx = idx;
    }

    return res;
};

export const isGreaterWaringStatus = function isGreaterWaringStatus(a, b) {
    let m = {};
    m[constants.WARNING_STATUS.NORMAL] = 0;
    m[constants.WARNING_STATUS.WARNING] = 1;
    m[constants.WARNING_STATUS.CRITICAL] = 2;

    return m[a] > m[b];
};



