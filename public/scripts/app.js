// Client facing scripts here
$(document).ready(function() {
  $("#add-option").on('click', function() {
    const $option = $(`
      <span class="individual-option">
        <input type="text">
        <i class="fa-regular fa-message"></i>
        <i class="fa-regular fa-trash-can"></i>
      </span>
    `);

    $('.options').append($option);
  });
});