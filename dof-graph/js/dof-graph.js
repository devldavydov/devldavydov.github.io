$(document).ready(function() {
    function setFocalLength() {
        var focalLengthIndex = $('#focalLengthIndex').val();
        var focalLength = FOCAL_LENGTH_DATA[focalLengthIndex];
        $('#focalLength').text(focalLength);
    }

    function setAperture() {
        var apertureIndex = $('#apertureIndex').val();
        var aperture = APERTURE_DATA[apertureIndex];
        $('#aperture').text(aperture);
    }

    $(document).on('input', '#focalLengthIndex', setFocalLength);
    $(document).on('input', '#apertureIndex', setAperture);

    $('#focalLengthIndex').attr({max: FOCAL_LENGTH_DATA.length});
    $('#apertureIndex').attr({max: APERTURE_DATA.length});

    setFocalLength();
    setAperture();
});