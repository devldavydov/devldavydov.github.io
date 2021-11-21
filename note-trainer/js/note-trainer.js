$(document).ready(function() {
    var showNote = false;
    var totalNotes = {'treble': [], 'bass': []};
    var totalClefs = [];

    function drawNote(clef, note, accidental=null) {
        VF = Vex.Flow;

        var renderer = new VF.Renderer(document.getElementById('note'), VF.Renderer.Backends.SVG);
        renderer.resize(200, 280);
        var context = renderer.getContext();
        context.scale(1.5, 1.5);
        var stave = new VF.Stave(0, 30, 280);
        stave.addClef(clef);
        stave.setContext(context).draw();

        var staveNote = new VF.StaveNote({'clef': clef, 'keys': [note], 'duration': '1'});
        if (accidental != null) {
            staveNote.addAccidental(0, new VF.Accidental(accidental))
        }
        var notes = [staveNote];
        var voice = new VF.Voice({'num_beats': 1, 'beat_value': 1});
        voice.addTickables(notes);
        var formatter = new VF.Formatter().joinVoices([voice]).format([voice], 200);

        voice.draw(context, stave);
    }

    function randomBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getNoteText(note, accidental) {
        var noteName = NOTES[note[0]] + ACCIDENTAL_NAMES[accidental];
        var octaveName = OCTAVES[note[2]];
        return noteName + ", " + octaveName;
    }

    function initTraining() {
        $('#note').empty();
        var clef = totalClefs[Math.floor(Math.random() * totalClefs.length)];
        var note = totalNotes[clef][Math.floor(Math.random() * totalNotes[clef].length)];
        var accidental = ACCIDENTALS[Math.floor(Math.random() * ACCIDENTALS.length)]
        $('#noteAnswer').text('Что это за нота?');
        $('#noteAnswer').attr('note', getNoteText(note, accidental));
        $('#btnNote').text('Показать ответ');
        drawNote(clef, note, accidental);
        showNote = true;
    }

    $('#btnNote').click(function() {
        if (!showNote) {
            initTraining();
        } else {
            $('#noteAnswer').text($('#noteAnswer').attr('note'));
            $('#btnNote').text('Следующая нота');
            showNote = false;
        }
    });

    $('#btnStart').click(function() {
        $('.treble-check:checkbox:checked').each(function() {
            var notes = this.id.split('.');
            totalNotes['treble'] = totalNotes['treble'].concat(CLEF_NOTES[notes[0]][parseInt(notes[1])]);
        });
        $('.bass-check:checkbox:checked').each(function() {
            var notes = this.id.split('.');
            totalNotes['bass'] = totalNotes['bass'].concat(CLEF_NOTES[notes[0]][parseInt(notes[1])]);
        });
        if (totalNotes['treble'].length > 0)
            totalClefs.push('treble')
        if (totalNotes['bass'].length > 0)
            totalClefs.push('bass')

        if (totalClefs.length == 0) {
            alert('Не заданы диапазоны нот!');
            return;
        }

        console.log('Total clefs: ' + JSON.stringify(totalClefs));
        console.log('Total notes: ' + JSON.stringify(totalNotes));

        $('#setup').hide();
        $('#training').show();
        initTraining();
    });
});
