import axios from "./../redux/_actions/axios_base";

export async function getVariablesConfig() {
  return axios.async({
    url: "/netd-api/api/variables-config",
    method: "get"
  });
}

export async function editVariablesConfig(variable) {
  return axios.async({
    url: "/netd-api/api/variables-config/" + variable.id,
    method: "put",
    data: {
      value: variable.variables_value,
      description: variable.variables_description.trim()
    }
  });
}

export async function getRecommendDevices() {
  return axios.async({
    url: "/netd-api/api/recommend-devices-tool-cgnat",
    method: "get"
  });
}

export async function getLogConfig() {
  return axios.async({
    url: "/netd-api/api/log-config-tool-cgnat",
    method: "get"
  });
}

export async function createLogConfig(message, type, times) {
  return axios.async({
    url: "/netd-api/api/log-config-tool-cgnat",
    method: "post",
    data: {
      message: message.trim(),
      type,
      times
    }
  });
}

export async function editLogConfig(message, type, times, id) {
  return axios.async({
    url: "/netd-api/api/log-config-tool-cgnat/" + id,
    method: "put",
    data: {
      message: message.trim(),
      type,
      times
    }
  });
}

export async function deleteLogConfig(id) {
  return axios.async({
    url: "/netd-api/api/log-config-tool-cgnat/" + id,
    method: "delete"
  });
}

export async function getHistory() {
  return axios.async({
    url: "/netd-api/api/histories-tool-cgnat",
    method: "get"
  });
}

export async function getErrorLog() {
  return axios.async({
    url: "/netd-api/api/error-logs-tool-cgnat",
    method: "get"
  });
}

export async function getDevices() {
  return axios.async({
    url: "/netd-api/api/devices-tool-cgnat",
    method: "get"
  });
}

export async function createDevice(name, ip, status) {
  return axios.async({
    url: "/netd-api/api/devices-tool-cgnat",
    method: "post",
    data: {
      name: name.trim(),
      ip: ip.trim(),
      status
    }
  });
}

export async function editDevice(id, name, ip) {
  return axios.async({
    url: "/netd-api/api/devices-tool-cgnat/" + id,
    method: "put",
    data: {
      name: name.trim(),
      ip: ip.trim()
    }
  });
}

export async function deleteDevice(id) {
  return axios.async({
    url: "/netd-api/api/devices-tool-cgnat/" + id,
    method: "delete"
  });
}

export async function changeStatus(currentStatus, id) {
  return axios.async({
    url: "/netd-api/api/status-devices-tool-cgnat/" + id,
    method: "put",
    data: {
      currentStatus
    }
  });
}

export async function changeStatusSchedule(from, to, active, id) {
  return axios.async({
    url: "/netd-api/api/status-devices-tool-cgnat/" + id,
    method: "patch",
    data: {
      from,
      to,
      active
    }
  });
}
