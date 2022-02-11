const express = require("express");
const cors = require("cors");
const corsOptions ={ origin:'*'}
const app = express();
const PORT = process.env.PORT || 5000 ;
const fs = require('fs');
var path = require('path');
const csv = require('csv-parser');
const { log } = require("console");
app.use(cors(corsOptions))
//------------------------- ส่ง api ตารางตามลิ้งที่ส่งมาเป็น http://localhost:5000/เครื่องครัว จะส่งข้อมูลเเค่ "เครื่องครัว" กลับ -----------//
app.get('/data/*',(req,res)=>{
  var origin = req.params;  //ตัวรับ
  const results = [];
  const results2 = [];
  fs.createReadStream(`./data/ไอดีของ.csv`)            //อ่านไฟล์ data สองที่ อันนี้ที่เเรก
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', () => {
    fs.createReadStream(`./data/ชนิด-โซน.csv`)        //อันนี้ที่ที่สอง
    .pipe(csv())
    .on('data', (data) => results2.push(data))
    .on('end', () => {
      var arry = [] ;
      for(let i = 0 ; i < results.length ; i++){            //ลูปส่งข้อมูลกลับ
        for(let j = 0 ; j < results2.length ; j++){
          if(results[i][`ชนิด`]==results2[j][`ID`]){
            if(results2[j][`ชนิด`]==origin[0]){
              var obj = {};
              obj[`รหัสสินค้า`] = results[i][`รหัสสินค้า`];
              obj[`ชนิด`] = results2[j][`ชนิด`];
              obj[`โซน`] = results2[j][`โซน`];
              obj[`ยี่ห้อ`] = results[i][`ยี่ห้อ`];
              obj[`ประเภท`] = results[i][`ประเภท`];
              obj[`ราคา`] = results[i][`ราคา`];
              arry.push(obj);
            }
          }
        }
      }
      res.send(arry);
    });
  }); 
  }
)

//------------------------- ส่ง api ตารางตามเลขที่ค้นหาเเล้วส่งมาเป็น เช่น http://localhost:5000/10001 จะส่งข้อมูลเเค่ "ข้อมูลของเลข" กลับ -----------//
app.get('/search/*',(req,res)=>{
  var origin = req.params; //ตัวรับ
  const results = [];
  const results2 = [];
  fs.createReadStream(`./data/ไอดีของ.csv`)            //อ่านไฟล์ data สองที่ อันนี้ที่เเรก
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', () => {
    fs.createReadStream(`./data/ชนิด-โซน.csv`)        //อันนี้ที่ที่สอง
    .pipe(csv())
    .on('data', (data) => results2.push(data))
    .on('end', () => {
      var arry = [] ;
      var breakdown = 0 ;
      for(let i = 0 ; i < results.length ; i++){            //ลูปส่งข้อมูลกลับ
        console.log("i ="+i);
        if(origin[0] == results[i][`รหัสสินค้า`]){             // ถ้ารหัสตรงกัน
          for(let j = 0 ; j < results2.length ; j++){
            console.log("j ="+j);
            if(results[i][`ชนิด`]==results2[j][`ID`]){
              var obj = {};
              obj[`รหัสสินค้า`] = results[i][`รหัสสินค้า`];
              obj[`ชนิด`] = results2[j][`ชนิด`];
              obj[`โซน`] = results2[j][`โซน`];
              obj[`ยี่ห้อ`] = results[i][`ยี่ห้อ`];
              obj[`ประเภท`] = results[i][`ประเภท`];
              obj[`ราคา`] = results[i][`ราคา`];
              arry.push(obj);
              breakdown++ ;                                //break ลูป เพราะเจอเเล้ว
              break
            }
          }
        }
        if(breakdown!=0){                                  //break ลูป เพราะเจอเเล้ว
          break;
        }
      }
      res.send(arry);
    });
  }); 
  
})


app.listen(PORT,()=>console.log(`server is running on PORT ${PORT}`));