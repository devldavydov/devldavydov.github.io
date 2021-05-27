var FOCAL_LENGTH_DATA = [17, 20, 28, 35, 55];
var APERTURE_DATA = [2.8, 3.2, 3.5, 4, 4.5, 5, 5.6, 6.3, 7.1, 8, 9, 10, 11, 13, 14, 16, 18, 20, 22];

function dofCalculate(focusDistance, focalLength, aperture, circleOfConfusion) {
    // https://ru.wikipedia.org/wiki/%D0%93%D0%BB%D1%83%D0%B1%D0%B8%D0%BD%D0%B0_%D1%80%D0%B5%D0%B7%D0%BA%D0%BE_%D0%B8%D0%B7%D0%BE%D0%B1%D1%80%D0%B0%D0%B6%D0%B0%D0%B5%D0%BC%D0%BE%D0%B3%D0%BE_%D0%BF%D1%80%D0%BE%D1%81%D1%82%D1%80%D0%B0%D0%BD%D1%81%D1%82%D0%B2%D0%B0
    var f = focalLength * 0.001;
    var f2 = Math.pow(f, 2);
    var R = focusDistance;
    var K = aperture;
    var z = circleOfConfusion * 0.001;

    var Rf2 = R * f2;
    var Kfz = K * f * z;
    var KRz = K * R * z;

    var R1 = Rf2 / (f2 - Kfz + KRz);
    var R2 = Rf2 / (f2 + Kfz - KRz);

    return [R1.toFixed(2), R2 < 0 ? 'inf' : R2.toFixed(2), R2 < 0 ? 'inf' : (R2 - R1).toFixed(2)];
}

function hyperFocalCalculate(focalLength, aperture, circleOfConfusion) {
    var f = focalLength * 0.001;
    var f2 = Math.pow(f, 2);
    var K = aperture;
    var z = circleOfConfusion * 0.001;

    var H = f2 / (K * z) + f;
    return [H.toFixed(2), (H / 2).toFixed(2)];
}
