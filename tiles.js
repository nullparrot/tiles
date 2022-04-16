/* Functions */

/*Create tiles based on lesson*/
function makeTiles(tilesJSON, level, lesson) {
  levelTiles = tilesJSON[level]
  tiles = levelTiles[lesson]
  tiles.sort((a,b) => {
    let va = a.value.toLowerCase()
    vb = b.value.toLowerCase()
    if (va < vb){
      return -1
    }
    if (va > vb){
      return 1
    }
    return 0
  })
  tiles.sort((a,b) => {
    let va = a.sortkey
    vb = b.sortkey
    if (va < vb){
      return -1
    }
    if (va > vb){
      return 1
    }
    return 0
  })
  placementX = 5
  placementY = 5
  lastsort = 0
  tiles.forEach((tile) => {
    tileCount = tile.quantity;
    tempcount = 0;
    while (tempcount < tileCount) {
      whiteboard = document.getElementById("tiles");
      newtile = document.createElement("p");
      newtile.setAttribute("class", "dragMe");
      newtile.setAttribute(
        "id",
        tile.value + "-" + tile.color + "-" + tempcount
      );
      newtile.setAttribute(
        "style",
        "background-color:" +
          tile.color +
          ";" +
          "border: 10px solid " +
          tile.color +
          ";"
      );
      newtile.innerHTML = tile.value.toLowerCase();
      whiteboard.appendChild(newtile);
      if (newtile.offsetWidth+5+placementX > screen.width || tile.sortkey > lastsort){
        placementX = 5
        placementY = placementY+newtile.offsetHeight+5
      }
      newtile.style.left = placementX + "px";
      newtile.style.top = placementY + "px";
      tempcount = tempcount + 1;
    }
    lastsort = tile.sortkey
    placementX = placementX +newtile.offsetWidth+5
  });
  /*make iems with class "dragMe" moveable*/
  findMoveables("dragMe", "tiles");
}

/* Clears tiles off board*/
function reset(){
  document.getElementById('tiles').innerHTML = ''
}

/* makes element given as argument moveable*/
function makeMoveables(moveID, divID) {
  var dragItem = document.getElementById(moveID);
  var container = document.getElementById(divID);

  var active = false;
  var currentX;
  var currentY;
  var initialX;
  var initialY;
  var xOffset = 0;
  var yOffset = 0;

  container.addEventListener("touchstart", dragStart, false);
  container.addEventListener("touchend", dragEnd, false);
  container.addEventListener("touchmove", drag, false);

  container.addEventListener("mousedown", dragStart, false);
  container.addEventListener("mouseup", dragEnd, false);
  container.addEventListener("mousemove", drag, false);

  function dragStart(e) {
    if (e.type === "touchstart") {
      initialX = e.touches[0].clientX - xOffset;
      initialY = e.touches[0].clientY - yOffset;
    } else {
      initialX = e.clientX - xOffset;
      initialY = e.clientY - yOffset;
    }

    if (e.target === dragItem) {
      active = true;
    }
  }

  function dragEnd(e) {
    initialX = currentX;
    initialY = currentY;

    active = false;
  }

  function drag(e) {
    if (active) {
      e.preventDefault();

      if (e.type === "touchmove") {
        currentX = e.touches[0].clientX - initialX;
        currentY = e.touches[0].clientY - initialY;
      } else {
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
      }

      xOffset = currentX;
      yOffset = currentY;

      setTranslate(currentX, currentY, dragItem);
    }
  }

  function setTranslate(xPos, yPos, el) {
    el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
  }
}

/* makes all elements with given class name movable if they have unique ids*/
function findMoveables(className, divID) {
  let moveIDcollection = document.getElementsByClassName(className);
  let moveIDarray = Array.from(moveIDcollection);
  moveIDarray.forEach((element) => {
    makeMoveables(element.id, divID);
  });
}

function updateTiles(){
  reset()
  level = document.getElementById("levelSelect").value
  lesson = document.getElementById("lessonSelect").value
  makeTiles(tilesJSON,level,lesson)
}

function updateLessonSelect(){
  level = document.getElementById("levelSelect").value
  lessonMenu = document.getElementById("lessonSelect")
  lessonMenu.innerHTML = ""
  lessons = tilesJSON[level]
  lessonKeys  = Object.keys(lessons)
  lessonKeys.forEach((lesson) => {
    option = document.createElement("option")
    option.setAttribute("value",lesson)
    option.innerHTML = "Lesson "+lesson
    lessonMenu.appendChild(option)
  })
}

function updateLevelSelect(){
  levelMenu = document.getElementById("levelSelect")
  levelMenu.innerHTML = ""
  levelKeys  = Object.keys(tilesJSON)
  levelKeys.forEach((level) => {
    option = document.createElement("option")
    option.setAttribute("value",level)
    option.innerHTML = "Level "+level
    levelMenu.appendChild(option)
  })
  updateLessonSelect()
}

function nextButton(){
  lessons = tilesJSON[level]
  lessonKeys  = Object.keys(lessons)
  levelKeys  = Object.keys(tilesJSON)
  levelSelect = document.getElementById("levelSelect")
  lessonSelect = document.getElementById("lessonSelect")
  if (lesson >= lessonKeys.length){
    if (level >= levelKeys.length){
      updateTiles()
    } else{
      levelSelect.selectedIndex = parseInt(levelSelect.value)
      updateLessonSelect()
      updateTiles()
    }
  } else{
    lessonSelect.selectedIndex = parseInt(lessonSelect.value)
    updateTiles()
  }
}


/* Main program */

level = 0
lesson = 0

fetch(
  "tiles_content.json"
)
  .then((tilesTMP) => {
    return tilesTMP.json();
  })
  .then((tiles) => {
    tilesJSON = tiles
    updateLevelSelect()
    updateTiles()
  });

document.getElementById('levelSelect').addEventListener('change',updateLessonSelect)
document.getElementById('levelSelect').addEventListener('change',updateTiles)
document.getElementById('lessonSelect').addEventListener('change',updateTiles)
window.addEventListener('resize',updateTiles)
document.getElementById("reset").addEventListener("click",updateTiles)
document.getElementById("next").addEventListener("click",nextButton)