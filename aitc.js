(function (window, document, undefined) {
  function errorMsg (msg) {
    console.log('in errorMSG');
    const content = document.getElementById('content');
    const error = document.createElement('div');
    error.setAttribute('class', 'error');
    error.appendChild(document.createTextNode(msg));
    content.appendChild(error);
    document.getElementById('header').style.color = 'red';
  }
  function getLargestIconUrl (app) {
    function compare (a, b) {
      let ret = 0;
      const a_int = window.parseInt(a, 10);
      const b_int = window.parseInt(b, 10);
      if (a_int > b_int) {
        ret = -1;
      } else if (a_int < b_int) {
        ret = 1;
      }
      return ret;
    }
    const app_icon_urls = app.manifest.icons;
    const key = Object.keys(app.manifest.icons).sort(compare)[0].toString();
    return app.origin + app_icon_urls[key];
  }
  function display (app) {
    const icon_url = getLargestIconUrl(app);
    console.log(icon_url);
    const app_name = app.manifest.name;
    const app_dev = app.manifest.developer.name;
    const app_installed;
    const content = document.getElementById('content');
    const listing = document.createElement('div');
    const icon = document.createElement('img');
    icon.setAttribute('alt', 'icon');
    icon.setAttribute('src', icon_url);
    listing.setAttribute('class', 'listing');
    listing.appendChild(document.createTextNode(app_name + ' by ' + app_dev));
    listing.appendChild(icon);
    content.appendChild(listing);
  }
  function gotApps (apps) {
    if (apps.length === 0) {
      errorMsg('You have no apps!');
    } else {
      for each (let app in apps) {
        console.log(app);
        display(app);
      }
    }
  }
  function getAllSuccess () {
    document.getElementById('header').style.color = 'green';
    gotApps(this.result);
  }
  function getAllError () {
    let msg;
    if (this.error && this.error.name === 'DENIED') {
      msg = 'Add ' + window.location +
        ' to your dom.mozApps.whitelist in about:config and restart Firefox.';
    } else {
      msg = 'Error unrelated to dom.mozApps.whitelist occurred.';
    }
    errorMsg(msg);
  }
  function pageLoad () {
    const pending = navigator.mozApps.mgmt.getAll();
    pending.onsuccess = getAllSuccess;
    pending.onerror = getAllError;
  }
  window.addEventListener('DOMContentLoaded', pageLoad);
})(window, document);