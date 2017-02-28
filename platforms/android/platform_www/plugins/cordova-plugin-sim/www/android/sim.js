cordova.define("cordova-plugin-sim.SimAndroid", function(require, exports, module) {
module.exports = {
  hasReadPermission: function(successCallback, errorCallback) {
    cordova.exec(successCallback, errorCallback, 'Sim', 'hasReadPermission', []);
  },
  requestReadPermission: function(successCallback, errorCallback) {
    cordova.exec(successCallback, errorCallback, 'Sim', 'requestReadPermission', []);
  }
};

});
