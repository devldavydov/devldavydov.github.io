$(document).ready(function() {
    function calcDof() {
        var coc = COC_DATA[0];
        var focalLength = parseInt($('#focalLengthSelect').val());

        $.each(APERTURE_DATA, function (index, aperture) {
            $.each(FOCUS_DISTANCE_DATA, function (index, focusDistance) {
                var dof = dofCalculate(focusDistance, focalLength, aperture, coc);
                $('#' + getCellId(focusDistance, aperture)).text(dof);
            });
        });
    }

    function initTable() {
        $('#hdrFocusDistance').attr('colspan', FOCUS_DISTANCE_DATA.length);
        $.each(FOCUS_DISTANCE_DATA, function (index, focusDistance) {
            $('#hdrFocusDistanceVals').append($('<th>', {'class': 'table-cell', 'text': focusDistance}));
        });
        $.each(APERTURE_DATA, function (index, aperture) {
            var tr = $('<tr>');
            var tableData = $('#tableData');

            tr.append($('<th>', {'class': 'table-cell', 'text': aperture}));
            $.each(FOCUS_DISTANCE_DATA, function (index, focusDistance) {
                tr.append($('<td>', {'class': 'table-cell', 'id': getCellId(focusDistance, aperture)}));
            });

            tableData.append(tr);
        });
    }

    function loadFocalLength() {
        $.each(FOCAL_LENGTH_DATA, function (index, value) {
            $('#focalLengthSelect').append($('<option>', {value: value, text: value}));
        });
        $('#focalLengthSelect').find('option:first').remove();
    }

    function getCellId(focusDistance, aperture) {
        return 'cell-' + focusDistance.toString().replace('.', '_') + '_' + aperture.toString().replace('.', '_');
    }

    loadFocalLength();
    initTable();
    calcDof();

    $('#focalLengthSelect').change(function() {
        calcDof();
    });
});
