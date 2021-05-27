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

		distanceList.sort((a, b) => a - b);
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
});
