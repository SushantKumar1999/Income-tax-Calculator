$(document).ready(function() {
    // Enable tooltips
    $('[data-toggle="tooltip"]').tooltip();

    // Show error icon and tooltip on invalid input
    $('#taxCalculatorForm input[type="number"]').on('input', function() {
        var isValid = $(this).get(0).checkValidity();
        var errorIcon = $(this).siblings('.input-group-append').find('.error-icon');
        var tooltipMessage = isValid ? '' : $(this).siblings('.invalid-feedback').text();
        errorIcon.toggleClass('d-none', isValid);
        errorIcon.attr('title', tooltipMessage);
    });

    // Handle form submission
    $('#taxCalculatorForm').submit(function(event) {
        event.preventDefault();
        var ageGroup = $('#ageGroup').val();
        if (ageGroup === "") {
            // Show error icon and tooltip for age group field
            var ageGroupErrorIcon = $('#ageGroup').siblings('.invalid-feedback').find('.error-icon');
            ageGroupErrorIcon.removeClass('d-none');
            ageGroupErrorIcon.tooltip('show');
        } else {
            // Proceed with tax calculation if age group is selected
            calculateTax();
        }
    });
});

function validateInput(input) {
    var value = input.value;
    var infoIcon = $(input).parent().find('.info-icon');
    var errorFeedback = $(input).parent().find('.invalid-feedback');
    if (!/^\d+$/.test(value)) {
        infoIcon.removeClass('d-none');
        errorFeedback.removeClass('d-none');
        $(input).addClass('invalid-input');
    } else {
        infoIcon.addClass('d-none');
        errorFeedback.addClass('d-none');
        $(input).removeClass('invalid-input');
    }
    if (value === '') {
        infoIcon.addClass('d-none');
        $(input).removeClass('invalid-input');
    }
}


function calculateTax() {
    var grossIncome = parseFloat($('#grossIncome').val());
    var extraIncome = parseFloat($('#extraIncome').val() || 0);
    var ageGroup = $('#ageGroup').val();

    var age;
    if (ageGroup === 'below40') {
        age = 39; // Setting age to 39 for below 40 group
    } else if (ageGroup === 'between40and60') {
        age = 50; // Setting age to 50 for between 40 and 60 group
    } else if (ageGroup === 'above60') {
        age = 61; // Setting age to 61 for above 60 group
    }
    
   var totalDeductions = parseFloat($('#totalDeductions').val() || 0);
   // Calculate total income after deductions
   var totalIncome = grossIncome + extraIncome - totalDeductions;
   
   console.log(totalIncome);
   // Calculate tax based on income and age
   var tax;
    if (totalIncome <= 800000) {
        // No tax if total income is under or equal to 8 Lakhs
        tax = 0;
    } else {
        // Calculate tax based on income exceeding 8 Lakhs and age
        var taxableIncome = totalIncome - 800000;
        if (age < 40) {
            // 30% tax for people with age < 40
            tax = 0.3 * taxableIncome;
        } else if (age >= 40 && age < 60) {
            // 40% tax for people with age ≥ 40 but < 60
            tax = 0.4 * taxableIncome;
        } else {
            // 10% tax for people with age ≥ 60
            tax = 0.1 * taxableIncome;
        }
    }
    console.log(tax);
    var overall = totalIncome - tax;

    // Display the result in a modal
    $('#taxResultModal').modal('show');
    $('#taxValue').text('₹' + tax.toFixed(2));
    $('#overallIncome').text('₹' +'' + overall.toFixed(2));
}
