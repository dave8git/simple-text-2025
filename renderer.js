const editor = document.getElementById('editor');
editor.textContent = "Type away Bro..." // it's not textbox just div - so to get contents you have to use textContent, not value

let currentFilePath = null;

document.addEventListener('keydown', 
    deBounce(keydownAction, 100)
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
    const filePath = await window.electronAPI.openFile();
    console.log('content', filePath.content);
    editor.textContent = filePath.content;
    return filePath;
}

async function saveFile() {
    const data = editor.textContent;
    const filePath = await window.electronAPI.saveFile(data);
    return filePath;
}

function deBounce(cb, delay) {
    let stId; 
    return (event) => {
        clearTimeout(stId);
        stId = setTimeout(() => cb(event), delay)  // macroTask - funkcja wykona się na końcu kolejki
    }
}

const autoSave = deBounce((content) => {
    console.log('debounced!', content);
}, 1000);

editor.addEventListener("input", (e) => autoSave(e.target.value));