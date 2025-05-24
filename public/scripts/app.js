// Client facing scripts here
$(document).ready(function() {
  $("#add-option").on('click', function() {
    const $option = $(`
      <span class="individual-option">
        <input type="text">
        <i class="fa-regular fa-message custom-message"></i>
        <i class="fa-regular fa-trash-can"></i>
      </span>
    `);

    $('.options').append($option);
  });

  $(document).on('click', '.custom-message', function() {
    const $option = $(this).closest('.individual-option');
    const $desc = $option.next('.description');

    if ($desc.length) {
      $desc.toggle();
    } else {
      const $description = $(`
        <span class="description">
          <textarea name="description" type="text" class="message" placeholder="Add an optional description here"></textarea>
        </span>
      `);

      $option.after($description);
    }
  });
});