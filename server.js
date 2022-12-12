const express = require('express')

const app = express()

// socketio

const http = require('http')
const server = http.createServer(app)
const {
    Server
} = require('socket.io')

const io = new Server(server)

let x_points = []
let o_points = []

function containsAll(needles, haystack) {
    for (var i = 0; i < needles.length; i++) {
        if(!haystack.includes(needles[i])) return false
    }
    return true;
}

// win cases

let win_cases = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7]
]

function check_win_case(arr) {
    for(let c of win_cases){
        if(containsAll(c, arr)){
            return true
        }
    }
    return false
}

let test_win_case = ['2', '5', '7']

console.log(test_win_case);

console.log(check_win_case(test_win_case))

{ // EJS
    app.engine('html', require('ejs').__express)
    app.use(express.static('public'))
    app.set('view engine', 'html')
}

app.get('/', (req, res) => {
    res.render('index', {

    })
})

io.on('connection', (socket) => {
    console.log('user connected!');
    socket.on('on-select', (arg) => {
        console.log(arg);
        if(arg.team == 0){
            o_points.push(Number(arg.id))
        } else if(arg.team == 1){
            x_points.push(Number(arg.id))
        }
        console.log(o_points);
        console.log(x_points);
        if(check_win_case(o_points)){
            console.log('O win!');
            io.emit('user-win', 0)
        } else if(check_win_case(x_points)){
            console.log('X win!');
            io.emit('user-win', 1)
        }
        io.emit('user-select', arg)
    })

})

server.listen(8080, () => {
    console.log('App running on http://localhost:8080');
})