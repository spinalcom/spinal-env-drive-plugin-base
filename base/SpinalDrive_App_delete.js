/**
 * SpinalDrive_App_FileExplorer_delete
 * @extends {SpinalDrive_App}
 */
class SpinalDrive_App_FileExplorer_delete extends SpinalDrive_App {

  /**
   * Creates an instance of SpinalDrive_App_FileExplorer_delete.
   * @memberof SpinalDrive_App_FileExplorer_delete
   */
  constructor() {
    super("DeleleFileExplorer", "Delete", 1, "delete", "Delete the file");
    this.order_priority = -1;
    // super("DeleleFileExplorer", "Delete", 1, "delete", "Delete the file", "delete", ["all"], "all");
  }
  /**
   * method to handle the selection
   * 
   * @param {any} element 
   * @memberof SpinalDrive_App_FileExplorer_delete
   */
  action(obj) {
    let mdDialog = obj.scope.injector.get('$mdDialog');
    let content = 'Are you sure to delete the file / folder';
    if (obj && obj.file && obj.file.name)
      content += " : " + obj.file.name;
    let newFolder_prompt = mdDialog.confirm()
      .title("Delete")
      .textContent(content)
      .ariaLabel('Delete Directory file')
      .clickOutsideToClose(true)
      .ok('Confirm')
      .cancel('Cancel');

    mdDialog.show(newFolder_prompt).then(function () {
      if (!(obj && obj.scope && obj.scope.curr_dir && obj.file && obj.file._server_id)) return;
      let f = FileSystem._objects[obj.file._server_id];
      if (f) {
        let m_parent = obj.scope.curr_dir;
        for (var i = 0; i < m_parent.length; i++) {
          if (m_parent[i]._server_id == f._server_id && obj.file.name == m_parent[i].name.get()) {
            m_parent.remove_ref(m_parent[i]);
            break;
          }
        }
      }
    }, function () {});

  }
}

module.exports.FileExplorerDelete = SpinalDrive_App_FileExplorer_delete;


/**
 * SpinalDrive_App_FolderExplorer_delete
 * @extends {SpinalDrive_App}
 */
class SpinalDrive_App_FolderExplorer_delete extends SpinalDrive_App {

  /**
   * Creates an instance of SpinalDrive_App_FolderExplorer_delete.
   * @memberof SpinalDrive_App_FolderExplorer_delete
   */
  constructor() {
    super("DeleleFolderExplorer", "Delete", 0, "fa fa-trash text-danger", "Delete the file");
    // super("DeleleFolderExplorer", "Delete", 0, "fa fa-trash text-danger", "Delete the file", "delete", ["all"], "all");
  }
  /**
   * method to handle the selection
   * 
   * @param {any} element 
   * @memberof SpinalDrive_App_FolderExplorer_delete
   */
  action(obj) {
    let mdDialog = obj.scope.injector.get('$mdDialog');
    let spinalFileSystem = obj.scope.injector.get('spinalFileSystem');

    let content = 'Are you sure to delete the folder';
    if (obj && obj.node && obj.node.text)
      content += " : " + obj.node.text;
    let newFolder_prompt = mdDialog.confirm()
      .title("Delete")
      .textContent(content)
      .ariaLabel('Delete Directory file')
      .clickOutsideToClose(true)
      .ok('Confirm')
      .cancel('Cancel');

    mdDialog.show(newFolder_prompt).then(function () {
      spinalFileSystem.deleteFolder(obj.scope.all_dir, obj.node);
    }, function () {});
  }
}
module.exports.FolderExplorerDelete = SpinalDrive_App_FolderExplorer_delete;