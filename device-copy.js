function deviceCopyControl(label, value) {
    const group = document.createElement('div');
    const field = document.createElement('input');
    field.type = 'text';
    field.readOnly = true;
    field.value = value;
    field.setAttribute('aria-label', label);
    field.style.cssText = 'display:block;width:100%;background:transparent;color:inherit;user-select:text;-webkit-user-select:text';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'underline py-1';
    button.textContent = 'Copy ' + label;
    const status = document.createElement('span');
    status.setAttribute('role', 'status');
    button.onclick = async () => {
        let copied = false;
        try {
            await navigator.clipboard.writeText(value);
            copied = true;
        } catch {
            field.focus();
            field.select();
            field.setSelectionRange(0, field.value.length);
            try { copied = document.execCommand('copy'); } catch {}
        }
        status.textContent = copied ? ' Copied' : ' Long-press the selected text and tap Copy.';
    };
    group.append(field, button, status);
    return group;
}
