cordova.define("cordova-plugin-sim.Sim", function(require, exports, module) {
module.exports = {
  getSimInfo: function(successCallback, errorCallback) {
    cordova.exec(successCallback, errorCallback, 'Sim', 'getSimInfo', []);
  }
};

});
