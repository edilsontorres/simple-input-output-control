const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const kill = require('tree-kill');

let backendProcess;
let nodeExecutablePath;
let backendScriptToRun;
let backendRootPath;
let backendScriptPath;

function logDebud(message) {
  if (!app.isPackaged) {
    console.log(`[Electron Debug]: ${message}`)
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    icon: path.join(__dirname, 'notebook.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  Menu.setApplicationMenu(null);
  
  win.loadFile(path.join(__dirname, 'dist', 'index.html'));
  if (!app.isPackaged) {
    win.webContents.openDevTools();
  }
}

function startBackend() {
  if (app.isPackaged) {
    backendRootPath = path.join(process.resourcesPath, 'backend');
    nodeExecutablePath = path.join(process.resourcesPath, 'node', 'node');
  } else {
    backendRootPath = path.join(__dirname, '..', 'backend');
    nodeExecutablePath = 'node';
  }

  backendScriptPath = path.join(backendRootPath, 'dist', 'index.js');
  backendScriptToRun = path.join(backendRootPath, 'dist', 'index.js');

  const userDataPath = app.getPath('userData');
  const databaseFilePath = path.join(userDataPath, 'database.sqlite');

  backendProcess = spawn(nodeExecutablePath, [backendScriptToRun], {
    cwd: backendRootPath,
    stdio: 'pipe',
    shell: false,
    env: {
      ...process.env,
      DATABASE_PATH: databaseFilePath
    }
  });

  logDebud(`Usando Node.js de: ${nodeExecutablePath}`);
  logDebud(`Diretório Raiz do Backend: ${backendRootPath}`);
  logDebud(`Script do Backend a ser executado: ${backendScriptPath}`);
  logDebud(`Caminho do Banco de Dados SQLite: ${databaseFilePath}`);

  backendProcess.on('error', (err) => {
    logError(`Erro ao iniciar o backend: ${err.message}`);
    logError(`Causa provável: '${nodeExecutablePath}' não encontrado ou não executável.`);
    logError(`Caminho do Node configurado: ${nodeExecutablePath}`);
    logError(`Caminho do Backend configurado: ${backendRootPath}`);
    logError(`Script do Backend tentado: ${backendScriptPath}`);
    logError(`Código de erro: ${err.code}`);
    logError(`Mensagem de erro: ${err.message}`);
  });

  backendProcess.stdout.on('data', (data) => {
    console.log(`[Backend STDOUT]: ${data.toString().trim()}`);
  });
  backendProcess.stderr.on('data', (data) => {
    console.error(`[Backend STDERR]: ${data.toString().trim()}`);
  });
  backendProcess.on('exit', (code, signal) => {
    console.log(`[Backend INFO] Processo do backend encerrado com código ${code} e sinal ${signal}`);
  })
}

function killBackendAndQuit() {
  if (backendProcess && backendProcess.pid) {
    console.log(`Encerrando backend (PID: ${backendProcess.pid})...`);
    kill(backendProcess.pid, 'SIGKILL', (err) => {
      if (err) {
        console.error("Erro ao finalizar backend:", err);
      } else {
        console.log("Backend encerrado com sucesso!");
      }
      app.exit();
    });
  } else {
    console.log("Nenhum processo backend encontrado para encerrar.");
    app.exit();
  }
}

app.whenReady().then(() => {
  startBackend();
  createWindow();
});

app.on('window-all-closed', () => {
  killBackendAndQuit();
});

app.on('before-quit', (e) => {
  e.preventDefault();
  killBackendAndQuit();
});