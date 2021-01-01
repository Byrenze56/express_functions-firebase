const { db } = require('../util/admin');

exports.getAllScreams =  (req, res) => {
    db
    .collection('screams')
    .orderBy('createdAt', 'desc')
    .get()
    .then((data) => {
        let screams = [];
        data.forEach((doc) => {
         screams.push({
             screamId: doc.id,
             body: doc.data().body,
             userHandle: doc.data().userHandle,
             createdAt: doc.data().createdAt,
             commentCount: doc.data().commentCount,
             likeCount: doc.data().likeCount
         });
            });
            return res.json(screams);
        })
        .catch((err) => console.error(err))
};



exports.postOneScream = (req, res) => {
    if(req.body.body.trim() === ''){
        return res.status(400).json({ body: 'Body must not be empty'});
    }
 
     const newScream = {
         body: req.body.body,
         userHandle: req.user.handle,
         createdAt: new Date().toISOString()
     };
 
     db
     .collection('screams')
     .add(newScream)
     .then(doc => {
         res.json({ message: `document ${doc.id} created sussesfully`})
     })
     .catch(err => {
         res.status(500).json({ error: 'something went wrong'});
         console.error(err)
     })
 }

 exports.getScream = (req, res) => {
     let screamData = {};
     db.doc(`/screams/${req.params.screamId}`)
     .get()
     .then((doc) => {
         if(!doc.exists){
             return res.status(404).json({ error: 'scream not found'});
         }
         screamData = doc.data();
         screamData.screamId = doc.id;
         return db
            .collection('comments')
            .where('screamId', '==', req.params.screamId)
            .get();
     })
     .then((data) => {
         screamData.comments = [];
         data.forEach((doc) => {
             screamData.comments.push(doc.data())
         });
         return res.json(screamData)
     })
     .catch((err) => {
         console.error(err);
         res.status(500).json({ error: err.code })
     })
 }