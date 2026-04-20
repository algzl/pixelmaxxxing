const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("desktopApp", {
  appName: "pixelmaxxxing"
});
