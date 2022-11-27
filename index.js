const http = require('http');
const fs = require('fs');
const request = require('request');

const homeFile = fs.readFileSync("index.html", "utf-8");

const replaceVal = (tempVal, orglVal) => {
    let temperature = tempVal.replace("{%tempval%}", orglVal.main.temp)
    temperature = temperature.replace("{%tempmin%}", orglVal.main.temp_min)
    temperature = temperature.replace("{%tempmax%}", orglVal.main.temp_max)
    temperature = temperature.replace("{%location%}", orglVal.name)
    temperature = temperature.replace("{%country%}", orglVal.sys.country)
    return temperature;

}
const server = http.createServer((req, res) => {
    console.log("server is running")

        if (req.url == "/") {
        request("https://api.openweathermap.org/data/2.5/weather?q=Mumbai&appid=c816e2c41a6a42028360b99cb7a2080b")
            .on("data", (chunk) => {

                const objData = JSON.parse(chunk);
                // console.log(objData);
                const arrData = [objData];
                // console.log(arrData[0].main.temp);
                // process.stdout.write(chunk);
                // var decoded_data = chunk.toString('utf8');
                const realTimeData = arrData.map((val) => replaceVal(homeFile, val))
                    .join(" ");
                res.write(realTimeData);
                // console.log(val.main);

            })

        .on("end", function (err) {
                if (err)
                    return console.log("connection closed", err);
                res.end();
            });
    }

});


server.listen(8000, 'localhost', () => {
    console.log("server listening");
});