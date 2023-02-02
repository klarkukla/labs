var Loader = (function(){

    //--------------------------------------------------

    var loader = document.getElementById('loader');
    var loaderBar = document.getElementById('loader-bar');

    //--------------------------------------------------

    var loadingManager = new THREE.LoadingManager();

    loadingManager.onProgress = function(item, loaded, total){
        let ratio = (loaded / total) * 100;
        loaderBar.style.width = ratio + '%';
        if(loaded == total){
          // remove loader
          document.body.removeChild(loader);
          // play audio
          document.getElementById('audio').play();
        }
    };

    //--------------------------------------------------

    var objLoader = new THREE.OBJLoader(loadingManager);

    //--------------------------------------------------

    var textureLoader = new THREE.TextureLoader(loadingManager);

    //--------------------------------------------------

    return{
        loadingManager: loadingManager,
        objLoader: objLoader,
        textureLoader: textureLoader
    }
})();
