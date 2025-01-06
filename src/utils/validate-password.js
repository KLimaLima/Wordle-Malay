const bcrypt = require('bcrypt');
salt_rounds = 10;

const PASSWORD_POLICY = {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL: true,
    REQUIRE_UPPER_LOWER: true
}

function validatePasswordPolicy(password) {

    const errors = [];

    if (password.length < PASSWORD_POLICY.MIN_LENGTH) {
        errors.push(`Password must be at least ${PASSWORD_POLICY.MIN_LENGTH} characters\n`);
    }

    if (password.length > PASSWORD_POLICY.MAX_LENGTH) {
        errors.push(`Password must be at most ${PASSWORD_POLICY.MAX_LENGTH} characters\n`);
    }

    if (PASSWORD_POLICY.REQUIRE_NUMBER && !password.match(/[0-9]/)) {
        errors.push('Password must contain at least one number\n');
    }

    if (PASSWORD_POLICY.REQUIRE_SPECIAL && !password.match(/[^a-zA-Z0-9]/)) {
        errors.push('Password must contain at least one special character\n');
    }

    if (PASSWORD_POLICY.REQUIRE_UPPER_LOWER && !(password.match(/[a-z]/) && password.match(/[A-Z]/))) {
        errors.push('Password must contain at least one uppercase and one lowercase letter\n');
    }

    return errors;
}

function enforcePasswordPolicy(req, res, next) {
    const { password } = req.body;

    if (!password) {
        res.status(400).send('Password is required.');
        return;
    }

    const policyErrors = validatePasswordPolicy(password);

    if (policyErrors.length > 0) {
        res.status(400).send(`Password does not meet  requirements: ${policyErrors.join(' ')}`);
        return;
    }

    next();
}

function validate_password(req, res, next) {

    let { password } = req.body

    //check if username exist in database
    if(!res.locals.user_exist) {
        res.status(400).send(`username ${req.body.username} not found`)
        return
    }

    //check if client gave password
    if(!password) {
        res.status(400).send('Please enter a password')
        return
    }

    //check if the password given same as password in database
    if(!(bcrypt.compareSync(password, res.locals.account.password))) {
        res.status(400).send('Password is incorrect')
        return
    }

    next()
}

module.exports = { validate_password, enforcePasswordPolicy }