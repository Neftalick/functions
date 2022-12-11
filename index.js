const functions = require("firebase-functions");
const express = require('express');
const app = express();
const request = require("request");
const bodyParser = require("body-parser")
app.use(bodyParser.json());
app.set('trust proxy', true);
app.get("/", (req, res) => {
    request.get("https://epucp-a998b-default-rtdb.firebaseio.com/historial.json",{json: true}, (err,re,body) => {
        const keyHistorial = [];
        const events = [];
        const usuarios = [];
        for(key in re.body){
            keyHistorial.push(key);
            for(key2 in body[key]){
                if(key2 == "eventKey"){
                    events.push(body[key][key2])
                }
                if(key2 == "userKey"){
                    usuarios.push(body[key][key2])
                }
            }
        }
        usuarios.sort()
        events.sort()
        const listaEventos = events.filter((item,index)=>{
            return events.indexOf(item) === index;
        });
        const listaUsuarios = usuarios.filter((item,index)=>{
            return usuarios.indexOf(item) === index;
        });
        var usuario_mas_vistante 
        var cantidad = 0;
        listaUsuarios.forEach((element) => {
            var cantidadContada = usuarios.lastIndexOf(element) - usuarios.indexOf(element) + 1
            if(cantidadContada > cantidad){
                cantidad = cantidadContada;
                usuario_mas_vistante = element
            }
        })
        var evento_mas_visitado
        var eventCantidad = 0
        console.log(events)
        console.log(listaEventos)
        listaEventos.forEach((element) => {
            var cantidadContada = events.lastIndexOf(element) - events.indexOf(element) +1 
            if(cantidadContada > eventCantidad){
                eventCantidad = cantidadContada;
                evento_mas_visitado = element
            }
        })

        res.json({
            "Evento":evento_mas_visitado,
            "CantidadEvento": eventCantidad,
            "usuario":usuario_mas_vistante,
            "CantidadEventosAsistidos":cantidad
        })
    })
})

//app.listen(80);
// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//
exports.apiIOT = functions.https.onRequest(app);
