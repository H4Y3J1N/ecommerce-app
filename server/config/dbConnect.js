const mongoose = require('mongoose');

exports.dbConnect = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        useCreateIndex: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
        useNewUrlParser: true,
      });
      console.log("Db is Connected Successfully");
    } catch (error) {console.log(`Error ${error.message}`);}
  };


  // 중급 코드에서 async 문을 잘 안쓰는 것 같다.
  // 초급 코드의 dbConnect 문 활용.