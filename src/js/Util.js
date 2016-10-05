/**
 * OSD ajax wrapped in promise.
 *
 * @param url
 * @param json
 * @returns {Promise}
 */
export function fetch(url, json=true) {
  return new Promise((resolve, err) => {
    OpenSeadragon.makeAjaxRequest(url, (response) => {
      return json ? resolve(JSON.parse(response.responseText)) : resolve(response);
    }, err);
  });
}


export function getPath(asset) {
  return process.env.__DEV__ ? `/assets/${asset}` : `/wellcome-quilt-prototype/assets/${asset}`;
}


export function asyncAddTiledImage(viewer, ...args) {
  return new Promise((resolve, err) => {
    const argumentList = [...args];
    if (argumentList[0]) {
      argumentList[0].success = resolve;
    }
    try {
      viewer.addTiledImage.apply(this, argumentList);
    } catch (e) {
      err(e);
    }
  });
}
