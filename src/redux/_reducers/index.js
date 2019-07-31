import { combineReducers } from 'redux';
import { sideMenuR } from './sideMenuR';
import { routes } from './admin/routeR';
import { roles } from './admin/roleR';
import { groups } from './admin/groupR';
import { users } from './admin/userR';
import { locations } from './categories/locationR';
import { datacenters } from './categories/datacenterR';
import { rooms } from './categories/roomR';
import { zones } from './categories/zoneR';
import { customers } from './categories/customerR';
import { departments } from './categories/departmentR';
import { deviceTypes } from './categories/deviceTypeR';
import { regions } from './categories/regionR';
import { deviceTemplates } from './categories/deviceTemplateR';
import { racks } from './categories/rackR';
import { layouts } from './layoutR';
import { alerts } from './alertR';
import { groupMPList } from './groupMP/groupMPListR';
import { groupMPTopos } from './groupMP/groupMPToposR';
import { groupMPParts } from './groupMP/groupMPPartsR';
import { groupMPSummary } from './groupMP/groupMPSummaryR';
import { netDevices} from './devices/devicesR';
import { cgnatPrefer } from './cgnat/cgnatPreferR';
import { cgnatSummary } from "./cgnat/cgnatSummaryR";
import {iplcTrafficStatistics} from "./iplc/trafficStatisticsR";
import {iplcTrafficChart} from "./iplc/trafficChartR";
import { addNewDevicePageData } from "./devices/addNewDeviceR";
import { netDeviceFunctions } from "./devices/functionListR";
import { netAreasAndRooms } from "./devices/areasAndRoomsR";
import { netData } from "./netData/netDataR";
import { autoBalancingTransitPeering } from "./autoBalancingTransitPeering/autoBalancingTransitPeering";
import { autoBalancingIPLC } from "./autoBalancingIPLC/autoBalancingIPLC";
import { toolCgnatDevices } from "./tool-cgnat/devicesR"
import { toolCgnatErrorLog } from "./tool-cgnat/errorLogR";
import { toolCgnatRecommendDevices } from "./tool-cgnat/recommendDevicesR";
import { toolCgnatHistory } from "./tool-cgnat/historyR";
import { toolCgnatLogConfig } from "./tool-cgnat/logConfigR";
import { removePortsPageData } from "./devices/removePortsR";
import { toolCgnatVariablesConfig } from "./tool-cgnat/variablesConfigR";
import { warehouse } from "./devices/warehouseR";

const appReducers = combineReducers({
    sideMenuR,
    routes,
    roles,
    groups,
    users,
    alerts,
    locations,
    datacenters,
    rooms,
    zones,
    customers,
    departments,
    regions,
    deviceTypes,
    deviceTemplates,
    layouts,
    racks,
    groupMPList,
    groupMPTopos,
    groupMPParts,
    groupMPSummary,
    netDevices,
    cgnatPrefer,
    cgnatSummary,
    addNewDevicePageData,
    iplcTrafficStatistics,
    netData,
    autoBalancingTransitPeering,
    autoBalancingIPLC,
    toolCgnatDevices,
    toolCgnatErrorLog,
    toolCgnatRecommendDevices,
    toolCgnatHistory,
    toolCgnatLogConfig,
    removePortsPageData,
    netDeviceFunctions,
    netAreasAndRooms,
    toolCgnatVariablesConfig,
    warehouse,
    iplcTrafficChart
});

export default appReducers;