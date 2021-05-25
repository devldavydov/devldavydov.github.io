$(document).ready(function() {
	class ValidationError extends Error {
		constructor(message) {
			super(message);
			this.name = "ValidationError";
		}
	}
	
	$('#focalLengthSelect').change(function() {
		var selectVal = $(this).val();
		$('#focalLength').val(selectVal == '>>>' ? '' : selectVal);
	});
	 
	$('#appertureSelect').change(function() {
		var selectVal = $(this).val();
		$('#apperture').val(selectVal == '>>>' ? '' : selectVal);
	});
	
	$('#btnCalc').click(function() {
		if (!checkFormValidity()) {
			return;
		}
		
		var focalLength = getFocalLength();
		var apperture = getApperture();
		var coc = getCoc();
		var focusDistanceList = getFocusDistanceList();
		
		renderDof(focalLength, apperture, coc, focusDistanceList);
		renderHyperFocal(focalLength, apperture, coc);
		$('#result').removeClass('d-none');
	});
	
	function checkFormValidity() {
		var checkConditions = [
			['#focalLengthInvalid', getFocalLength],
			['#appertureInvalid', getApperture],
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
		var val = parseInt($('#focalLength').val());
		if (Number.isNaN(val)) {
			throw new ValidationError('Invalid focal length');
		}
		return val;
	}
	
	function getApperture() {
		var val = parseFloat($('#apperture').val());
		if (Number.isNaN(val)) {
			throw new ValidationError('Invalid apperture');
		}		
		return val;
	}
	
	function getCoc() {
		return parseFloat($('#coc').val());
	}
	
	function getFocusDistanceList() {
		var splitted = $('#focusDistanceList').val().split(';');
		var distanceList = [];
		
		$.each(splitted, function (index, value) {
			var floatValue = parseFloat(value);
			if (Number.isNaN(floatValue)) {
				throw new ValidationError('Invalid focus distance');
			}
			distanceList.push(floatValue);
		});
		
		return distanceList;
	}
	
	function renderDof(focalLength, apperture, coc, focusDistanceList) {
		$('#dofTable').empty();
		debugger;
		$.each(focusDistanceList, function (index, focusDistance) {
			var dof = dofCalculate(focusDistance, focalLength, apperture, coc);
			
			var dofRow = $('<tr>');
			dofRow.append($('<td>').text(focusDistance));
			dofRow.append($('<td>').text(dof[0]));
			dofRow.append($('<td>').text(dof[1]));
			dofRow.append($('<td>').text(dof[2]));
			$('#dofTable').append(dofRow);
		});
	}
	
	function renderHyperFocal(focalLength, apperture, coc) {
		var hyperFocal = hyperFocalCalculate(focalLength, apperture, coc);
		$('#hyperFocal').text(hyperFocal[0]);
		$('#hyperFocal2').text(hyperFocal[1]);
	}
	
	function dofCalculate(focusDistance, focalLength, apperture, circleOfConfusion) {
		// https://ru.wikipedia.org/wiki/%D0%93%D0%BB%D1%83%D0%B1%D0%B8%D0%BD%D0%B0_%D1%80%D0%B5%D0%B7%D0%BA%D0%BE_%D0%B8%D0%B7%D0%BE%D0%B1%D1%80%D0%B0%D0%B6%D0%B0%D0%B5%D0%BC%D0%BE%D0%B3%D0%BE_%D0%BF%D1%80%D0%BE%D1%81%D1%82%D1%80%D0%B0%D0%BD%D1%81%D1%82%D0%B2%D0%B0		
		var f = focalLength * 0.001;
		var f2 = Math.pow(f, 2);
		var R = focusDistance;
		var K = apperture;
		var z = circleOfConfusion * 0.001;
		
		var Rf2 = R * f2;
		var Kfz = K * f * z;
		var KRz = K * R * z;
		
		var R1 = Rf2 / (f2 - Kfz + KRz);
		var R2 = Rf2 / (f2 + Kfz - KRz);
		
		return [R1.toFixed(2), R2 < 0 ? 'inf' : R2.toFixed(2), R2 < 0 ? 'inf' : (R2 - R1).toFixed(2)];
	}
	
	function hyperFocalCalculate(focalLength, apperture, circleOfConfusion) {
		var f = focalLength * 0.001;
		var f2 = Math.pow(f, 2);
		var K = apperture;
		var z = circleOfConfusion * 0.001;
		
		var H = f2 / (K * z) + f;
		return [H.toFixed(2), (H / 2).toFixed(2)];
	}
});
