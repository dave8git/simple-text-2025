const editor = document.getElementById('editor');
editor.textContent = "Type away Bro..." // it's not textbox just div - so to get contents you have to use textContent, not value

let currentFilePath = null;

document.addEventListener('keydown',
    deBounce(keydownAction, 100)
)

editor.addEventListener("input",
    deBounce(saveFile, 1000)
)

async function keydownAction(event) {
    if (event.ctrlKey && event.key.toLowerCase() === 'o') {
        event.preventDefault();
        await openFile();
    }
    if (event.ctrlKey && event.key.toLowerCase() === 's') {
        event.preventDefault();
        await saveFile();
    }
}

async function openFile() {
    const result = await window.electronAPI.openFile(); // funkcja open file zwraca obiekt: { success: true, path: filePaths[0], content }
    if(result && result.success) {
        editor.textContent = result.content;
        currentFilePath = result.path;
    }
    
}

async function saveFile() {
    const data = editor.textContent;

    if (!currentFilePath) {
        const result = await window.electronAPI.manualSave(data);
        if (result) {
            currentFilePath = result;
            return result;
        } else {
            return null;
        }
    } else {
        const result = await window.electronAPI.autoSave(currentFilePath, data);
        if (result) {
            return result;
        } else {
            return null;
        }
    }
}

function deBounce(cb, delay) {
    let stId;
    return (...args) => {
        clearTimeout(stId);
        stId = setTimeout(() => cb(...args), delay)  // macroTask - funkcja wykona się na końcu kolejki
    }
}