$(document).ready(function() {
	class ValidationError extends Error {
		constructor(message) {
			super(message);
			this.name = "ValidationError";
		}
	}
	
	$('#btnCalc').click(function() {
		if (!checkFormValidity()) {
			return;
		}
		
		var focalLength = getFocalLength();
		var aperture = getAperture();
		var coc = getCoc();
		var focusDistanceList = getFocusDistanceList();
		
		renderInputData(focalLength, aperture, coc);
		renderDof(focalLength, aperture, coc, focusDistanceList);
		renderHyperFocal(focalLength, aperture, coc);
		$('.result').removeClass('d-none');
	});
	
	$('#btnInputFocalLength').click(function() {
		var newFocalLength = prompt('Input focal length (mm)');
		if (newFocalLength != null && newFocalLength != '') {
			$('#focalLengthSelect').append($('<option>', {value: newFocalLength, text: newFocalLength, selected: true}));	
		}
	});
	
	$('#btnInputAperture').click(function() {
		var newAperture = prompt('Input aperture');
		if (newAperture != null && newAperture != '') {
			$('#apertureSelect').append($('<option>', {value: newAperture, text: newAperture, selected: true}));
		}
	});
	
	$('#btnInputCoc').click(function() {
		var newCoc = prompt('Input Circle of Confusion (mm)');
		if (newCoc != null && newCoc != '') {
			$('#cocSelect').append($('<option>', {value: newCoc, text: newCoc, selected: true}));	
		}
	});
	
	function checkFormValidity() {
		var checkConditions = [
			['#focalLengthInvalid', getFocalLength],
			['#apertureInvalid', getAperture],
			['#cocInvalid', getCoc],
			['#focusDistanceListInvalid', getFocusDistanceList]
		];
		var result = true;

		$.each(checkConditions, function (index, value) {
			var htmlObj = value[0];
			var func = value[1];
			
			try {
				func();
				$(htmlObj).addClass('d-none');
			} catch (e) {
				if (e instanceof ValidationError) {
					$(htmlObj).removeClass('d-none');
					result = false;
				}				
			}
		});
		
		return result;
	}
	
	function getFocalLength() {
		var val = parseInt($('#focalLengthSelect').val());
		if (Number.isNaN(val)) {
			throw new ValidationError('Invalid focal length');
		}
		return val;
	}
	
	function getAperture() {
		var val = parseFloat($('#apertureSelect').val().replace(',', '.'));
		if (Number.isNaN(val)) {
			throw new ValidationError('Invalid aperture');
		}		
		return val;
	}
	
	function getCoc() {
		var val = parseFloat($('#cocSelect').val().replace(',', '.'));
		if (Number.isNaN(val)) {
			throw new ValidationError('Invalid Circle of Confusion');
		}		
		return val;		
	}
	
	function getFocusDistanceList() {
		var splitted = $('#focusDistanceList').val().split(';');
		var distanceList = [];
		
		$.each(splitted, function (index, value) {
			var floatValue = parseFloat(value.replace(',', '.'));
			if (Number.isNaN(floatValue)) {
				throw new ValidationError('Invalid focus distance');
			}
			distanceList.push(floatValue);
		});
		
		return distanceList;
	}
	
	function renderInputData(focalLength, aperture, coc) {
		$('#focalLength').text(focalLength);
		$('#aperture').text(aperture);
		$('#coc').text(coc);
	}
	
	function renderDof(focalLength, aperture, coc, focusDistanceList) {
		$('#dofTable').empty();
		$.each(focusDistanceList, function (index, focusDistance) {
			var dof = dofCalculate(focusDistance, focalLength, aperture, coc);
			
			var dofRow = $('<tr>');
			dofRow.append($('<td>').text(focusDistance));
			dofRow.append($('<td>').text(dof[0]));
			dofRow.append($('<td>').text(dof[1]));
			dofRow.append($('<td>').text(dof[2]));
			$('#dofTable').append(dofRow);
		});
	}
	
	function renderHyperFocal(focalLength, aperture, coc) {
		var hyperFocal = hyperFocalCalculate(focalLength, aperture, coc);
		$('#hyperFocal').text(hyperFocal[0]);
		$('#hyperFocal2').text(hyperFocal[1]);
	}
	
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
});
