$(document).ready(function() {
    function drawNote(clef, note, accidental=null) {
        VF = Vex.Flow;

        var renderer = new VF.Renderer(document.getElementById('note'), VF.Renderer.Backends.SVG);
        renderer.resize(200, 210);
        var context = renderer.getContext();
        var stave = new VF.Stave(0, 50, 210);
        stave.addClef(clef);
        stave.setContext(context).draw();

        var staveNote = new VF.StaveNote({clef: clef, keys: [note], duration: "1"});
        if (accidental != null) {
            staveNote.addAccidental(0, new VF.Accidental(accidental))
        }
        var notes = [staveNote];
        var voice = new VF.Voice({num_beats: 1, beat_value: 1});
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
        var clef = CLEFS[Math.floor(Math.random() * CLEFS.length)];
        var note = CLEF_NOTES[clef][Math.floor(Math.random() * CLEF_NOTES[clef].length)];
        var accidental = ACCIDENTALS[Math.floor(Math.random() * ACCIDENTALS.length)]
        $('#noteAnswer').text('Что это за нота?');
        $('#noteAnswer').attr('note', getNoteText(note, accidental));
        drawNote(clef, note, accidental);
    }

    $('#btnNextNote').click(function() {
        initTraining();
    });

    $('#btnShowAnswer').click(function() {
        $('#noteAnswer').text($('#noteAnswer').attr('note'));
    });

    initTraining();
});
