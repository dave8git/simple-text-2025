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
            const result = await window.electronAPI.manualSave(editor.textContent);
            if (result) {
                currentFilePath = result;
                console.log("File manually saved:", result);
            }
        }
}

async function openFile() {
    currentFilePath = await window.electronAPI.openFile();
    console.log('content', currentFilePath);
    editor.textContent = currentFilePath.content;
}

async function saveFile() {
    console.log('autoSave')
    const data = editor.textContent;
    await window.electronAPI.autoSave(currentFilePath, data);
}

function deBounce(cb, delay) {
    let stId; 
    return (...args) => {
        clearTimeout(stId);
        stId = setTimeout(() => cb(...args), delay)  // macroTask - funkcja wykona się na końcu kolejki
    }
}