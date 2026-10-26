document.getElementById('orderBtn').addEventListener('click', function () {
    var size = document.querySelector('input[name="size"]:checked');
    var flavor = document.getElementById('flavor').value;
    var result = document.getElementById('choiceResult');

    if (size === null) {
        result.textContent = 'Please pick a size first.';
    } else {
        result.textContent = 'You chose a ' + size.value + ' ' + flavor + '.';
    }
});
