var OCTAVES = {
    "1": "Контроктава",
    "2": "Большая октава",
    "3": "Малая октава",
    "4": "Первая октава",
    "5": "Вторая октава",
    "6": "Третья октава",
    "7": "Четвертая октава"
};
var NOTES = {
    "c": "До",
    "d": "Ре",
    "e": "Ми",
    "f": "Фа",
    "g": "Соль",
    "a": "Ля",
    "b": "Си"
};
var CLEFS = ["treble", "bass"];
var ACCIDENTALS = [null, "#", "b"];
var ACCIDENTAL_NAMES = {null: "", "#": "-диез", "b": "-бемоль"};
var CLEF_NOTES = {
    "treble": [
        ["c/3", "d/3", "e/3", "f/3", "g/3", "a/3", "b/3"],
        ["c/4", "d/4", "e/4", "f/4", "g/4", "a/4", "b/4"],
        ["c/5", "d/5", "e/5", "f/5", "g/5", "a/5", "b/5"],
        ["c/6", "d/6", "e/6", "f/6", "g/6", "a/6", "b/6"],
        ["c/7"]
    ],
    "bass": [
        ["c/1", "d/1", "e/1", "f/1", "g/1", "a/1", "b/1"],
        ["c/2", "d/2", "e/2", "f/2", "g/2", "a/2", "b/2"],
        ["c/3", "d/3", "e/3", "f/3", "g/3", "a/3", "b/3"],
        ["c/4", "d/4", "e/4", "f/4", "g/4", "a/4", "b/4"],
        ["c/5"]
    ]
};
