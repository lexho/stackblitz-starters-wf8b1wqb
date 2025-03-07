       let blocks = []
        let blocks1 = [] //[{ heading: heading1, text: text1 }, { heading: heading1, text: text1 }]

        /*
            <div class="mb-3" id="headingbox2">
            <label for="heading2" class="form-label">Überschrift2</label>
            <input id="heading2" type="text" name="heading2" class="form-control" aria-describedby="heading" value="Überschrift" required/>
            <div class="valid-feedback">
                Looks good!
            </div>
            </div>
            <div id="textbox2" class="mb-3">
            <label for="text2" class="form-label">Text</label>
            <textarea id="text2" name="text2" class="form-control" aria-label="text" required>Another Textblock.</textarea>
            <div class="valid-feedback">
                Looks good!
            </div>
        </div>*/
        let nextHeading = 2
        function addTextBlock() {
            let root = document.getElementById("formblocks")

            let headingbox = document.createElement("div")
            let label1 = document.createElement("label")
            let input = document.createElement("input")
            let div = document.createElement("div")

            headingbox.setAttribute("class", "mb-3")

            label1.setAttribute("for", "heading" + nextHeading)
            label1.setAttribute("class", "form-label")
            label1.innerText = "Überschrift" + nextHeading

            input.setAttribute("id", "heading" + nextHeading)
            input.setAttribute("type", "text")
            input.setAttribute("name", "heading" + nextHeading)
            input.setAttribute("class", "form-control")
            input.setAttribute("aria-describedby", "heading")
            input.setAttribute("value", "Block" + nextHeading)
            input.setAttribute("required", "")

            let feedback1 = document.createElement("div")
            feedback1.setAttribute("class", "valid-feedback")
            feedback1.innerText = "Looks good!"

            headingbox.appendChild(label1)
            headingbox.appendChild(input)
            headingbox.appendChild(div)

            root.appendChild(headingbox)

            let textbox = document.createElement("div")
            textbox.setAttribute("id", "textbox" + nextHeading)
            textbox.setAttribute("class", "mb-3")
            let label = document.createElement("label")
            label.setAttribute("for", "text" + nextHeading)
            label.setAttribute("class", "form-label")
            label.innerText = "Text"
            let textarea = document.createElement("textarea")
            textarea.setAttribute("id", "text" + nextHeading)
            textarea.setAttribute("name", "text" + nextHeading)
            textarea.setAttribute("class", "form-control")
            textarea.setAttribute("aria-label", "text")
            textarea.setAttribute("required", "")
            textarea.innerText = "Another Textblock."+nextHeading
            let feedback = document.createElement("div")
            feedback.setAttribute("class", "valid-feedback")
            feedback.innerText = "Looks good!"

            textbox.appendChild(label)
            textbox.appendChild(textarea)
            textbox.appendChild(feedback)

            root.appendChild(textbox)

            let b = { type: "text", heading: input, text: textarea }
            blocks1.push(b)
            console.log(JSON.stringify(blocks1))

            nextHeading++
        }

        /*
        <div id="fotosbox" class="mb-3">
            <label for="fotos" class="form-label">Gallery 1</label><br />
            <div>
            <label for="web-worker1">
                <span id="web-worker1-progress"></span>
                <input id="web-worker1" type="file" multiple="multiple" accept="image/*" onchange='compressImages(event, true, "#web-worker1");' />
            </label>
            <p id="web-worker1-log"></p>
            </div>
            <hr />
        </div>*/
    let i = 1 // next gallery id
    function addGalleryBlock() {
        let submitButton = document.getElementById("submit")
        submitButton.setAttribute("class", "btn btn-secondary")
        submitButton.setAttribute("onClick", "")
        let fotosbox = document.createElement("fotosbox")
        fotosbox.setAttribute("id", "fotosbox")
        fotosbox.setAttribute("class", "mb-3")
        let label = document.createElement("label")
        label.setAttribute("for", "fotos")
        label.setAttribute("class", "form-label")
        label.innerText = "Gallery "+i
        
        let br = document.createElement("br")
        
        let div = document.createElement("div")
        let label1 = document.createElement("label")
        label1.setAttribute("for", "web-worker"+i)
        let span = document.createElement("span")
        span.setAttribute("id", "web-worker"+i+"-progress")
        label1.appendChild(span)
        let input = document.createElement("input")
        input.setAttribute("id", "web-worker"+i)
        input.setAttribute("type", "file")
        input.setAttribute("multiple", "multiple")
        input.setAttribute("accept", "image/*")
        input.setAttribute("onchange", "compressImages(event, true, \"#web-worker"+i+"\");")
        label1.appendChild(input)
        div.appendChild(label1)
        let hr = document.createElement("hr")

        fotosbox.appendChild(label)
        fotosbox.appendChild(br)
        fotosbox.appendChild(div)
        fotosbox.appendChild(hr)

        let root = document.getElementById("formblocks")
        root.appendChild(fotosbox)

        console.log(JSON.stringify(blocks1))
        let images1 = []
        let b1 = {type: "gallery", id: i, images: images1}
        blocks1.push(b1)

        i++
        images.push([])
        images[0] = [] // images1
    }    