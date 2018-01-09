/**
 * SpinalDrive_App_share
 * @extends {SpinalDrive_App}
 */
class SpinalDrive_App_share extends SpinalDrive_App {}
/**
 * DialogShareCtrl - controller to be added within a `$mdDialog.show` option parameter.
 *  e.g. {controller: ["$scope", "$mdDialog", "model_server_id", "spinalModelDictionary", "mdDialog", "ngSpinalCore",DialogShareCtrl], template: shareTemplate, ... , locals:
 * {model_server_id: obj,spinalModelDictionary: spinalModelDictionary, mdDialog: mdDialog, ngSpinalCore: ngSpinalCore}
 * }
 * @param {any} $scope automaticly given in the mdDialog.show
 * @param {angular} $mdDialog automaticly given in the mdDialog.show
 * @param {number} model_server_id resolved within the `local` object given to the $mdDialog.show(...)
 * @param {angularFactory} spinalModelDictionary same
 * @param {angularFactory} mdDialog same
 * @param {angularFactory} ngSpinalCore same
 */
SpinalDrive_App_share.DialogShareCtrl = function ($scope, $mdDialog, model_server_id, spinalModelDictionary, mdDialog, ngSpinalCore) {
  spinalModelDictionary.init().then(function () {
    $scope.users = spinalModelDictionary.users.get();
    $scope.rightRead = false;
    $scope.rightWrite = false;
    $scope.rightShare = false;
    $scope.users.forEach(element => {
      element.share_selected = false;
      element._lowername = element.name.toLowerCase();
    });
    let mod = FileSystem._objects[model_server_id];
    let _data = 0;
    if (mod instanceof File)
      _data = mod._ptr.data.value;
    else if (mod instanceof Ptr)
      _data = mod.data.value;
    else
      _data = mod._server_id;
    ngSpinalCore.load_right(_data).then((res) => {
      create_rightList(res);
    }, (err) => {
      console.error("load_right: couldn't load the right of the model " + model_server_id);
    });
  });

  function create_right_col(flag, flagType) {
    if (flag & flagType)
      return "Yes";
    return "No";
  }

  function create_rightList(model) {
    $scope.selectedModelShared_to_user = [];
    for (var i = 0; i < model.length; i++) {
      let ur = model[i];
      $scope.selectedModelShared_to_user.push({
        id: ur.user.id.get(),
        name: ur.user.name.get(),
        rd: create_right_col(ur.flag.get(), spinalCore.right_flag.RD),
        wr: create_right_col(ur.flag.get(), spinalCore.right_flag.WR),
        ad: create_right_col(ur.flag.get(), spinalCore.right_flag.AD)
      });
    }
  }

  /**
   * Return the proper object when the append is called.
   */
  $scope.transformChip = function (chip) {
    // If it is an object, it's already a known chip
    if (angular.isObject(chip)) {
      return chip;
    }
    // Otherwise, create a new one
    return {
      name: chip,
      type: 'new'
    };
  };
  $scope.error_msgs = [];
  $scope.chip_users = [];
  $scope.selectedItem = null;
  $scope.searchText = null;
  $scope.createFilterFor = (query) => {
    var lowercaseQuery = angular.lowercase(query);

    return function filterFn(user) {
      return (user._lowername.indexOf(lowercaseQuery) === 0) ||
        (user.id.toString().indexOf(lowercaseQuery) === 0);
    };

  };

  $scope.querySearch = (query) => {
    var results = query ? $scope.users.filter($scope.createFilterFor(query)) : [];
    return results;
  };
  $scope.cancelDialog = function () {
    $mdDialog.hide();
  };

  $scope.submitDialog = function () {
    let flag = 0;
    $scope.error_msgs = [];
    if ($scope.rightRead == true) flag |= spinalCore.right_flag.RD;
    if ($scope.rightWrite == true) flag |= spinalCore.right_flag.WR;
    if ($scope.rightShare == true) flag |= spinalCore.right_flag.AD;

    if ($scope.chip_users.length == 0) {
      $scope.error_msgs.push("Add some user(s) to share.");
    }
    if (flag == 0) {
      $scope.error_msgs.push("Choose the Right access to give.");
    }
    if ($scope.error_msgs.length != 0) {
      return;
    }

    let data = FileSystem._objects[model_server_id];
    let file_name = "";
    if (data.name)
      file_name = data.name.get();
    else
      file_name = data.constructor.name + "_" + data._server_id;
    for (var i = 0; i < $scope.chip_users.length; i++) {
      ngSpinalCore.share_model(data, file_name, flag, $scope.chip_users[i].name);
    }
    $mdDialog.hide();
  };
};

SpinalDrive_App_share.shareTemplate = '<md-dialog aria-label="Sharing setting">' +
  '  <md-dialog-content style="padding-left: 10px;padding-right: 10px;">' +
  '        <h3>Sharing setting</h3>' +
  '        <h5 style="margin-top: 30px;margin-bottom: 0px;">Invite people:</h5>' +
  '        <md-chips ng-model="chip_users" md-autocomplete-snap md-transform-chip="transformChip($chip)" md-require-match="true">' +
  '        <md-autocomplete md-selected-item="selectedItem" md-search-text="searchText" md-items="item in querySearch(searchText)"' +
  '          md-item-text="item.name" placeholder="User(s) to share...">' +
  '          <span md-highlight-text="searchText">{{item.id}} - {{item.name}}</span>' +
  '        </md-autocomplete>' +
  '        <md-chip-template>' +
  '          <span>' +
  '            <strong>{{$chip.name}}</strong>' +
  '            <em>({{$chip.id}})</em>' +
  '          </span>' +
  '        </md-chip-template>' +
  '     </md-chips>' +
  '        <h5 style="margin-top: 30px;margin-bottom: 0px;">Who has access:</h5>' +
  '      <md-table-container>' +
  '        <table md-table>' +
  '          <thead md-head>' +
  '            <tr style="height: 25px;">' +
  '              <th md-column>Id</th>' +
  '              <th md-column style="width: 30%;">User</th>' +
  '              <th md-column>Read</th>' +
  '              <th md-column>Write</th>' +
  '              <th md-column>Admin</th>' +
  '            </tr>' +
  '          </thead>' +
  '          <tbody md-body>' +
  '            <tr  md-select-id="name" ng-repeat="_user in selectedModelShared_to_user" file-obj="file">' +
  '              <td md-cell>{{_user.id}}</td>' +
  '              <td md-cell>{{_user.name}}</td>' +
  '              <td md-cell>{{_user.rd}}</td>' +
  '              <td md-cell>{{_user.wr}}</td>' +
  '              <td md-cell>{{_user.ad}}</td>' +
  '            </tr>' +
  '          </tbody>' +
  '        </table>' +
  '      </md-table-container>' +
  '        <h5 style="margin-top: 30px;margin-bottom: 0px;">Right access to give:</h5>' +
  '    <md-input-container style="margin: 0;" class="md-block">' +
  '        <md-switch class="md-primary" style="margin: 15px;" name="Read" ng-model="rightRead">' +
  '          Read' +
  '        </md-switch>' +
  '        <md-switch class="md-primary" style="margin: 15px;" name="Write" ng-model="rightWrite">' +
  '          Write' +
  '        </md-switch>' +
  '        <md-switch class="md-primary" style="margin: 15px;" name="Share" ng-model="rightShare">' +
  '          Share' +
  '        </md-switch>' +
  '    </md-input-container>' +
  ' <p class="p-error fadein" ng-repeat="error_msg in error_msgs">{{error_msg}}</p>' +
  '  </md-dialog-content>' +
  '  <md-dialog-actions>' +
  '    <md-button ng-click="cancelDialog()" class="md-primary">' +
  '      Cancel' +
  '    </md-button>' +
  '    <md-button ng-click="submitDialog()" class="md-primary">' +
  '      Submit' +
  '    </md-button>' +
  '  </md-dialog-actions>' +
  '</md-dialog>';

/**
 * SpinalDrive_App_FileExplorer_share
 * @extends {SpinalDrive_App_share}
 */
class SpinalDrive_App_FileExplorer_share extends SpinalDrive_App_share {

  /**
   * Creates an instance of SpinalDrive_App_FileExplorer_share.
   * @memberof SpinalDrive_App_FileExplorer_share
   */
  constructor() {
    super("ShareFileExplorer", "Share...", 2, "share", "Share Models with other Users");
    // super("ShareFileExplorer", "Share...", 2, "share", "Share Models with other Users", "share", ["all"], "all");
  }
  /**
   * method to handle the selection
   * 
   * @param {any} element 
   * @memberof SpinalDrive_App_FileExplorer_share
   */
  action(obj) {
    console.log(obj);
    // let spinalModelDictionary = angular.element(element).injector().get('spinalModelDictionary');
    let spinalModelDictionary = obj.scope.injector.get('spinalModelDictionary');
    let mdDialog = obj.scope.injector.get('$mdDialog');
    let ngSpinalCore = obj.scope.injector.get('ngSpinalCore');
    mdDialog.show({
      controller: ["$scope", "$mdDialog", "model_server_id", "spinalModelDictionary", "mdDialog", "ngSpinalCore", SpinalDrive_App_share.DialogShareCtrl],
      template: SpinalDrive_App_share.shareTemplate,
      parent: angular.element(document.body),
      targetEvent: obj.evt,
      clickOutsideToClose: true,
      locals: {
        model_server_id: obj.file._server_id,
        spinalModelDictionary: spinalModelDictionary,
        mdDialog: mdDialog,
        ngSpinalCore: ngSpinalCore
      },

    });
  }
}

module.exports.FileExplorerShare = SpinalDrive_App_FileExplorer_share;


/**
 * SpinalDrive_App_FolderExplorer_share
 * @extends {SpinalDrive_App_share}
 */
class SpinalDrive_App_FolderExplorer_share extends SpinalDrive_App_share {

  /**
   * Creates an instance of SpinalDrive_App_FolderExplorer_share.
   * @memberof SpinalDrive_App_FolderExplorer_share
   */
  constructor() {
    super("ShareFolderExplorer", "Share...", 3, "fa fa-share-alt", "Share Models with other Users");
    // super("ShareFolderExplorer", "Share...", 3, "fa fa-share-alt", "Share Models with other Users", "share", ["all"], "all");
  }
  /**
   * method to handle the selection
   * 
   * @param {any} element 
   * @memberof SpinalDrive_App_FolderExplorer_share
   */
  action(obj) {
    let spinalModelDictionary = obj.scope.injector.get('spinalModelDictionary');
    let mdDialog = obj.scope.injector.get('$mdDialog');
    let ngSpinalCore = obj.scope.injector.get('ngSpinalCore');
    mdDialog.show({
      controller: ["$scope", "$mdDialog", "model_server_id", "spinalModelDictionary", "mdDialog", "ngSpinalCore", SpinalDrive_App_share.DialogShareCtrl],
      template: SpinalDrive_App_share.shareTemplate,
      parent: angular.element(document.body),
      clickOutsideToClose: true,
      locals: {
        model_server_id: obj.model_server_id,
        spinalModelDictionary: spinalModelDictionary,
        mdDialog: mdDialog,
        ngSpinalCore: ngSpinalCore
      }
    });
  }
}
module.exports.FolderExplorerShare = SpinalDrive_App_FolderExplorer_share;

/**
 * SpinalDrive_App_Inspector_share
 * @extends {SpinalDrive_App_share}
 */
class SpinalDrive_App_Inspector_share extends SpinalDrive_App_share {

  /**
   * Creates an instance of SpinalDrive_App_Inspector_share.
   * @memberof SpinalDrive_App_Inspector_share
   */
  constructor() {
    super("ShareInspector", "Share...", 3, "share", "Share Models with other Users");
    // super("ShareInspector", "Share...", 3, "share", "Share Models with other Users", "share", ["all"], "all");
  }
  /**
   * method to handle the selection
   * 
   * @param {any} element 
   * @memberof SpinalDrive_App_Inspector_share
   */
  action(obj) {
    let spinalModelDictionary = obj.scope.injector.get('spinalModelDictionary');
    let mdDialog = obj.scope.injector.get('$mdDialog');
    let ngSpinalCore = obj.scope.injector.get('ngSpinalCore');
    mdDialog.show({
      controller: ["$scope", "$mdDialog", "model_server_id", "spinalModelDictionary", "mdDialog", "ngSpinalCore", SpinalDrive_App_share.DialogShareCtrl],
      template: SpinalDrive_App_share.shareTemplate,
      parent: angular.element(document.body),
      clickOutsideToClose: true,
      locals: {
        model_server_id: obj.model_server_id,
        spinalModelDictionary: spinalModelDictionary,
        mdDialog: mdDialog,
        ngSpinalCore: ngSpinalCore
      }
    });
  }

  /**
   * method to know if the app is needed to be shown.
   * if the method is not defined then the model is shown by default
   * @param {Object} d node of the tree selectionned
   * @returns {boolean}
   * @memberof SpinalDrive_App_Inspector_share
   */
  is_shown(d) {
    return true;
  }
}
module.exports.InspectorShare = SpinalDrive_App_Inspector_share;