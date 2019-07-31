import axios from "./../redux/_actions/axios_base";
import { toast } from "react-toastify";

export async function getNetRoomsByAreaId(areaId) {
  const resq = await axios.async({
    url: "/netd-api/api/net-rooms",
    method: "get",
    params: {
      areaId
    }
  });

  if (resq.status === 200 && resq.data.status === 200) {
    return resq.data.data;
  } else {
    throw new Error("status code is not valid");
  }
}

export async function getNetFunctions() {
  const resq = await axios.async({
    url: "/netd-api/api/net-device-functions",
    method: "get",
    params: {}
  });

  if (resq.status === 200 && resq.data.status === 200) {
    return resq.data.data;
  } else {
    throw new Error("status code is not valid");
  }
}

export async function getNetAreas() {
  const resq = await axios.async({
    url: "/netd-api/api/net-areas",
    method: "get",
    params: {}
  });

  if (resq.status === 200 && resq.data.status === 200) {
    return resq.data.data;
  } else {
    throw new Error("status code is not valid");
  }
}

export async function getAddDeviceToOpsviewLogOnDate(date) {
  const resq = await axios.async({
    url: "/netd-api/api/add-device-to-opsview-logs",
    method: "get",
    params: {
      date
    }
  });

  if (resq.status === 200 && resq.data.status === 200) {
    return resq.data.data;
  } else {
    throw new Error("status code is not valid");
  }
}

export async function getRemovePortsFromOpsviewLogOnDate(date) {
  const resq = await axios.async({
    url: "/netd-api/api/remove-ports-from-opsview-logs",
    method: "get",
    params: {
      date
    }
  });

  if (resq.status === 200 && resq.data.status === 200) {
    return resq.data.data;
  } else {
    throw new Error("status code is not valid");
  }
}

export async function getIplcTrafficOnTime(time) {
  const resq = await axios.async({
    url: "/netd-api/api/iplc-traffic",
    method: "get",
    params: {
      time
    }
  });

  if (resq.status === 200 && resq.data.status === 200) {
    return resq.data.data;
  } else {
    throw new Error("status code is not valid");
  }
}

export async function getIplcTrafficTimesOnDate(date) {
  const resq = await axios.async({
    url: "/netd-api/api/iplc-traffic-times",
    method: "get",
    params: {
      date
    }
  });

  if (resq.status === 200 && resq.data.status === 200) {
    return resq.data.data;
  } else {
    throw new Error("status code is not valid");
  }
}

export async function getIplcTrafficChartOnRange(payload) {

  const resq = await axios.async({
    url: "/netd-api/api/iplc-traffic-chart-data-on-range",
    method: "get",
    params: payload
  });

  if (resq.status === 200 && resq.data.status === 200) {
    return resq.data.data;
  } else {
    throw new Error("status code is not valid");
  }
}

export async function editNetDevice(device) {
  const deviceId = device.deviceId;
  delete device.deviceId;

  const resq = await axios.async({
    url: "/netd-api/api/net-devices/" + deviceId,
    method: "patch",
    data: {
      ...device
    }
  });

  if (resq.status === 200 && resq.data.status === 200) {
    return true;
  } else {
    throw new Error("status code is not valid");
  }
}

export async function deleteNetDevice(device) {
  const deviceId = device.deviceId;
  delete device.deviceId;

  return await axios.async({
    url: "/netd-api/api/net-devices/" + deviceId,
    method: "delete",
    data: {
      ...device
    }
  });
}

export async function getOnlineNetDevices() {
  const resq = await axios.async({
    url: "/netd-api/api/net-devices",
    method: "get"
  });

  if (resq.status === 200 && resq.data.status === 200) {
    return resq.data.data;
  } else {
    throw new Error("status code is not valid");
  }
}

export async function createNetDeviceFunction(name, note) {
  const data = {
    name: name.trim(),
    note: note.trim()
  };
  return axios.async({
    url: "/netd-api/api/net-device-functions",
    method: "post",
    data: data
  });
}

export async function editNetDeviceFunction(id, name, note) {
  const data = {
    name: name.trim(),
    note: note.trim()
  };

  return axios.async({
    url: "/netd-api/api/net-device-functions/" + id,
    method: "put",
    data: data
  });
}

export async function deleteNetDeviceFunction(id) {
  return axios.async({
    url: "/netd-api/api/net-device-functions/" + id,
    method: "delete"
  });
}

export async function createNetArea(name) {
  const data = {
    name: name.trim()
  };

  return axios.async({
    url: "/netd-api/api/net-areas",
    method: "post",
    data: data
  });
}

export async function editNetArea(name, id) {
  const data = {
    name: name.trim()
  };

  return axios.async({
    url: "/netd-api/api/net-areas/" + id,
    method: "put",
    data: data
  });
}

export async function deleteNetArea(id) {
  return axios.async({
    url: "/netd-api/api/net-areas/" + id,
    method: "delete"
  });
}

export async function createNetRoom(name, address, areaId, warehouseId) {
  const data = {
    name: name.trim(),
    address: address.trim(),
    id: areaId,
    warehouseId
  };

  return axios.async({
    url: "/netd-api/api/net-rooms",
    method: "post",
    data: data
  });
}

export async function editNetRoom(name, address, id, warehouseId) {
  const data = {
    name: name.trim(),
    address: address.trim(),
    warehouseId
  };

  return axios.async({
    url: "/netd-api/api/net-rooms/" + id,
    method: "put",
    data: data
  });
}

export async function deleteNetRoom(id) {
  return axios.async({
    url: "/netd-api/api/net-rooms/" + id,
    method: "delete"
  });
}

export async function getWarehouses() {
  const resq = await axios.async({
    url: "/netd-api/api/warehouses",
    method: "get"
  });

  if (resq.status === 200 && resq.data.status === 200) {
    return resq.data.data;
  } else {
    throw new Error("status code is not valid");
  }
}

export async function createWarehouse(code, name) {
  return axios.async({
    url: "/netd-api/api/warehouses",
    method: "post",
    data: {
      code: code.trim(),
      name: name.trim()
    }
  });
}

export async function editWarehouse(id, code, name) {
  return axios.async({
    url: "/netd-api/api/warehouses/" + id,
    method: "put",
    data: {
      code: code.trim(),
      name: name.trim()
    }
  });
}

export async function deleteWarehouse(id) {
  return axios.async({
    url: "/netd-api/api/warehouses/" + id,
    method: "delete"
  });
}
