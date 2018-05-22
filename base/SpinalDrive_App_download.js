/**
 * SpinalDrive_App_FileExplorer_Download
 * @extends {SpinalDrive_App}
 */
class SpinalDrive_App_FileExplorer_Download extends SpinalDrive_App {
  /**
   * Creates an instance of SpinalDrive_App_FileExplorer_Download.
   * @memberof SpinalDrive_App_FileExplorer_Download
   */
  constructor() {
    super("DownloadFileExplorer", "Download...", 15, "edit", "Download a File");
  }
  /**
   * method to handle the selection
   *
   * @param {any} element
   * @memberof SpinalDrive_App_FileExplorer_Download
   */
  action(obj) {
    let mdDialog = obj.scope.injector.get("$mdDialog");
    let f = FileSystem._objects[obj.file._server_id];
    var confirm = mdDialog
      .confirm()
      .title("Do you want download " + f.name.get() + " ?")
      .ariaLabel("Download")
      .clickOutsideToClose(true)
      .ok("Download!")
      .cancel("Cancel");

    mdDialog.show(confirm).then(
      function() {
        if (f._info.model_type.get() == "Path") {
          // window.open("/sceen/_?u=" + model._server_id, "Download");
          var element = document.createElement("a");
          element.setAttribute("href", "/sceen/_?u=" + f._ptr.data.value);
          element.setAttribute("download", f.name.get());
          element.style.display = "none";
          document.body.appendChild(element);
          element.click();
          document.body.removeChild(element);
        }
      },
      function() {}
    );
  }
  is_shown(d) {
    if (d && d.file && d.file._server_id) {
      let file = window.FileSystem._objects[d.file._server_id];
      if (file) {
        if (file instanceof File) {
          return true;
        }
      }
    }
    return false;
  }
}

module.exports.FileExplorerDownload = SpinalDrive_App_FileExplorer_Download;
