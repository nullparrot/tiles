/*Create tiles based on lesson*/
function makeTiles(tilesJSON, book, lesson) {
  console.log("The JSON", tilesJSON);
  bookTiles = tilesJSON[book]
  tiles = bookTiles[lesson]
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
    let va = a.color.toLowerCase()
    vb = b.color.toLowerCase()
    if (va < vb){
      return 1
    }
    if (va > vb){
      return -1
    }
    return 0
  })
  console.log("book 1, Lesson 1", tiles);
  placementX = 5
  placementY = 5
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
      if (newtile.offsetWidth+5+placementX > screen.width){
        placementX = 5
        placementY = placementY+newtile.offsetHeight+5
      }
      newtile.style.left = placementX + "px";
      newtile.style.top = placementY + "px";
      tempcount = tempcount + 1;
    }
    placementX = placementX +newtile.offsetWidth+5
  });
  /*make iems with class "dragMe" moveable*/
  findMoveables("dragMe", "tiles");
}

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
  console.log("List of ID's", moveIDarray);
  moveIDarray.forEach((element) => {
    console.log("Here's an ID", element.id);
    makeMoveables(element.id, divID);
  });
}

function updateTiles(){
  reset()
  book = document.getElementById("bookSelect").value
  lesson = document.getElementById("lessonSelect").value
  makeTiles(tilesJSON,book,lesson)
}

function updateLessonSelect(){
  book = document.getElementById("bookSelect").value
  lessonMenu = document.getElementById("lessonSelect")
  lessonMenu.innerHTML = ""
  lessons = tilesJSON[book]
  lessonKeys  = Object.keys(lessons)
  lessonKeys.forEach((lesson) => {
    option = document.createElement("option")
    option.setAttribute("value",lesson)
    option.innerHTML = "Lesson "+lesson
    lessonMenu.appendChild(option)
  })
}

function updateBookSelect(){
  bookMenu = document.getElementById("bookSelect")
  bookMenu.innerHTML = ""
  bookKeys  = Object.keys(tilesJSON)
  bookKeys.forEach((book) => {
    option = document.createElement("option")
    option.setAttribute("value",book)
    option.innerHTML = "Book "+book
    bookMenu.appendChild(option)
  })
  updateLessonSelect()
}



fetch(
  "tiles_content.json"
)
  .then((tilesTMP) => {
    return tilesTMP.json();
  })
  .then((tiles) => {
    tilesJSON = tiles
    updateBookSelect()
    updateTiles()
  });

document.getElementById('bookSelect').addEventListener('change',updateLessonSelect)
document.getElementById('bookSelect').addEventListener('change',updateTiles)
document.getElementById('lessonSelect').addEventListener('change',updateTiles)