import app from "./app.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, function(){
    console.log(`App running at port: ${PORT}`);
});