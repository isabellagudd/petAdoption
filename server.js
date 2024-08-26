const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const ejs = require('ejs');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
const PORT = 3000;
// Session middleware
app.use(session({
    secret: 'bella3',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));
const usersFile = path.join(__dirname, 'data', 'login.txt');
const petsFile = path.join(__dirname, 'data', 'pets.txt');

// root
app.get('/', (req, res) => {
    res.render('home');
});
app.get('/home', (req, res) => {
    res.render('home');
});
app.get('/catCare', (req, res) => {
    res.render('catCare');
});
app.get('/contact', (req, res) => {
    res.render('contact');
});
app.get('/dogCare', (req, res) => {
    res.render('dogCare');
});
app.get('/find', (req, res) => {
    res.render('find');
});
app.get('/giveAway', (req, res) => {
    res.render('giveAway');
});
app.get('/login', (req, res) => {
    res.render('login');
});
app.get('/privacyStatement', (req, res) => {
    res.render('privacyStatement');
});
app.get('/searchResults', (req, res) => {
    res.render('searchResults');
});

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/partials', express.static(path.join(__dirname, 'views', 'partials')));

// Middleware to inject header and footer
app.use((req, res, next) => {
    ejs.renderFile(path.join(__dirname, 'views', 'partials', 'header.ejs'), { user: req.session.user }, (err, header) => {
        if (err) return res.status(500).send('Error loading header');
        ejs.renderFile(path.join(__dirname, 'views', 'partials', 'footer.ejs'), (err, footer) => {
            if (err) return res.status(500).send('Error loading footer');
            res.locals.header = header;
            res.locals.footer = footer;
            next();
        });
    });
});

// Utility function to read data from text files
function readData(filePath, callback) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) return callback(err);
        const parsedData = data.trim().split('\n').map(line => line.split(':'));
        callback(null, parsedData);
    });
}

// Serve the main page with the login creation form
app.get('/register', (req, res) => {
    res.render('register');
});

// Handle account creation form submission
app.post('/create-account', (req, res) => {
    const { username, password } = req.body;

    // Check if username already exists
    fs.readFile(usersFile, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading login file.');
        }
        const users = data.split('\n').map(line => line.split(':')[0]);
        if (users.includes(username)) {
            return res.send('Username already exists. Please choose a different username.');
        }

        // Add new user to the login file
        fs.appendFile(usersFile, `${username}:${password}\n`, (err) => {
            if (err) {
                return res.status(500).send('Error writing to login file.');
            }
            res.send('Account created successfully! You can now log in.');
        });
    });
});

// Handle user login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    fs.readFile(usersFile, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Server error');
            return;
        }

        // Check if credentials are valid
        const users = data.split('\n').map(line => {
            const [user, pass] = line.split(':');
            return { user, pass };
        });

        const user = users.find(u => u.user === username && u.pass === password);
        if (user) {
            req.session.user = { username };
            res.send('You are now logged in!')
        } else {
            res.send('Invalid username or password. Please try again.')
        }
    });
});

app.post('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).send('Error logging out. Please try again.');
            }
            res.redirect('/home'); 
        });
    } else {
        res.send('Logout Successful!');
        res.redirect('/login');
    }
});

// Handle pet information form submission
app.post('/submit-pet-info', (req, res) => {
    if (!req.session.user) {
        return res.status(403).send('You must be logged in to submit pet information.');
    }

    const {
        animal,
        breed,
        age,
        gender,
        alongDogs,
        alongCats,
        alongKids,
        comments,
        givenName,
        familyName,
        email
    } = req.body;

    // Read the pets file to find the highest ID
    fs.readFile(petsFile, 'utf8', (err, data) => {
        if (err && err.code !== 'ENOENT') {
            console.error('Error reading pets file:', err);
            return res.status(500).send('Error reading pets file.');
        }

        let highestId = 0;
        if (data) {
            const lines = data.trim().split('\n');
            lines.forEach(line => {
                const parts = line.split(':');
                const id = parseInt(parts[0], 10);
                if (!isNaN(id) && id > highestId) {
                    highestId = id;
                }
            });
        }

        // Increment the ID for the new entry
        const newId = highestId + 1;

        // Construct pet data string
        const petData = [
            newId,
            req.session.user.username,
            animal,
            breed,
            age,
            gender,
            alongDogs,
            alongCats,
            alongKids,
            comments,
            givenName,
            familyName,
            email
        ].join(':');

        // Append new pet data to pets file
        fs.appendFile(petsFile, `${petData}\n`, (err) => {
            if (err) {
                console.error('Error writing to pets file:', err);
                return res.status(500).send('Error writing to pets file.');
            }

            res.send('Pet information submitted successfully!');
        });
    });
});

// Handle form submission for finding pets
app.post('/find-pet', (req, res) => {
    const { catBreed, dogBreed, age, gender, coexisting, animal } = req.body;
    const breeds = animal === 'cat' ? catBreed : dogBreed;

    fs.readFile(petsFile, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading pets file:', err);
            return res.status(500).send('Error reading pets file.');
        }

        // Filter pets based on form criteria
        const pets = data.trim().split('\n').map(line => line.split(':'));
        const filteredPets = pets
            .map(pet => {
                const [id, owner, petType, breed, petAge, petGender, alongDogs, alongCats, alongKids, comments, givenName, familyName, email] = pet;
                return { id, owner, petType, breed, petAge, petGender, alongDogs, alongCats, alongKids, comments, givenName, familyName, email };
            })
            .filter(pet => {
                // Check pet type
                if (animal && pet.petType !== animal) {
                    return false;
                }

                // Check breed
                if (breeds && breeds.length > 0 && !breeds.includes(pet.breed) && !breeds.includes('all')) {
                    return false;
                }

                // Check age
                if (age && age !== "Doesn't Matter" && age !== pet.petAge) {
                    return false;
                }

                // Check gender
                if (gender && gender !== 'any' && gender !== pet.petGender) {
                    return false;
                }

                // Check coexisting
                if (coexisting === 'yes' && (pet.alongDogs === 'no' || pet.alongCats === 'no' || pet.alongKids === 'no')) {
                    return false;
                } else if (coexisting === 'no' && (pet.alongDogs === 'yes' || pet.alongCats === 'yes' || pet.alongKids === 'yes')) {
                    return false;
                }

                return true;
            });

        // Render the EJS template with the filtered pets
        res.render('searchResults', { pets: filteredPets });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
