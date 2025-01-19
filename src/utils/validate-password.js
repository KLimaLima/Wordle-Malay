const bcrypt = require('bcrypt');
salt_rounds = 10;

const PASSWORD_POLICY = {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL: true,
    REQUIRE_UPPER_LOWER: true
};

const MAX_ATTEMPTS = 5;
const BLOCK_DURATION_MS = 5 * 60 * 1000; // 5 minute
const failedAttempts = new Map();

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

    let { username, password } = req.body;

    //check if username exist in database
    if(!res.locals.user_exist) {
        res.status(400).send(`username ${req.body.username} not found`)
        return
    }

    //check if client gave password
    if(!username || !password) {
        res.status(400).send('Please enter username and password')
        return
    }

    // Retrieve failed attempts for this user
    const userAttempts = failedAttempts.get(username) || { count: 0, blockedUntil: null };

    // Check if the user is blocked
    if (userAttempts.blockedUntil && Date.now() < userAttempts.blockedUntil) {
        const timeLeft = Math.ceil((userAttempts.blockedUntil - Date.now()) / 1000);
        res.status(403).send(`Account is blocked. Try again in ${timeLeft} seconds.`);
        return;
    }

    // Validate password
    if (!bcrypt.compareSync(password, res.locals.account.password)) {
        userAttempts.count += 1;

        if (userAttempts.count >= MAX_ATTEMPTS) {
            userAttempts.blockedUntil = Date.now() + BLOCK_DURATION_MS; // Block the user
            userAttempts.count = 0; // Reset count after blocking
            failedAttempts.set(username, userAttempts);
            res.status(403).send('Too many failed attempts. Account is blocked for 5 minutes.');
        } else {
            failedAttempts.set(username, userAttempts);
            res.status(401).send(`Incorrect password. You have ${MAX_ATTEMPTS - userAttempts.count} attempts left.`);
        }

        return;
    }

    // Reset attempts on successful login
    failedAttempts.delete(username);

    next()
}

module.exports = { validate_password, enforcePasswordPolicy }