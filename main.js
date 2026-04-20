const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const iconPath =
    process.platform === "win32"
      ? path.join(__dirname, "assets", "icon.ico")
      : path.join(__dirname, "assets", "icon.png");

  const mainWindow = new BrowserWindow({
    width: 1100,
    height: 760,
    minWidth: 900,
    minHeight: 620,
    backgroundColor: "#f6efe4",
    icon: iconPath,
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    }
  });

  mainWindow.loadFile("index.html");
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
