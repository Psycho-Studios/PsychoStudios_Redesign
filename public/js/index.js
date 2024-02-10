// form data collection script
import $ from 'jquery'

$('sentMessage').on('submit' , (e) => {
    // e.preventDefault();
    const name  = $('#name').val().trim();
    const email  = $('#email').val().trim();
    const phone  = $('#phone').val().trim();
    const text = $('#text').val().trim();

    const data = { 
        name,
        email,
        phone, 
        text 
    };
    
});

