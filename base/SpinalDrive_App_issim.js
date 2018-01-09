/**
 * SpinalDrive_App_FileExplorer_currdir_issim
 * @extends {SpinalDrive_App}
 */
class SpinalDrive_App_FileExplorer_currdir_issim extends SpinalDrive_App {

  /**
   * Creates an instance of SpinalDrive_App_FileExplorer_currdir_issim.
   * @memberof SpinalDrive_App_FileExplorer_currdir_issim
   */
  constructor() {
    super("IssimFileExplorerCurrDir", "New Is'sim app", 1, "desktop_windows", "Create an Is'sim app");
  }
  /**
   * method to handle the selection
   * 
   * @param {any} element 
   * @memberof SpinalDrive_App_FileExplorer_currdir_issim
   */
  action(obj) {
    let mdDialog = obj.scope.injector.get('$mdDialog');

    var confirm = mdDialog.prompt()
      .title('New Is\'sim session Project')
      .placeholder('Project session name')
      .ariaLabel('new issim')
      .clickOutsideToClose(true)
      .required(true)
      .ok('Create!')
      .cancel('Cancel');
    mdDialog.show(confirm).then(function (result) {
      let curr_dir = obj.scope.curr_dir;
      if (curr_dir) {
        curr_dir.add_file(result, 0, {
          model_type: 'Session',
          icon: 'Session',
        });
      }
    }, function () {});

  }
}

module.exports.FileExplorerCurrDirIssim = SpinalDrive_App_FileExplorer_currdir_issim;


/**
 * SpinalDrive_App_FileExplorer_issim
 * @extends {SpinalDrive_App}
 */
class SpinalDrive_App_FileExplorer_issim extends SpinalDrive_App {

  /**
   * Creates an instance of SpinalDrive_App_FileExplorer_issim.
   * @memberof SpinalDrive_App_FileExplorer_issim
   */
  constructor() {
    super("IssimFileExplorer", "Open with Is'sim", 1, "desktop_windows", "Open with Is'sim");
    this.order_priority = 5;
  }
  /**
   * method to handle the selection
   * 
   * @param {any} element 
   * @memberof SpinalDrive_App_FileExplorer_issim
   */
  action(obj) {
    let authService = obj.scope.injector.get('authService');
    let fs_path = obj.scope.fs_path;
    let username = authService.get_user().username;
    let path = "/__users__/" + username;
    for (var i = 1; i < fs_path.length; i++) {
      path += '/' + fs_path[i].name;
    }
    path += '/' + obj.file.name;
    let myWindow = window.open('', '');
    myWindow.document.location = "/html/lab.html#" + encodeURI(path);
    myWindow.focus();
  }

  is_shown(d) {
    if (d && d.file && d.file._server_id) {
      let file = FileSystem._objects[d.file._server_id];
      if (file && file instanceof File && file._info.model_type &&
        file._info.model_type.get() === 'Session') {
        return true;
      }
    }
    return false;
  }

}

module.exports.FileExplorerIssim = SpinalDrive_App_FileExplorer_issim;