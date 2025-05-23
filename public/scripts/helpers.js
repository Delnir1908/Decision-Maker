// helpers.js

function enableDragAndDrop(containerId) {
  const container = document.getElementById(containerId);
  let dragged = null;

  container.querySelectorAll('.options').forEach(option => {
    option.addEventListener('dragstart', (e) => {
      dragged = option;
      option.style.opacity = '0.5';
    });

    option.addEventListener('dragend', (e) => {
      dragged = null;
      option.style.opacity = '';
    });

    option.addEventListener('dragover', (e) => {
      e.preventDefault();
    });

    option.addEventListener('dragenter', (e) => {
      e.preventDefault();
      if (option !== dragged) option.style.border = '2px dashed navy';
    });

    option.addEventListener('dragleave', (e) => {
      option.style.border = '1px solid navy';
    });

    option.addEventListener('drop', (e) => {
      e.preventDefault();
      option.style.border = '1px solid navy';
      if (option !== dragged) {
        // Get the bounding rectangles to determine position
        const options = Array.from(container.querySelectorAll('.options'));
        const draggedIndex = options.indexOf(dragged);
        const dropIndex = options.indexOf(option);

        if (draggedIndex < dropIndex) {
          // Moving down: insert after the drop target
          container.insertBefore(dragged, option.nextSibling);
        } else {
          // Moving up: insert before the drop target
          container.insertBefore(dragged, option);
        }
      }
    });
  });
}


function rankOptions(arr) {
  let optionScores = {};
  const maxScore = arr.length;

  for(let option of arr) {
    optionScores[option] = maxScore - arr.indexOf(option);
  }

  return optionScores;
}
