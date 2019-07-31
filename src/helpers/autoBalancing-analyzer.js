export const getAllIrbName = function (data, type) {
    let listIrbName = [];
    let listOptions = [];
    for (let item of data) {
        for (let irb of item.data) {
            if (irb.type !== type) {
                continue;
            }
            if (!listIrbName.includes(irb.irbDetail)) {
                listIrbName.push(irb.irbDetail);
                listOptions.push({
                    key: irb.irbDetail,
                    text: irb.irbDetail,
                    value: irb.irbDetail,
                });
            }
        }
    }
    return listOptions
};

export const getDataForGraph = function (data, irbName) {
        let generalData = {
            date: [],
            data: []
        };
        for (let item of data) {
            generalData.date.push(item.time);
            for (let irb of item.data) {
                if(!irb.irbName){
                    continue;
                }
                let add = false;
                for(let miniItem of generalData.data){
                    if (miniItem.irbName === irb.irbName && miniItem.irbDetail === irb.irbDetail){
                        miniItem.listPercentTrafficIn.push(irb.percentTrafficIn);
                        miniItem.listPercentTrafficOut.push(irb.percentTrafficOut);
                        miniItem.time = irb.time;
                        add = true;
                    }
                }
                if(!add){
                    generalData.data.push({
                        irbName: irb.irbName,
                        listPercentTrafficIn: [irb.percentTrafficIn],
                        listPercentTrafficOut: [irb.percentTrafficOut],
                        irbDetail: irb.irbDetail,
                        time: [irb.time]
                    });
                    continue;
                }

            }

        }
        return generalData
    };