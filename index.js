const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000 ;
app.get('/',(req,res)=>{
    res.send('เปรมเป็นสลิ่ม รักในหลวง')
})

app.listen(PORT,()=>console.log(`server is running on PORT ${PORT}`));