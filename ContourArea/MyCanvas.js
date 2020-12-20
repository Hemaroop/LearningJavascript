var canvasElement = document.getElementById("selectedCarImage")
var panelContourButton = document.getElementById("panelContour")
var damageContourButton = document.getElementById("damageContour")
var panelDamageDetailsElement = document.getElementById("panelDamageDetailsForm")
var panelSelectElement = document.getElementById("panelName")
var damageSelectElement = document.getElementById("damageType")
var saveButtonElement = document.getElementById("detailsSubmit")
var damageListElement = document.getElementById("imageDamageList")

var canvasContext = canvasElement.getContext('2d')
var imageSrc
var canvasElementWidth
var canvasElementHeight
var startX = 0
var startY = 0
var imageWidthToDisplay
var imageHeightToDisplay
var naturalImageWidth
var naturalImageHeight
var canvasZoomInFactor = 1.0
var deltaYMultiplier = 0.001

var pathStarted = false
var pathStartPoint = []
var pathPointList = []
var pathCompleteZoneRadius = 3

var panelContourDrawInProgress = false
var damageContourDrawInProgress = false

var damageArea = 0
var panelArea = 0
var damagePercent = 0

var selectedPanelName = ""
var selectedDamageType = ""

const generateInterpolatedList = (contourPointStart, contourPointEnd) => {
    var interpolatedList = []
    var diffX = contourPointEnd[0] - contourPointStart[0]
    var diffY = contourPointEnd[1] - contourPointStart[1]
    var xIncrement = diffX / Math.abs(diffX)
    var lineSlope = diffY / diffX

    var interpolatedPointX = contourPointStart[0] + xIncrement
    //interpolatedPointY = contourPointStart[1] + (xIncrement * lineSlope)
    var interpolatedPointY = Math.round(contourPointStart[1] + (xIncrement * lineSlope))

    while (interpolatedPointX != contourPointEnd[0]) {
        interpolatedList.push([interpolatedPointX, interpolatedPointY])
        interpolatedPointX = interpolatedPointX + xIncrement
        //interpolatedPointY = interpolatedPointY + (xIncrement * lineSlope)
        interpolatedPointY = Math.round(interpolatedPointY + (xIncrement * lineSlope))
    }

    return interpolatedList
}

const generateInterpolatedContour = (contourPointList) => {
    var contPointIdx = 0
    while (contPointIdx < contourPointList.length) {
        var contPointOne = []
        var contPointTwo = []
        if (contPointIdx != (contourPointList.length - 1)) {
            contPointOne = contourPointList[contPointIdx]
            contPointTwo = contourPointList[contPointIdx+1]
        }
        else {
            contPointOne = contourPointList[contPointIdx]
            contPointTwo = contourPointList[0]
        }
        var diffX = Math.abs(contPointTwo[0] - contPointOne[0])
        if (diffX > 0) {
            var interpolatedPointList = generateInterpolatedList(contPointOne,contPointTwo)
            var interpolatedPointIdx = 0
            while (interpolatedPointIdx < interpolatedPointList.length) {
                contourPointList.splice(contPointIdx+1+interpolatedPointIdx, 0, interpolatedPointList[interpolatedPointIdx])
                interpolatedPointIdx = interpolatedPointIdx + 1
            }
            contPointIdx = contPointIdx + interpolatedPointList.length + 1
        }
        else{
            contPointIdx = contPointIdx + 1
        }
    }
    contourPointList.sort((pointOne, pointTwo) => {if (pointOne[0] === pointTwo[0]) {return pointOne[1]-pointTwo[1];} else {return pointOne[0]-pointTwo[0];}})

    return contourPointList
}

const getContourArea = (contourPointList) => {
    var interpolatedContourPointList = generateInterpolatedContour(contourPointList)
    var pointIdx = 0
    var nOfPoints = interpolatedContourPointList.length
    var startX = interpolatedContourPointList[0][0]
    var endX = interpolatedContourPointList[nOfPoints-1][0]
    contourArea = 0.0

    if (nOfPoints > 2) {
        while (pointIdx < nOfPoints) {
            if ((interpolatedContourPointList[pointIdx][0] == startX) || (interpolatedContourPointList[pointIdx][0] == endX)) {
                pointIdx = pointIdx + 1
                contourArea = contourArea + 1
            }
            else {
                contourArea = contourArea + Math.abs(interpolatedContourPointList[pointIdx+1][1] - interpolatedContourPointList[pointIdx][1]) + 1
                pointIdx = pointIdx + 2
            }
        }
    }
    
    return contourArea
}

const canvasClickEventHandler = (event) => {

    //canvasContext.restore()
    //canvasContext.strokeStyle = "#FF0000"
    //canvasContext.lineWidth = 2

    if (pathStarted === false) {
        pathStarted = true
        canvasContext.beginPath()
        pathStartPoint.push(event.offsetX)
        pathStartPoint.push(event.offsetY)
        canvasContext.moveTo(event.offsetX, event.offsetY)
        pathPointList.push([event.offsetX, event.offsetY])
        canvasContext.arc(event.offsetX, event.offsetY, pathCompleteZoneRadius, 0, 2*Math.PI)
    }
    else {
        if (Math.sqrt((event.offsetX-pathStartPoint[0])*(event.offsetX-pathStartPoint[0]) + (event.offsetY-pathStartPoint[1])*(event.offsetY-pathStartPoint[1])) < pathCompleteZoneRadius) {
            canvasContext.lineTo(pathPointList[0][0], pathPointList[0][1])
            canvasContext.closePath()
            pathStarted = false
            console.log("Closing contour")

            if (damageContourDrawInProgress) {
                damageContourDrawInProgress = false
                damageArea = getContourArea(pathPointList)
                damageContourButton.disabled = true
                panelContourButton.disabled = false
                if (panelArea != 0) {
                    damagePercent = damageArea / panelArea
                    damageArea = 0
                    panelArea = 0
                    document.getElementById("damageResult").innerHTML = "Damage Percent is " + (damagePercent * 100) + "%."
                    panelDamageDetailsElement.style.display = "inline-block"
                    panelSelectElement.addEventListener("change", selectionChangeEventHandler)
                    damageSelectElement.addEventListener("change", selectionChangeEventHandler)
                    panelSelectElement.disabled = false
                    panelContourButton.disabled = true
                } 
            }
            else if(panelContourDrawInProgress) {
                panelContourDrawInProgress = false
                panelArea = getContourArea(pathPointList)
                panelContourButton.disabled = true
                damageContourButton.disabled = false
                if (damageArea != 0) {
                    damagePercent = damageArea / panelArea
                    damageArea = 0
                    panelArea = 0
                    document.getElementById("damageResult").innerHTML = "Damage Percent is " + (damagePercent * 100) + "%."
                    panelDamageDetailsElement.style.display = "inline-block"
                    panelSelectElement.addEventListener("change", selectionChangeEventHandler)
                    damageSelectElement.addEventListener("change", selectionChangeEventHandler)
                    panelSelectElement.disabled = false
                    damageContourButton.disabled = true
                }
            }
            
            while (pathPointList.length > 0) {
                var popPoint = pathPointList.pop()
                //console.log(popPoint)
            }
            while (pathStartPoint.length > 0) {
                pathStartPoint.pop()
            }

            canvasElement.removeEventListener("click", canvasClickEventHandler)
        }
        else {
            canvasContext.lineTo(event.offsetX, event.offsetY)
            pathPointList.push([event.offsetX, event.offsetY])
            canvasContext.arc(event.offsetX, event.offsetY, 3, 0, 2*Math.PI)
        }
    }

    canvasContext.stroke()
    //canvasContext.save()

}

const mouseWheelMoveOnCanvasEventHandler = (event) => {

    var oldCanvasZoomInFactor = canvasZoomInFactor
    if (event.shiftKey) {
        canvasZoomInFactor = Math.max(1.0, (canvasZoomInFactor - (event.deltaY * deltaYMultiplier)))
        canvasZoomInFactor = Math.min(canvasZoomInFactor, 5.0)
        console.log(canvasZoomInFactor)
    }

}

const canvasMouseMoveEventHandler = (event) => {

    canvasContext.restore()

    if (pathStarted === true) {
        canvasContext.strokeStyle = "#00FF00"
        canvasContext.lineTo(event.offsetX, event.offsetY)
    }

}

const mouseOnCanvasEventHandler = (event) => {

    canvasElement.addEventListener("wheel", mouseWheelMoveOnCanvasEventHandler)

}

const mouseOffCanvasEventHandler = (event) => {

    canvasElement.removeEventListener("wheel", mouseWheelMoveOnCanvasEventHandler)

}

const buttonClickEventHandler = (event) => {
    if (panelContourButton.contains(event.target)) {
        if (panelContourDrawInProgress === false) {
            panelContourDrawInProgress = true
            panelContourButton.disabled = true
            damageContourButton.disabled = true
            canvasContext.strokeStyle = "#00FF00"
        }
    }
    else if (damageContourButton.contains(event.target)) {
        if (damageContourDrawInProgress === false) {
            damageContourDrawInProgress = true
            panelContourButton.disabled = true
            damageContourButton.disabled = true
            canvasContext.strokeStyle = "#FF0000"
        }
    }
    canvasElement.addEventListener("click", canvasClickEventHandler)
}

const imgClickEventHandler = (event) => {
    var carImgElements = document.getElementsByClassName("carImage") 
    for (mem of carImgElements) {
        if (mem.contains(event.target)) {
            
            if ((imageSrc != mem.src) && (imageSrc != null)) {

                pathStartPoint.splice(0, pathStartPoint.length)
                pathPointList.splice(0, pathPointList.length)

                damageContourDrawInProgress = false
                panelContourDrawInProgress = false

                panelContourButton.disabled = true
                damageContourButton.disabled = true
                panelContourButton.removeEventListener("click", buttonClickEventHandler)
                damageContourButton.removeEventListener("click", buttonClickEventHandler)
                canvasElement.removeEventListener("click", canvasClickEventHandler)
                canvasElement.removeEventListener("mouseenter", mouseOnCanvasEventHandler)
                canvasElement.removeEventListener("mouseleave", mouseOffCanvasEventHandler)

                //Hide form
                panelSelectElement.selectedIndex = 0
                damageSelectElement.selectedIndex = 0
                panelSelectElement.removeEventListener("change", selectionChangeEventHandler)
                damageSelectElement.removeEventListener("change", selectionChangeEventHandler)
                saveButtonElement.removeEventListener("click", addToDamageList)
                panelSelectElement.disabled = true
                damageSelectElement.disabled = true
                saveButtonElement.disabled = true
                panelDamageDetailsElement.style.display = "none"

                //Reset variable values
                damageArea = 0
                panelArea = 0
                damagePercent = 0

                selectedPanelName = ""
                selectedDamageType = ""

                startX = 0
                startY = 0
                imageWidthToDisplay = mem.naturalWidth
                imageHeightToDisplay = mem.naturalHeight
                naturalImageWidth = mem.naturalWidth
                naturalImageHeight = mem.naturalHeight
                canvasZoomInFactor = 1.0
                deltaYMultiplier = 0.001
            }

            else if (imageSrc == null) {
                startX = 0
                startY = 0
                imageWidthToDisplay = mem.naturalWidth
                imageHeightToDisplay = mem.naturalHeight
                naturalImageWidth = mem.naturalWidth
                naturalImageHeight = mem.naturalHeight
                canvasZoomInFactor = 1.0
                deltaYMultiplier = 0.001
            }

            if (imageSrc != mem.src) {
                imageSrc = mem.src
                canvasElementWidth = mem.naturalWidth + "px"
                canvasElementHeight = mem.naturalHeight + "px"
                canvasElement.setAttribute("width", canvasElementWidth)
                canvasElement.setAttribute("height", canvasElementHeight)
                canvasContext.drawImage(mem, startX, startY, imageWidthToDisplay, imageHeightToDisplay, 0, 0, naturalImageWidth, naturalImageHeight)
                canvasContext.save()
                panelContourButton.disabled = false
                damageContourButton.disabled = false
                panelContourButton.addEventListener("click", buttonClickEventHandler)
                damageContourButton.addEventListener("click", buttonClickEventHandler)
                canvasElement.addEventListener("mouseenter", mouseOnCanvasEventHandler)
                canvasElement.addEventListener("mouseleave", mouseOffCanvasEventHandler)
                //canvasElement.addEventListener("click", canvasClickEventHandler)
                //canvasElement.addEventListener("mousemove", canvasMouseMoveEventHandler)
            }
            break
        }
    }
}

const selectionChangeEventHandler = (event) => {
    if (panelSelectElement.contains(event.target)) {
        var damageTypeListLen = damageSelectElement.options.length
        selectedPanelName = panelSelectElement.value
        if (selectedPanelName != "none")
        {
            if (selectedPanelName === "Windscreen" || selectedPanelName === "Rear Windscreen" ||
            selectedPanelName === "Left Headlight" || selectedPanelName === "Right Headlight" ||
            selectedPanelName === "Left Taillight" || selectedPanelName === "Right Taillight" ||
            selectedPanelName === "Left Side Mirror" || selectedPanelName === "Right Side Mirror" ||
            selectedPanelName === "Left Front Door Window" || selectedPanelName === "Right Front Door Window" ||
            selectedPanelName === "Left Rear Door Window" || selectedPanelName === "Right Rear Door Window") {
                var dTypeIndex = 0
                while (dTypeIndex < damageTypeListLen) {
                    if (damageSelectElement.options[dTypeIndex].text === "Dent") {
                        damageSelectElement.options[dTypeIndex].disabled = true
                    }
                    else {
                        damageSelectElement.options[dTypeIndex].disabled = false
                    }
                    dTypeIndex = dTypeIndex + 1
                }                            
            }
            else {
                var dTypeIndex = 0
                while (dTypeIndex < damageTypeListLen) {
                    if (damageSelectElement.options[dTypeIndex].text === "Break") {
                        damageSelectElement.options[dTypeIndex].disabled = true
                    }
                    else {
                        damageSelectElement.options[dTypeIndex].disabled = false
                    }
                    dTypeIndex = dTypeIndex + 1
                }
            }
            damageSelectElement.disabled = false
        }
    }
    else if (damageSelectElement.contains(event.target)) {
        selectedDamageType = damageSelectElement.value
        if (selectedDamageType != "none") {
            saveButtonElement.addEventListener("click", addToDamageList)
            saveButtonElement.disabled = false
        }
    }
}

const addToDamageList = () => {
    var listElementInnerHTML = selectedPanelName + "\t" + selectedDamageType + "\t" + (damagePercent * 100) + "%"
    var listElement = document.createElement("li")
    var canvasImg = new Image()

    listElement.innerHTML = listElementInnerHTML
    damageListElement.appendChild(listElement)

    //Hide form
    panelSelectElement.selectedIndex = 0
    damageSelectElement.selectedIndex = 0
    panelSelectElement.removeEventListener("change", selectionChangeEventHandler)
    damageSelectElement.removeEventListener("change", selectionChangeEventHandler)
    saveButtonElement.removeEventListener("click", addToDamageList)
    panelSelectElement.disabled = true
    damageSelectElement.disabled = true
    saveButtonElement.disabled = true
    panelDamageDetailsElement.style.display = "none"

    //Restore pre-contour
    canvasImg.src = imageSrc
    canvasElementWidth = canvasImg.width + "px"
    canvasElementHeight = canvasImg.height + "px"
    canvasElement.setAttribute("width", canvasElementWidth)
    canvasElement.setAttribute("height", canvasElementHeight)
    canvasContext.drawImage(canvasImg, 0, 0)
    canvasContext.save()
    panelContourButton.disabled = false
    damageContourButton.disabled = false

    //Reset variable values
    damageArea = 0
    panelArea = 0
    damagePercent = 0

    selectedPanelName = ""
    selectedDamageType = ""
}

const myTestFunc = () => {
    //console.log("Loading done...")
    document.addEventListener("click", imgClickEventHandler)
    //canvasElement.addEventListener("mousemove", canvasMouseMoveEventHandler)
}
