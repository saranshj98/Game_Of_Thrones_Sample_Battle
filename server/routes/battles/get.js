const Battle    = require('../../models/battles');
const async     = require('async');


function count(req, res) {
    Battle.countDocuments((err, result) => {
        if(err) {
            return res.send({
                error : true,
                message : "Error while retrieving count"
            })
        }

        else {
            return res.send({
                error   : false,
                message : "successfully retireved the count",
                count   : result
            })
        }
    })   
}


function list(req, res) {
    Battle.find({'location': {"$exists": true, "$ne": ""}}).exec((err, result) => {
        if(err) {
            return res.send({
                error : true,
                message : "Error while retrieving list of places where battle occured"
            })
        }

        else {
            return res.send({
                error       : false,
                message     : "successfully retireved the places",
                location    : result
            })
        }
    })
}


function stats(req, res) {

    let output = {
        most_active         : {},
        attacker_outcome    : {},
        battle_type         : [],
        defender_size       : {}
    }

    async.parallel([
        attacker_king,
        defender_king,
        region,
        attacker_outcome,
        battle_type,
        defender_size
    ], function(err, result) {
        if(err) {
            return res.send({
                error : true,
                message : "error while retrieving stats"
            })
        }

        else {
            return res.send({
                error   : false,
                message : "successfuly retrieve the stats",
                stats   : output
            })
        }
    })

    // get most_active things - attacker_king
    function attacker_king(callback){

        Battle.aggregate([
            // Stage 1
            {
                $match: {
                    "attacker_king" : {$ne : "" }
                }
            },
    
            // Stage 2
            {
                $group: {
                    "_id" : "$attacker_king",
                    "count": {$sum : 1} 
                }
            },
    
            // Stage 3
            {
                $sort: {
                    "count" : -1
                }
            },
    
            // Stage 4
            {
                $limit: 1
            }
    
        ])
        .exec((err, object)=>{
            if (err) { return callback(err) }
    
            else if(object.length !== 0){
                output.most_active.attacker_king = object[0]._id;
                return callback();
            }

            else{
                output.most_active.attacker_king = ''
                return callback();
            }
        }) 
    } 
    
    // get most_active things - defender_king
    function defender_king(callback){

        Battle.aggregate([
            // Stage 1
            {
                $match: {
                    "defender_king" : {$ne : "" }
                }
            },
    
            // Stage 2
            {
                $group: {
                    "_id" : "$defender_king",
                    "count": {$sum : 1} 
                }
            },
    
            // Stage 3
            {
                $sort: {
                    "count" : -1
                }
            },
    
            // Stage 4
            {
                $limit: 1
            }
    
        ])
        .exec((err, object)=>{
            if (err) { return callback(err) }

            else if(object.length !== 0){
                output.most_active.defender_king = object[0]._id
                return callback();
            }

            else{
                output.most_active.defender_king = ''
                return callback();
            }
        }) 
    }

    // get most_active things - region
    function region(callback){

        Battle.aggregate([
            // Stage 1
            {
                $match: {
                    "region" : {$ne : "" }
                }
            },
    
            // Stage 2
            {
                $group: {
                    "_id" : "$region",
                    "count": {$sum : 1} 
                }
            },
    
            // Stage 3
            {
                $sort: {
                    "count" : -1
                }
            },
    
            // Stage 4
            {
                $limit: 1
            }
    
        ])
        .exec((err, object)=>{
            if (err) { return callback(err) }
    
            else if(object.length !== 0){
                output.most_active.region = object[0]._id
                return callback();
            }

            else{
                output.most_active.region = ''
                return callback();
            }
        }) 
    }

    //get attacker_outcome things - total win / loss
    function attacker_outcome(callback){

        Battle.aggregate([
            // Stage 1
            {
                $match: {
                    "attacker_outcome" : {$ne : "" }
                }
            },
    
            // Stage 2
            {
                $group: {
                    "_id" : "$attacker_outcome",
                    "count": {$sum : 1} 
                }
            }
    
        ])
        .exec((err, object)=>{
            if (err) { return callback(err) }

            else if(object.length !== 0 && object[0]["_id"] == "loss"){
				output.attacker_outcome.loss  = object[0].count;
                output.attacker_outcome.win   = object[1].count;
                return callback();
            }
            
            else if(object.length !== 0){
                output.attacker_outcome.loss  = object[1].count;
                output.attacker_outcome.win   = object[0].count;
                return callback();
			}

            else {
                output.attacker_outcome.loss  = 0;
                output.attacker_outcome.win   = 0;
                return callback();
            }
        }) 
    }

    //get unique battle_type
    function battle_type(callback){

        Battle.distinct("battle_type", {"battle_type": { "$ne": "" } }, (err, object)=>{
            if (err) { return callback(err) }
            
            else if(object.length !== 0){
                output.battle_type = object;
                return callback();
            }

            else {
                output.battle_type = [];
			    return callback();
            }
		});
    }

    //get defender_size things
    function defender_size(callback){
        
        Battle.aggregate([
            // Stage 1
            {
                $match: {
                    "defender_size" : {$ne : "" }
                }
            },
    
            // Stage 2
            {
                $group: {
                    "_id": null,
                    "maxSize": { "$max": "$defender_size" }, 
                    "minSize": { "$min": "$defender_size" },
                    "avgSize": { "$avg": "$defender_size" }
                }
            }
    
        ])
        .exec((err, object)=>{
            if (err) { return callback(err) }
    
            else if(object.length !== 0){
                output.defender_size.average    = object[0].avgSize;
                output.defender_size.max        = object[0].maxSize;
                output.defender_size.min        = object[0].minSize;
                return callback();
            }

            else {
                output.defender_size.average    = 0;
                output.defender_size.max        = 0;
                output.defender_size.min        = 0;
			    return callback();
            }
        })
    }

} 


function search(req, res) {
    let attacker_king   = req.query.attacker_king;
	let location        = req.query.location;
    let type            = req.query.type;

    if(attacker_king != null) {

        if( location != null && type != null ){
			Battle.find({
                'attacker_king' : attacker_king,
				'location'      : location,
				'battle_type'   : type
			}).exec((err, docs) => {

				if (err) {
				    return res.send({
                        error   : true,
                        message : "error while retrieving search operation"
                    });
                }
                
                else {
                    return res.send({
                        error       : false,
                        message     : "successful",
                        searchDoc   : docs 
                    })
                }
			});
        }
        
        else {
            Battle.find({ 'attacker_king' : attacker_king }).exec((err, docs) => {

				if (err) {
				    return res.send({
                        error   : true,
                        message : "error while retrieving search operation"
                    });
                }
                
                else {
                    return res.send({
                        error       : false,
                        message     : "successful",
                        searchDoc   : docs 
                    })
                }
			});
		}
    }

    else {
		return res.send({
            error : true,
            message : "Specify query parameters"
        })
	}
}


module.exports = {
    count,
    stats,
    list,
    search
}