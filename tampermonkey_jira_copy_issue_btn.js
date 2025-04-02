// ==UserScript==
// @name         Jira Copy Issue Key as Rich Text
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Adds a copy button next to the Jira issue key to copy it as rich text (with a hyperlink).
// @author       You
// @include       /^https:\/\/issues.apache.org\/jira\/browse\/[A-Z]+-\d+\\??.*/
// @include       /^https:\/\/jira.apache.org\/jira\/browse\/[A-Z]+-\d+\\??.*/
// @include       /^https:\/\/jira.cloudera.com\/browse\/OPSAPS-\d+\\??.*/
// @include       /^https:\/\/jira.cloudera.com\/browse\/COMPX-\d+\\??.*/
// @include       /^https:\/\/jira.cloudera.com\/browse\/CDPD-\d+\\??.*/
// @include       /^https:\/\/issues.cloudera.org\/browse\/HUE-\d+\\??.*/
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const SELECTOR = '#key-val';

    function addCopyButton() {
        document.querySelectorAll(SELECTOR).forEach(element => {
            if (element.dataset.hasCopyButton) return; // Prevent duplicates
            
            let btn = document.createElement('button');
            btn.innerText = '📄';
            btn.style.marginLeft = '5px';
            btn.style.padding = '2px 5px';
            btn.style.fontSize = '12px';
            btn.style.cursor = 'pointer';
            btn.style.border = '1px solid #ccc';
            btn.style.background = '#f8f8f8';
            btn.style.borderRadius = '3px';
            btn.title = 'Copy issue link'; // Tooltip on hover
            
            btn.onclick = () => {
                let issueKey = element.innerText;
                let issueUrl = window.location.href;
                
                let richText = `<a href='${issueUrl}'>${issueKey}</a>`;
                
                let blob = new Blob([richText], { type: 'text/html' });
                let data = [
                    new ClipboardItem({
                        'text/html': blob,
                        'text/plain': new Blob([issueUrl], { type: 'text/plain' })
                    })
                ];
                
                navigator.clipboard.write(data).then(() => {
                    btn.innerText = '✅';
                    setTimeout(() => btn.innerText = '📄', 1000);
                }).catch(err => console.error('Clipboard copy failed:', err));
            };
            
            element.insertAdjacentElement('afterend', btn);
            element.dataset.hasCopyButton = 'true';
        });
    }
    
    // Run initially and on DOM updates
    addCopyButton();
    new MutationObserver(addCopyButton).observe(document.body, { childList: true, subtree: true });
})();
