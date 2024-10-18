// Import packages
require("dotenv").config();
const express = require("express");
const home = require("./routes/index");
const login = require("./routes/create-session-subscription");
var cors = require("cors");

// Middlewares
const app = express();
app.use(cors());
app.use(express.json());
// Routes
app.use("/", home);
app.use("/api/create-session-subscription", login);
// connection
const port = process.env.PORT || 9001;
app.listen(port, () => console.log(`Listening to port ${port}`));

const WebSocket = require('ws');

// Kết nối WebSocket
const ws = new WebSocket('wss://us02zpns.zoom.us/ws');

// Thực hiện khi kết nối WebSocket mở
ws.on('open', function open() {
    console.log('WebSocket connection opened.');

    // Gửi lệnh login để xác thực
    const loginCommand = {
        "type": "login",
        "user": "68igsft8rl2xur41liekda",
        "token": "vzhGQ9OrRbGrfRXm98VaX0_uW1GuiUWg_xabvPf3jKs.AG.xttjBr1CgxBHC6Y9j7yk-ntkDCjWYtwi7b9wP6erEK1M9piLr_YepuWOjY50tG04MykCol-sxPDo2BJzFTyN6NUHAIaZX6EUosBJPplbjC4yG06F2o0H7_0o5w8P1VC2QidVcGOdeSPOWzmd1UI8Cx9cJAIqwtNRVYytc7sHl4yQUGgvSjmmFawCEqFrKsqjTRtTsuIKK30gOPpzfsimG5tOvIGHsGHCPN4xBnMjYVrT1ztv0SwfL6qEW6nlCe8PGLa0.R6WrmeSzIU0kGO_zwZruew.nc_fMl4MP_d9i8dW",
        "id": "89270149-1fe6-4341-b6e3-bc7f04381d10:pwa-zpns",
        "option": 1536,
        "resource": "ZoomChat_pc_pwa",
        "platform": "browser",
        "deviceid": "device_id",
        "version": "1.9.1.2393",
        "mail": "dung.phan@maybank.com"
    };

    ws.send(JSON.stringify(loginCommand));
    console.log('Login command sent.');

    // Chạy vòng lặp 100 lần sau khi login thành công
    let count = 0;
    const loopInterval = setInterval(() => {
        if (count >= 1000000000000000) {
            clearInterval(loopInterval);
            console.log('Finished sending commands.');
            return;
        }

        // Thực hiện xen kẽ các lệnh với mỗi trạng thái cách nhau 1s
        const command1 = {
            "type": "updatepres",
            "id": 1729154588184,
            "pres": { "show": "available", "status": "NA", "manual": 0 }
        };
        const command2 = {
            "type": "updatepres",
            "id": 1729154511504,
            "pres": { "show": "away", "status": "BUSY", "manual": 0 }
        };
        const command3 = {
            "type": "updatepres",
            "id": 1729219909980,
            "pres": { "show": "xa", "status": "NA", "manual": 0 }
        };
        const command4 = {
            "type": "updatepres",
            "id": 1729219909980,
            "pres": { "show": "away", "status": "NA", "manual": 1 }
        };
        const command5 = {
            "type": "updatepres",
            "id": 1729219909980,
            "pres": { "show": "away", "status": "OOO", "manual": 0 }
        };

        // Gửi command1 trước
        ws.send(JSON.stringify(command1));
        console.log('Sent command 1: Available');

        // Sau 1 giây, gửi command2
        setTimeout(() => {
            ws.send(JSON.stringify(command2));
            console.log('Sent command 2: Away');
        }, 1000);

        // Sau thêm 1 giây nữa, gửi command3
        setTimeout(() => {
            ws.send(JSON.stringify(command3));
            console.log('Sent command 3: Xa');
        }, 2000);

        // Sau thêm 1 giây nữa, gửi command4
        setTimeout(() => {
            ws.send(JSON.stringify(command4));
            console.log('Sent command 4: Away (manual)');
        }, 3000);

        // Sau thêm 1 giây nữa, gửi command5 và kết thúc vòng lặp
        setTimeout(() => {
            ws.send(JSON.stringify(command5));
            console.log('Sent command 5: Away (OOO)');
        }, 4000);

        count++;
    }, 5000); // Nghỉ 5 giây giữa mỗi vòng lặp (sau khi gửi xong 5 command)

});

// Xử lý sự kiện khi nhận được dữ liệu từ WebSocket
ws.on('message', function incoming(data) {
    console.log('Received:', data);
});

// Xử lý sự kiện lỗi
ws.on('error', function error(err) {
    console.error('WebSocket error:', err);
});

// Xử lý sự kiện đóng kết nối
ws.on('close', function close() {
    console.log('WebSocket connection closed.');
});