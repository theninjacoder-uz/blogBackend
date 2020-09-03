const handleErrors = (err) => {

    let errors = { email: '', password: '' };

    if(err.message === 'incorrect email'){
        errors.email = 'Incorrect email';
        return errors;
    }

    if(err.message === 'incorrect password'){
        errors.password = 'Incorrect password';
        return errors;
    }

    if(err.code === 11000) {
        errors.email = 'This email is already registered';
        return errors;
    }

    if(err.message.include( 'user validation failed' )){
        
        Object.keys(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
        return errors;
    }
}