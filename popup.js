function DownloadCsvJson(text, name) {
    var csv = 'data:text/plain;charset=utf-8,'
        + encodeURIComponent(text);

    var link = document.createElement('a');
    link.setAttribute('href', csv);    
    link.setAttribute('download', name);
    link.style.display = 'none';
    document.body.appendChild(link); // Required for FF

    link.click();
}

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var currentTab = tabs[0];
    alert(currentTab.id);
  });