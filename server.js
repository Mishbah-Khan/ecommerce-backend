import app from "./app.js";

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('SERVER is running...');
});

app.listen(PORT, function(){
    console.log(`App running at port: ${PORT}`);
});