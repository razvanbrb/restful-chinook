const db = require('../db-connection');

const controllers = {
  getAll: (req, res) => {

    const sql = `SELECT * FROM albums`;

    db.all(sql, (err, rows) => {
      if (err) {
        res.status(400).json({ "error": err.message });
        return;
      }

      res.json(rows)
    });
  },
  getOne: (req, res) => { 
    const sql = `select * from albums where AlbumId = ${req.params.id}`;
    db.get(sql,(err, rows)=>{
      if (err) {
        res.status(400).json({ "error": err.message });
        return;
      }

      res.json(rows);
    })
  },
  create: (req, res) => {
    // read row data from body

    let errors=[]
    if (!req.body.Name){
        errors.push("No name of the album specified");
    }
    if (!req.body.ArtistID){
        errors.push("No ArtistId specified");
    }

    if (errors.length){
      res.status(400).json({"error":errors.join(",")});
      return;
    }
   
    const data ={
      name :  req.body.Name,
      artistId: Number(req.body.ArtistID)
    }
    const sql = `INSERT INTO albums (Title, ArtistId) VALUES("${data.name}", "${data.artistId}")`;
    db.run(sql,function(err, msg = "This album has been created"){
      if (err) {
        res.status(400).json({ "error": err.message });
        return;
      }
  
      res.json({
        "message": msg,
        "data": data,
        "id": this.lastID
      });

    })
  },
  update: (req, res) => {
    // read row data from body
    const data ={
      name :  req.body.Name ? `'${req.body.Name}'` : null,
      artistId: req.body.ArtistID? Number(req.body.ArtistID) : null
    } 
    
    const sql = `update albums set Title = COALESCE(${data.name}, Title), ArtistId = COALESCE(${data.artistId}, ArtistID) where AlbumId = ${req.params.id}`;
    
    db.run(sql, function (err, msg= "This album has been updated"){
      if (err) {
        res.status(400).json({ "error": err.message });
        return;
      }

      res.json({
        "message": msg,
        "changes": this.changes
      });
    })


  },
  delete: (req, res) => {
    const sql = `delete from albums where AlbumId = ${req.params.id}`;
    db.run(sql, function (err, msg= "This album has been deleted"){
      if (err) {
        res.status(400).json({ "error": err.message });
        return;
      }

      res.json({
        "message": msg,
        "changes": this.changes
      });
    })
   }
}

module.exports = controllers;
