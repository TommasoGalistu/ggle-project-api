require('dotenv').config();
const bcrypt = require('bcrypt');
const User = require('../model/userModel');
const jwt = require('jsonwebtoken');
const Todo = require('../model/toDoModel')
const tokenSchema = require('../model/tokenModel')
const oauth2Client = require('../utility/googleAuth')
const {encrypt, decrypt} = require('../utility/cryptAndDecript');
const { google } = require('googleapis');

const TIME_TO_REPEAT = 15

const userController = {
    register: async (req, res) =>{
        try{
            const existingUser = await User.findOne({email: req.body.email})

            if(existingUser){
                return res.status(400).json({error: "Email già presente"})
            }

            const passwordBcrypt = await bcrypt.hash(req.body.password, TIME_TO_REPEAT);
            const user = new User({...req.body, password: passwordBcrypt});
            await user.save();

            res.status(200).json(user);
        }catch(error){
            res.status(400).json({error: error.message})
        }
    },
    login: async (req, res) =>{
        try{
            const {email, password} = req.body
            const user = await User.findOne({email: email})

            if(!user){
                return res.status(400).json({error: "Email o password errata"})
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch){
                return res.status(400).json({error: "Email o password errata"})
            }


            const token = jwt.sign(
                {id: user._id, email: user.email, ip: req.ip},
                process.env.JWT_SECRET,
                {
                    expiresIn: '1d'
                }
            )

            res.cookie('token', token, {
                httpOnly: true,  // Protegge il token da JavaScript (XSS)
                // // secure: process.env.NODE_ENV === "production", // Solo HTTPS in produzione
                // sameSite: "None", // Previene attacchi CSRF
                // secure: false, //Richiede HTTPS (NON funziona su localhost)
                maxAge: 24 * 60 * 60 * 1000, // Scadenza: 1 giorno
                // path: "/", // Disponibile su tutto il sito
                // domain: "tuodominio.com" // (Opzionale) Disponibile solo su questo dominio
            })

            res.status(200).json({message: "Login riuscito!!", email, token: token})
        }catch(error){
            res.status(400).json({error: error.message})
        }
    },
    logout: async (req,res) => {

        try{
            const token = req.cookies.token; 

            if(token){
                res.clearCookie("token", {
                    httpOnly: true
                });
                res.status(200).json({message: "Logout effettuato con successo"})
            }
        }catch(error){
            res.status(400).json({error: error.message})
        }
        

        
    },
    check: async (req, res) =>{
        try{
            const token = req.cookies.token; 
            const decoded = jwt.verify(token, process.env.JWT_SECRET); 
            
            if(decoded){
                res.status(200).json({message: true, user: decoded.email})
            }else{
                res.status(201).json({message: false})
            }
        }catch(error){
            res.status(400).json({ message: "Controllo fallito!!" })
        }
    },
    getUsers: async (req, res) =>{
        try{

            const users = await User.find({role: "admin"}).select('name surname email').sort({ username: -1 });
            if(!users) throw new Error()
            
            return res.status(200).json(users);
            

        }catch(error){
            return res.status(400).json(error);
        }
    },
    getUser: async (req, res) =>{
        const id = req.params.id;

        try{

            const user = await User.findById(id).select('name surname email').sort({ username: -1 });
            if(!user) throw new Error()
            
            return res.status(200).json(user);
            

        }catch(error){
            return res.status(400).json(error);
        }

    },
    authGggle: async (req, res) =>{
        const {id} = req.body;
        
        const scopes = [
        'https://www.googleapis.com/auth/calendar.readonly',
        'https://www.googleapis.com/auth/calendar.events',
        ];

        const url = oauth2Client.generateAuthUrl({
            access_type: 'offline', //se offline da il refresh token
            scope: scopes,
            prompt: 'consent', //forza il consenso per il refresh token
            state: id //per sapere a chi salvarlo
        })

        res.status(200).send({url})
    },
   
    googleCallback: async (req, res) => {
        const code = req.query.code;
        const id = req.query.state;

        try {
            const { tokens } = await oauth2Client.getToken(code);
            
            if (!tokens.refresh_token) {
            return res
                .status(400)
                .send("Autenticazione completata, ma manca il refresh token. Rimuovi l'autorizzazione da Google e riprova.");
            }
            let refresh_token_crypt = encrypt(tokens.refresh_token)
            // Qui salvi il refresh_token in modo sicuro
            await User.findByIdAndUpdate(
                id,
                { refresh_token: refresh_token_crypt},
                { new: true }
            );
            

            // Puoi anche aggiornare oauth2Client con i token se vuoi usarlo subito
            oauth2Client.setCredentials(tokens);
            console.log(tokens.expiry_date)
            const msg = encodeURIComponent("Calendario configurato con successo!");
            res.redirect(`http://localhost:5173/elenco-admin/${id}?msg=${msg}`);
        } catch (err) {
            console.error("Errore nel callback Google:", err);
            res.status(500).send("Errore durante l'autenticazione Google.");
        }
    },
    getAdminCalendarEvents: async (req, res) => {
        const { id } = req.params; // ID dell’amministratore
        
        try {
            const user = await User.findById(id);
            
            if (!user || !user.refresh_token) {
                return res.status(404).json({ error: "Calendario non collegato per questo admin" });
            }
            
            // 2. Crea client OAuth con le credenziali
            const oauth2Client = new google.auth.OAuth2(
                process.env.GOOGLE_CLIENT_ID,
                process.env.GOOGLE_CLIENT_SECRET,
                process.env.GOOGLE_REDIRECT_URI
            );
            const refresh_token_decrypt = decrypt(user.refresh_token)
            
            oauth2Client.setCredentials({ refresh_token: refresh_token_decrypt });

            // 3. Chiamata all'API Calendar
            const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
            const response = await calendar.events.list({
                calendarId: 'primary',
                timeMin: new Date().toISOString(),
                maxResults: 100,
                singleEvents: true,
                orderBy: 'startTime'
            });
            
            // 4. Ritorna gli eventi come JSON
            return res.status(200).json(response.data.items);

        } catch (error) {
            console.error("Errore recuperando eventi calendario:", error);
            return res.status(500).json({ error: "Errore interno nel recupero eventi" });
        }
    },
    addEventToCalendar: async (req, res) =>{
        const { id } = req.params;
        const { title, start, end } = req.body;
        console.log(id, title, start, end)
        try {
            const user = await User.findById(id);
            if (!user || !user.refresh_token) {
                return res.status(404).json({ error: "Utente o refresh token non trovato" });
            }

            const oauth2Client = new google.auth.OAuth2(
                process.env.GOOGLE_CLIENT_ID,
                process.env.GOOGLE_CLIENT_SECRET,
                process.env.GOOGLE_REDIRECT_URI
            );

            const refresh_token = decrypt(user.refresh_token);
            oauth2Client.setCredentials({ refresh_token });

            const calendar = google.calendar({ version: "v3", auth: oauth2Client });

            const event = {
                summary: title,
                start: {
                    dateTime: new Date(`${start}`).toISOString(),
                    timeZone: "Europe/Rome", // modifica in base al tuo fuso
                },
                end: {
                    dateTime: new Date(`${end}`).toISOString(),
                    timeZone: "Europe/Rome",
                },
            };

            const response = await calendar.events.insert({
                calendarId: "primary",
                resource: event,
            });

            res.status(200).json({ message: "Evento creato con successo", data: response.data });

        } catch (error) {
            console.error("Errore inserendo evento:", error);
            res.status(500).json({ error: "Errore durante l'inserimento dell'evento" });
        }
    }

}

module.exports = userController;