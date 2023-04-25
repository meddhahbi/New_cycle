const mongoose = require('mongoose');
const fs = require('fs');



const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },

  photo: { type: String },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",


},
commentList: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: "Comment",
  
}]
}


);


var Article = mongoose.model('Article', articleSchema);
var url = process.env.URL;




const createArticle = (title, content, photo,userId) => {


  return new Promise((resolve, reject) => {
    mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }).then(() => {

     
      const article = new Article({
        title:title,
        content:content,
        photo: photo.split("uploads")[1],
        user:userId,
      
      });
      console.log()
      article.save().then((article) => {
        resolve(article);
      }).catch((err) => {
        reject({ message: "Failed to save article to database", error: err });
      });
    }).catch((err) => {

      reject({ message: "Failed to connect to database", error: err });
    });
  });
};


  const deleteArticle = (id) => {



    return new Promise((resolve, reject) => {
      mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }).then(() => {
        Article.findByIdAndDelete(id).then((article) => {
          //mongoose.disconnect();
          resolve(article);
        }).catch((err) => {
         // mongoose.disconnect();
          reject(err);
        });
      }).catch((err) => {
       // mongoose.disconnect();
        reject(err);
      });
    });
  };

  const updateArticle = (id, title, content,photo) => {
    return new Promise((resolve, reject) => {
      mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }).then(() => {
        Article.findByIdAndUpdate(id, {
          title: title,
          photo: photo.split("uploads")[1]
        }, {new: true})
          .then((article) => {
           // mongoose.disconnect();
            resolve(article);
          })
          .catch((err) => {
           // mongoose.disconnect();
            reject(err);
          });
      }).catch((err) => {
        //mongoose.disconnect();
        reject(err);
      });
    });
  };

  const getAllArticles = () => {
    return new Promise((resolve, reject) => {
      mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }).then(() => {
        Article.find().lean().then((articles) => {

         // mongoose.disconnect();

  
          // Convert photo buffer to base64-encoded string
          articles = articles.map((article) => {
            if (article.photo) {
              article.photo = article.photo.toString('base64');
            }
            return article;
          });
  
          resolve(articles);
        }).catch((err) => {
          //mongoose.disconnect();
          reject(err);
        });
      }).catch((err) => {
       // mongoose.disconnect();
        reject(err);
      });
    });
  };

  const getArticleById = (id) => {
    return new Promise((resolve, reject) => {
      mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }).then(() => {
      
        // Article.findById(id).exec().then((article) => {
        //   article.populate("commentList");
        //   //mongoose.disconnect();
        //   resolve(article);
        // }).catch((err) => {
        //   //mongoose.disconnect();
        //   reject(err);
        // });
       const article = Article.findOne({_id:id}).populate("commentList");
       //console.log(article);
       resolve(article);
      }).catch((err) => {
        //mongoose.disconnect();
        reject(err);
      });
    });
  };

  const getLastThreeArticles = async () => {
    try {
      const articles = await Article.find()
        .sort({ createdAt: -1 }) // Sort by descending order of createdAt field
        .limit(3); // Limit to 3 documents
      return articles;
    } catch (err) {
      throw new Error('Failed to get last three articles');
    }
  };


  
  
  module.exports = {
 Article,
 createArticle,
 updateArticle,
 deleteArticle,
 getAllArticles,
 getArticleById,
 getLastThreeArticles

   
};
