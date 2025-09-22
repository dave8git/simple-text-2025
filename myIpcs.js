const { ipcMain, dialog } = require('electron');
const fs = require('fs');

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

    ipcMain.handle('saveFile', async (event, data) => {
        try {
            const { canceled, filePath } = await dialog.showSaveDialog({
                filters: [
                    { name: 'Text Files', extensions: ['txt', 'md'] }
                ]
            });
            console.log('filePath IPC', filePath);
            
            if (!canceled && filePath) {
                await fs.promises.writeFile(filePath, data);
                return filePath;
            }
        } catch (err) {
            console.log('err', err);
        }
        // const result = await dialog.showSaveDialog({
        
        // });
        //console.log('saveFile from IPC', filePath);

    });



    // try { 
    //     await fs.writeFile(filePath, )
    // }

}

module.exports = { registerFileDialogHandler };