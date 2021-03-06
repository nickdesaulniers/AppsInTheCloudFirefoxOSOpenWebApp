// Notes:
// - These Preferences need to be set with a patch:
//   - services.aitc.dashboard.url -> http://localhost/aitc/
//     otherwise AITC#main wont set user active
//   - dom.mozApps.whitelist -> http://localhost/aitc/
//     otherwise navigator.mozApps.mgmt.getAll() calls error callback
(function (window, document, undefined) {
  function errorMsg (msg) {
    const content = document.getElementById('content');
    const error = document.createElement('div');
    error.setAttribute('class', 'error');
    error.appendChild(document.createTextNode(msg));
    content.appendChild(error);
    document.getElementById('header').style.color = 'red';
  }
  function getSmallestIconUrl (app) {
    function compare (a, b) {
      let ret = 0;
      const a_int = window.parseInt(a, 10);
      const b_int = window.parseInt(b, 10);
      if (a_int < b_int) {
        ret = -1;
      } else if (a_int > b_int) {
        ret = 1;
      }
      return ret;
    }
    const app_icon_urls = app.manifest.icons;
    const key = Object.keys(app.manifest.icons).sort(compare)[0].toString();
    return app.origin + app_icon_urls[key];
  }
  function display (app) {
    const icon_url = getSmallestIconUrl(app);
    //console.log(icon_url);
    const app_name = app.manifest.name;
    const app_dev = app.manifest.developer.name;
    const app_installed = app.status === 'installed';
    const content = document.getElementById('content');
    const listing = document.createElement('div');
    const icon = document.createElement('img');
    const install_button = document.createElement('input');
    install_button.setAttribute('type', 'button');
    install_button.setAttribute('disabled', true);
    // this shouldn't be hardcoded
    install_button.setAttribute('value', 'installed');
    icon.setAttribute('alt', 'icon');
    icon.setAttribute('src', icon_url);
    listing.setAttribute('class', 'app');
    listing.appendChild(icon);
    listing.appendChild(document.createTextNode(app_name + ' by ' + app_dev));
    listing.appendChild(install_button);
    content.appendChild(listing);
  }
  function gotApps (apps) {
    if (apps.length === 0) {
      // Not going to want to do this, since we can have no apps installed,
      // but have some in the cloud.  so check the cloud first.
      // no installed + no cloud = no apps
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
  // check if dom.mozApps.whitelist is set correctly
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
    // http://10.250.64.173:5000 -> test server for 
    // check if services.aitc.dashboard.url pref is set correctly
    //errorMsg('Add ' + window.location +
    //  ' to your services.aitc.dashboard.url in about:config and restart ' +
    //  'Firefox.');

    const pending = navigator.mozApps.mgmt.getAll();
    pending.onsuccess = getAllSuccess;
    pending.onerror = getAllError;
  }
  window.addEventListener('DOMContentLoaded', pageLoad);
})(window, document);