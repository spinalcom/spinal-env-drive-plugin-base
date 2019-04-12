/**
 * SpinalDrive_App_FileExplorer_currdir_newFolder
 * @extends {SpinalDrive_App}
 */
import { getRight } from "./GetRight";

class SpinalDrive_App_FileExplorer_currdir_newFolder extends SpinalDrive_App {
  /**
   * Creates an instance of SpinalDrive_App_FileExplorer_currdir_newFolder.
   * @memberof SpinalDrive_App_FileExplorer_currdir_newFolder
   */
  constructor() {
    super(
      "NewFolderFileExplorerCurrDir",
      "New Folder...",
      1,
      "create_new_folder",
      "Create a new Folder"
    );
  }
  /**
   * method to handle the selection
   *
   * @param {any} element
   * @memberof SpinalDrive_App_FileExplorer_currdir_newFolder
   */
  action(obj) {
    let mdDialog = obj.scope.injector.get("$mdDialog");
    let spinalFileSystem = obj.scope.injector.get("spinalFileSystem");
    var confirm = mdDialog
      .prompt()
      .title("New Folder")
      .placeholder("Untitled folder")
      .ariaLabel("New Folder")
      .initialValue("Untitled folder")
      .clickOutsideToClose(true)
      .required(true)
      .ok("Create!")
      .cancel("Cancel");
    obj.original = {
      model: obj.model._server_id
    };

    mdDialog.show(confirm).then(
      result => {
        spinalFileSystem.newFolder(null, obj, result);
        let username = obj.scope.injector.get("authService").get_user()
          .username;
        this.log(
          obj.model[obj.model.length - 1],
          username,
          obj.item.description
        );
      },
      function() {}
    );
  }
  is_shown(d, spinalcore) {
    return true;
    return getRight( spinalcore, d.model._server_id )
      .then( flags => {
        return (flags & window.spinalCore.right_flag.WR) !== 0;
      } );
  }
}

module.exports.FileExplorerCurrDirNewFolder = SpinalDrive_App_FileExplorer_currdir_newFolder;

/**
 * SpinalDrive_App_FolderExplorer_newFolder
 * @extends {SpinalDrive_App}
 */
class SpinalDrive_App_FolderExplorer_newFolder extends SpinalDrive_App {
  /**
   * Creates an instance of SpinalDrive_App_FolderExplorer_newFolder.
   * @memberof SpinalDrive_App_FolderExplorer_newFolder
   */
  constructor() {
    super(
      "NewFolderFolderExplorer",
      "New Folder...",
      1,
      "fa fa-folder",
      "Create a new Folder"
    );
  }
  
  /**
   * method to handle the selection
   *
   * @param {any} element
   * @memberof SpinalDrive_App_FolderExplorer_newFolder
   */
  action(obj) {
    let mdDialog = obj.scope.injector.get("$mdDialog");
    let spinalFileSystem = obj.scope.injector.get("spinalFileSystem");

    var confirm = mdDialog
      .prompt()
      .title("New Folder")
      .placeholder("Untitled folder")
      .ariaLabel("New Folder")
      .clickOutsideToClose(true)
      .initialValue("Untitled folder")
      .required(true)
      .ok("Create!")
      .cancel("Cancel");
    mdDialog.show(confirm).then(
      result => {
        spinalFileSystem.newFolder(obj.scope.all_dir, obj.node, result);
        let username = obj.scope.injector.get("authService").get_user()
          .username;
        let model = FileSystem._objects[obj.model_server_id];
        this.log(model[model.length - 1], username, this.description);
      },
      function() {}
    );
  }
  is_shown(d, spinalcore) {
    return getRight( spinalcore, d.original.model )
      .then( flags => {
        return (flags & window.spinalCore.right_flag.WR) !== 0;
      } );
  }
}

module.exports.FolderExplorerNewFolder = SpinalDrive_App_FolderExplorer_newFolder;
