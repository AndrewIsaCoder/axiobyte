const fs = require('fs');
const jsPath = 'd:/PROGRAMARE/Axiobyte/js/main.js';

const securityCode = `
/* ==========================================================================
   16. SECURITY SHIELD (Anti-Copy / Anti-Inspect)
   ========================================================================== */
(function() {
    // 1. Block Right-Click
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });

    // 2. Block Keyboard Shortcuts (F12, Ctrl+Shift+I, Ctrl+U, etc.)
    document.addEventListener('keydown', function(e) {
        // F12
        if (e.keyCode === 123) {
            e.preventDefault();
            return false;
        }
        // Ctrl+Shift+I / Cmd+Option+I (Inspect)
        if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
            e.preventDefault();
            return false;
        }
        // Ctrl+Shift+J / Cmd+Option+J (Console)
        if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
            e.preventDefault();
            return false;
        }
        // Ctrl+U / Cmd+U (View Source)
        if (e.ctrlKey && e.keyCode === 85) {
            e.preventDefault();
            return false;
        }
        // Ctrl+S / Cmd+S (Save Page)
        if (e.ctrlKey && e.keyCode === 83) {
            e.preventDefault();
            return false;
        }
    });

    // 3. Prevent text selection globally (optional but good for anti-copy)
    document.addEventListener('selectstart', function(e) {
        // Allow text selection inside the contact form inputs
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
        }
    });

    // 4. Anti-Debugger Trap (Fires if console is forcefully opened)
    setInterval(function() {
        var before = new Date().getTime();
        debugger;
        var after = new Date().getTime();
        if (after - before > 100) {
            // DevTools is open and paused on debugger. 
            // We clear the body as punishment.
            document.body.innerHTML = '<div style="background:#050505;color:#d4d4d4;height:100vh;width:100%;display:flex;align-items:center;justify-content:center;font-family:monospace;font-size:18px;">[ AXIOBYTE ] RESTRICTED ENVIRONMENT.</div>';
        }
    }, 2000);
})();
`;

fs.appendFileSync(jsPath, '\n' + securityCode);
console.log('Security shield appended.');
