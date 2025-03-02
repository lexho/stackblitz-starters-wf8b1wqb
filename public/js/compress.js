let selectedVersion = 'latest'
    let workers = []
    let filenames = []
    //let journal = [];
    let progresses = []
    function compressImages(event, useWebWorker, imageID) { // imageID brauch ma doch für log
      for(let file of event.target.files) {
        filenames.push(file.name)
        workers.push(compressImage(file, useWebWorker, imageID))
      }
      Promise.all(workers).then(
        (values) => {
            console.log("compression finished"); 
            let submitButton = document.getElementById("submit")
            submitButton.setAttribute("onClick", "submit();")
            submitButton.setAttribute("class", "btn btn-primary")
        } 
    )
    }
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
        maxSizeMB: 1,//parseFloat(document.querySelector("#maxSizeMB").value),
        maxWidthOrHeight: 1024, //parseFloat(
          //document.querySelector("#maxWidthOrHeight").value
        //),
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
          perpareUploadToServer(output, imageID); // return 
          res();
        })
        .catch(function (error) {
          alert(error.message);
          reh();
        });

      function onProgress(p) {
        let anzahl = workers.length
        //journal.push({ tag: file.name, p: p }) // tag, progress
        progresses[file.name] = p
        let p_gesamt = 0
        // get latest progress
        //for(let p of progresses) {
        for(let name of filenames) {
          if(progresses[name] === undefined) break;
          let p = progresses[name]
          //console.log("progress:", name, p)
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

    function perpareUploadToServer(file, imageID) {
        let heading = document.getElementById("heading1").value
        let layout = document.getElementById("layout").value
        let text = document.getElementById("text").value

       formData.append('photos', file, "file" + counter) // multiple files
       counter++
       //console.log("formData: " + JSON.stringify(formData))
    }

    function submit() {
        let heading = document.getElementById("heading1").value
        let layout = document.getElementById("layout").value
        let text = document.getElementById("text").value

        formData.set('heading', heading)
        formData.set('layout', layout)
        formData.set('text', text)
        const url = '/page/save'
        
        let path = "/" + heading.toLowerCase().replaceAll(" ", "") //replaceUmlaute(heading.toLowerCase().replaceAll(" ", ""))
        return fetch(url, {
          method: 'POST',
          body: formData
        }).then(res => {/*console.log(res);*/ window.open(path,"_self") })
          .then(body => console.log('got server response', body))
    }