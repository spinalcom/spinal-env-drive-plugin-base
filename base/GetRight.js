const G_root = window ? window : global;

/**
* Get the user right on the file
* @param {any} spinalcore. ngSpinalcore from angular
* @param {string} serverId. ID of the file
* @return {number} right flags
*/
export function getRight( spinalcore, serverId ) {
  const userId = G_root.FileSystem._userid;
  return spinalcore.load_right( serverId )
    .then( userRight => {
      
      for (let i = 0; i < userRight.length; i++) {
        if (userRight[i].user.id.get() === parseInt( userId )) {
          return userRight[i].flag.get();
        }
      }
      return -1;
    } )
}

