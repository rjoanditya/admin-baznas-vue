const TOKEN = "token";
const ID = "idUser";

export const getToken = () => {
  return window.localStorage.getItem(TOKEN);
};
export const saveToken = token => {
  window.localStorage.setItem(TOKEN, token);
};
export const destroyToken = () => {
  window.localStorage.removeItem(TOKEN);
};

export const getID = () => {
  return window.localStorage.getItem(ID);
};
export const saveID = id => {
  window.localStorage.setItem(ID, id);
};
export const destroyID = () => {
  window.localStorage.removeItem(ID);
};

export const getName = () => {
  return window.localStorage.getItem("name");
};
export const saveName = name => {
  window.localStorage.setItem("name", name);
};
export const destroyName = () => {
  window.localStorage.removeItem("name");
};

export const getEmail = () => {
  return window.localStorage.getItem("email");
};
export const saveEmail = email => {
  window.localStorage.setItem("email", email);
};
export const destroyEmail = () => {
  window.localStorage.removeItem("email");
};

export const getRole = () => {
  return window.localStorage.getItem("role");
};
export const saveRole = role => {
  window.localStorage.setItem("role", role);
};
export const destroyRole = () => {
  window.localStorage.removeItem("role");
};

export const getVG = () => {
  return window.localStorage.getItem("view_group");
};
export const saveVG = view_group => {
  window.localStorage.setItem("view_group", view_group);
};
export const destroyVG = () => {
  window.localStorage.removeItem("view_group");
};

export const getVC = () => {
  return window.localStorage.getItem("view_cat");
};
export const saveVC = view_cat => {
  window.localStorage.setItem("view_cat", view_cat);
};
export const destroyVC = () => {
  window.localStorage.removeItem("view_cat");
};

export default {
  getToken,
  saveToken,
  destroyToken,
  saveID,
  getID,
  destroyID,
  getName,
  saveName,
  destroyName,
  getEmail,
  saveEmail,
  destroyEmail,
  getRole,
  saveRole,
  destroyRole,
  getVG,
  saveVG,
  destroyVG,
  getVC,
  saveVC,
  destroyVC
};
