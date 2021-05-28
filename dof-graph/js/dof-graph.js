$(document).ready(function() {
    function setFocalLength() {
        $('#focalLength').text(getFocalLength());
    }

    function setAperture() {
        $('#aperture').text(getAperture());
    }

    function setCoc() {
        $('#coc').text(getCoc());
    }

    function getFocalLength() {
        return FOCAL_LENGTH_DATA[$('#focalLengthIndex').val()];
    }

    function getAperture() {
        return APERTURE_DATA[$('#apertureIndex').val()];
    }

    function getCoc() {
        return COC_DATA[$('#cocIndex').val()];
    }

    function updateGraph(graph) {
        var focalLength = getFocalLength();
        var aperture = getAperture();
        var coc = getCoc();

        var dofNear = [];
        var dofFar = [];
        $.each(FOCUS_DISTANCE_DATA, function (index, focusDistance) {
            var dofRange = dofCalculate(focusDistance, focalLength, aperture, coc);
            dofNear.push(dofRange[0]);
            dofFar.push(dofRange[1]);
        });

        graph.data.datasets[0].data = dofNear;
        graph.data.datasets[1].data = dofFar;
        graph.update()
    }

    $('#focalLengthIndex').attr({max: FOCAL_LENGTH_DATA.length - 1});
    $('#apertureIndex').attr({max: APERTURE_DATA.length - 1});
    $('#cocIndex').attr({max: COC_DATA.length - 1});

    var dofGraph = new Chart(
        document.getElementById('dofGraph'),
        {
          type: 'line',
          data: {
            labels: FOCUS_DISTANCE_DATA,
            datasets: [
                {
                  label: 'DoF Near',
                  fill: false,
                  borderColor: '#0b5ed7',
                  data: [],
                  cubicInterpolationMode: 'monotone'
                },
                {
                  label: 'DoF Far',
                  fill: false,
                  borderColor: '#dc3545',
                  data: [],
                  cubicInterpolationMode: 'monotone'
                }
            ]
          },
          options: {}
        }
    );

    $(document).on('input', '#focalLengthIndex', function() {
        setFocalLength();
        updateGraph(dofGraph);
    });
    $(document).on('input', '#apertureIndex', function() {
        setAperture();
        updateGraph(dofGraph);
    });
    $(document).on('input', '#cocIndex', function() {
        setCoc();
        updateGraph(dofGraph);
    });

    setFocalLength();
    setAperture();
    setCoc();
    updateGraph(dofGraph);
});