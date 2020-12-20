const printIds = (className) => {
    const classMembers = document.querySelectorAll("." + className);
    //console.log(classMembers);
    console.log("Here are the rectangle IDs");
    for (classMem of classMembers) {
        console.log(classMem.id);
    }
}

window.onload = () => {
    alert("Proceeding to populate HTML body");
    let h1Element = document.createElement("h1");
    let h2Element = document.createElement("h2");
    let divElement = document.createElement("div");
    let ulColorElement = document.createElement("ul");
    h1Element.innerText = "Color Bars";
    h2Element.innerText = "This page shows my 10 favorite colors. Look below...";
    divElement.id = "rectangleWrapper"
    document.body.appendChild(h1Element);
    document.body.appendChild(h2Element);
    document.body.appendChild(divElement);
    ulColorElement.style.listStyle = 'none';
    for (let i = 0; i < 10; i++) {
        let liElement = document.createElement("li");
        liElement.id = "rect" + (i+1);
        liElement.classList.add("colorRect")
        liElement.innerHTML = '<svg height="84" width="84"></svg>'
        let svgElement = liElement.querySelector("svg")
        let rectHTMLElementBegin = '<rect x="2" y="2" rx="5" ry="5" width="50" height="50" style="stroke:black;stroke-width:2;fill:';
        let rectHTMLElementEnd = '"/>';
        let textHTMLElementBegin = '<text fill="#000" font-size="15" x="0" y="72">';
        let textHTMLElementEnd = '</text>'
        let colorHex = '#000';
        switch (i) {
            case 0:
                colorHex = '#008080';
                break;
            case 1:
                colorHex = '#808000';
                break;
            case 2:
                colorHex = '#000080';
                break;
            case 3:
                colorHex = '#800080';
                break;
            case 4:
                colorHex = '#800000';
                break;
            case 5:
                colorHex = '#888800';
                break;
            case 6:
                colorHex = '#de5b3f';
                break;
            case 7:
                colorHex = '#accb1e';
                break;
            case 8:
                colorHex = '#1b68c0';
                break;
            case 9:
                colorHex = '#c01b63';
                break;
        }
        svgElement.innerHTML=rectHTMLElementBegin + colorHex + rectHTMLElementEnd;
        svgElement.innerHTML= svgElement.innerHTML + textHTMLElementBegin + colorHex + textHTMLElementEnd;
        ulColorElement.appendChild(liElement);
    }
    divElement.appendChild(ulColorElement);
    //Print Ids
    printIds("colorRect");
}