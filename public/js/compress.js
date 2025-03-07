let selectedVersion = 'latest'
    let workers = []
    let filenames = []
    let progresses = []

    function compressImage(file, useWebWorker, imageID) {
        return new Promise((res, rej) => {
      var logDom, progressDom;
      const log = imageID + "-log"
      const progress = imageID + "-progress"
      logDom = document.querySelector(log); //#web-worker1-log
      progressDom = document.querySelector(progress);

      console.log("image to compress: ", file.name);
      imageCompression.getExifOrientation(file).then(function (o) {
        console.log("ExifOrientation", o);
      });

      controller = typeof AbortController !== 'undefined' && new AbortController();

      // modified options
      var options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: useWebWorker,
        onProgress: onProgress,
        preserveExif: true,
        libURL: "https://cdn.jsdelivr.net/npm/browser-image-compression@"+selectedVersion+"/dist/browser-image-compression.js"
      };
      if (controller) {
        options.signal = controller.signal;
      }
      imageCompression(file, options)
        .then(function (output) {
          perpareUploadToServer(output, file.name, imageID);
          res();
        })
        .catch(function (error) {
          alert(error.message);
          reh();
        });

      function onProgress(p) {
        progresses[file.name] = p
        let p_gesamt = 0
        // get latest progress
        for(let name of filenames) {
          if(progresses[name] === undefined) break;
          let p = progresses[name]
          p_gesamt += p
        }
        p_gesamt /= filenames.length
        //console.log("onProgress", file.name, p);
        //console.log("onProgress gesamt", p_gesamt);
        progressDom.innerHTML = "(" + Math.round(p_gesamt) + "%" + ")";
      }
        });
    }

    function abort() {
      if (!controller) return
      controller.abort(new Error('I just want to stop'));
    }

    const formData = new FormData()
       let counter = 1;

    function perpareUploadToServer(file, filename) {
       formData.append('photos', file, filename) // multiple files
       counter++
    }