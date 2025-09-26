const { ipcMain, dialog } = require('electron');
const fs = require('fs');

async function saveToFile(filePath, data) {
    await fs.promises.writeFile(filePath, data);
    return filePath;
}

function registerFileDialogHandler() {
    ipcMain.handle('openFile', async () => {
        const { canceled, filePaths } = await dialog.showOpenDialog({
            properties: ['openFile']
        });

        console.log('filePaths', filePaths);
        console.log('file content', fs.readFileSync(filePaths[0], 'utf-8'));

        if (!canceled && filePaths.length > 0) {
            const content = fs.readFileSync(filePaths[0], 'utf-8');
            console.log('content', content);
            return { success: true, path: filePaths[0], content };


        }
    });

    ipcMain.handle("manualSave", async (event, data) => {
        {
            try {
                const { canceled, filePath } = await dialog.showSaveDialog({
                    filters: [
                        { name: 'Text Files', extensions: ['txt', 'md'] }
                    ]
                });
                if (!canceled && filePath) {
                    await fs.promises.writeFile(filePath, data);
                    return filePath;
                }
            } catch (err) {
                console.log('err', err);
            }

        }
    });

    ipcMain.handle("autoSave", async (event, { filePath, data }) => {
        console.log('autosave')
        try {
            if(filePath) {
                return await saveToFile(filePath, data);
            }
            return null;
        } catch (err) {
            console.log("autoSave error:", err);
            return null;
        }
    })
    // ipcMain.handle('saveFile', async (event, data) => {
    //     try {
    //         const { canceled, filePath } = await dialog.showSaveDialog({
    //             filters: [
    //                 { name: 'Text Files', extensions: ['txt', 'md'] }
    //             ]
    //         });
    //         console.log('filePath IPC', filePath);

    //         if (!canceled && filePath) {
    //             await fs.promises.writeFile(filePath, data);
    //             return filePath;
    //         }
    //     } catch (err) {
    //         console.log('err', err);
    //     }
    // });
}

module.exports = { registerFileDialogHandler };