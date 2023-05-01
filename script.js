const canvasEl = document.querySelector('canvas'),
ctx = canvasEl.getContext('2d'),
toolBtns = document.querySelectorAll('.tool'),
fillColor = document.querySelector('#fill-color'),
sizeSlider = document.querySelector('#size-slider'),
colorBtns = document.querySelectorAll('.colors .option'),
colorPicker = document.querySelector('#color-picker'),
saveImg = document.querySelector('.save-img'),
clearCanvas = document.querySelector('.clear-canvas');

let preMouseX, preMouseY, shnapShot;
let isDrawing = false,
    brushWidth = 5,
    selectedTool = "brush",
    selectedColor = "#000";

const setCanvasBackground = () => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvasEl.width, canvasEl.height)
}

window.addEventListener('load', ()=>{
    //setting canvas width/height, offsetwidth/height returns variable width/height of an element
    canvasEl.width = canvasEl.offsetWidth;
    canvasEl.height = canvasEl.offsetHeight;
    setCanvasBackground();
})

const drawLine = (e) => {
    ctx.beginPath();
    ctx.moveTo(preMouseX, preMouseY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
}

const drawRect = (e)=>{
    // if fill color is not checked draw a rect else draw rect with background
    if(!fillColor.checked)
    {
        //creating circle according to the mouse pointer
       return ctx.strokeRect(e.offsetX, e.offsetY, preMouseX - e.offsetX, preMouseY - e.offsetY);
    }
    //predefined fillREct();
    ctx.fillRect(e.offsetX, e.offsetY, preMouseX - e.offsetX, preMouseY - e.offsetY);
}

const drawCircle = (e) => {
    ctx.beginPath();
    // getting radius for circle according to the mouse pointer
    let radius = Math.sqrt(Math.pow((preMouseX - e.offsetX), 2) + Math.pow((preMouseY - e.offsetY), 2));
    ctx.arc(preMouseX, preMouseY, radius, 0, 2 * Math.PI); // creating circle according to the mouse pointer
    fillColor.checked ? ctx.fill() : ctx.stroke(); // if fillcolor is checked fill circle else draw border circle
}

const drawTriangle = (e) => {
    ctx.beginPath();
    ctx.moveTo(preMouseX, preMouseY); // moving triangle to the mouse pointer
    ctx.lineTo(e.offsetX, e.offsetY); // creating first line according to the mouse pointer
    ctx.lineTo(preMouseX * 2 - e.offsetX, e.offsetY); // creating bottom line of triangle
    ctx.closePath(); // closing path of triangle so the third line draw automatically
    fillColor.checked ? ctx.fill() : ctx.stroke(); 
}

const startDraw =  (e)=>{
    isDrawing = true;
    preMouseX = e.offsetX; //passing current mouseX position as preMouseX value
    preMouseX = e.offsetX; //passing current mouseY position as preMouseY value
    preMouseY = e.offsetY;
    ctx.beginPath(); //creating new path to draw
    ctx.lineWidth = brushWidth; 
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;
    //coping canvas data and passing as shapshot value..this avoids dragging the image
    shnapShot = ctx.getImageData(0, 0, canvasEl.width, canvasEl.height);
}

const drawing = (e)=>{
    if(!isDrawing) return; // if drawing is false return from here 
    ctx.putImageData(shnapShot, 0, 0); //adding copied canvas data on to this canvas
    if(selectedTool === "brush" || selectedTool === "eraser")
    // if selected tool is eraser then set strokestyle to white  
    {
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
        ctx.lineTo(e.offsetX, e.offsetY); //creating a line according to the mouse pointer
        ctx.stroke(); //filling line with color
    }
    else if(selectedTool === "line")
    {
        drawLine(e);
    }
    else if(selectedTool === "rectangle")
    {
        drawRect(e);
    }
    else if(selectedTool === "circle")
    {
        drawCircle(e);
    }
    else if(selectedTool === "triangle")
    {
        drawTriangle(e);
    }
}

toolBtns.forEach(btn=>{
    btn.addEventListener('click', ()=>{
        //removing active class from the previous option and adding on current clicked option
        document.querySelector('.options .active').classList.remove('active');
        btn.classList.add('active');
        selectedTool = btn.id;
    })
})

sizeSlider.addEventListener('change', ()=> brushWidth = sizeSlider.value); //passing slider value as brushsize

colorBtns.forEach(btn => {
    btn.addEventListener('click', ()=> {
        document.querySelector('.options .selected').classList.remove('selected');
        btn.classList.add('selected');
        selectedColor = (window.getComputedStyle(btn).getPropertyValue('background-color'));
    })
})

colorPicker.addEventListener('change', ()=>{
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
})

clearCanvas.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    ctx.fillStyle = selectedColor; 
    setCanvasBackground();
})

saveImg.addEventListener('click', () => {
    const link = document.createElement('a'); // creating <a> tag
    link.download = `${Date.now()}.jpg`; // passing current date as link download value
    link.href = canvasEl.toDataURL(); // passing canvasData as link href value
    link.click(); // clicking link to download image
})

canvasEl.addEventListener('mousedown', startDraw);
canvasEl.addEventListener('mousemove', drawing);
canvasEl.addEventListener('mouseup', ()=> isDrawing = false); // on mouseup not draw