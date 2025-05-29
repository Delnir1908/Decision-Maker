// Client facing scripts here

$(document).ready(function() {

  let optionCounter = 2;

  $("#add-option").on('click', function() {
    optionCounter++;
    const $option = $(`
      <div class="options" id="options-${optionCounter}">
        <span class="individual-option">
          <input type="text" name="option">
          <i class="fa-regular fa-message custom-message"></i>
          <i class="fa-regular fa-trash-can"></i>
        </span>
      </div>
    `);

    $('.options').last().after($option);
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

  $(document).on('click', '.fa-trash-can', function() {
    const $option = $(this).closest('.options');
    $option.remove();
  });

  $('form').on('submit', function(event) {
    event.preventDefault();
    const $form = $(this);

    const optionsArray = [];
    $('.options').each(function() {
      const $input = $(this).find('input[name="option"]');
      const $textarea = $(this).find('textarea[name="description"]');

      if ($input.length > 0) {
        const optionName = $input.val();
        const optionDescription = $textarea.length > 0 ? $textarea.val().trim() : null;

        optionsArray.push({
          name: optionName,
          description: optionDescription
        });
      }
    });

    const title = $form.find('input[name="title"]').val();
    const creator = $form.find('input[name="creator"]').val();
    const email = $form.find('input[name="email"]').val();

    const requireNames = function() {
      if ($(':checkbox').is(':checked')) {
        return true;
      } else {
        return false;
      }
    }

    const $data = {
      title: title,
      options: optionsArray,
      creator: creator,
      email: email,
      requires_name: requireNames(),
    }

    console.log('Form Data:', $data);

    $.ajax({
      type: 'POST',
      url: '/polls',
      data: JSON.stringify($data),
      contentType: 'application/json',
      success: function(response) {
        if (response.redirectTo) {
          window.location.href = response.redirectTo;
        }
      },
      error: function(error) {
        console.error('Error creating poll:', error);
        alert('There was an error creating your poll. Please try again.');
      }
    });
  });

});
