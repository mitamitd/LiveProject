var mdb = require('../models/bear');
var imports = require('../custom_modules/imports/index');
var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'infield', 
  api_key: '927853178393384', 
  api_secret: 'qP0AkjWSGm1eL44BeF4ywnQ6R2A'
});




 module.exports = function(app) {

		app.post("/api/upload/",  upload.single('image'), function(req, res) {
	  			cloudinary.uploader.upload(req.file.path, function(result) {
	     		 // add cloudinary url for the image to the campground object under image property
	      			var imageUrl = result.secure_url;
	      		// add author to campground
	      		var mediafileobj = new mdb.mediafiles();
	      		var obj = {
	      			"file_type":"image",
        			"file_path":imageUrl,
        			"file_title":req.query.title,
        			"file_detail":{result}
	      		}
	      			mediafileobj.collection.insert(obj,function(err,data){
						if(err){
							app.sendError(req,res,"error",err);
						}
						else{
			      			app.send(req,res,[result]);							
						}      				
	      			});

	      
	    		});
			});

			app.post("/api/upload/homework/",  upload.single('image'), function(req, res) {
			  			cloudinary.uploader.upload(req.file.path, function(result) {
			     		 // add cloudinary url for the image to the campground object under image property
			      			var imageUrl = result.secure_url;
			      			var full_date_obj = imports.db.dates.full_date_now();
			      		// add author to campground
			      		var homeworks = new mdb.homeworks();
			      		var obj = {
			      			"file_type":"image",
		        			"file_path":imageUrl,
		        			"file_title":req.query.title,
		        			"file_detail":{result},
		        			"uploaded_by":req.query.username,
		        			"school_code":req.query.school_code,
		        			"class":req.query.class_code,
		        			"subject_code":req.query.subject_code,
		        			"updated_on":full_date_obj
			      		}
				      	homeworks.collection.insert(obj,function(err,data){
							if(err){
									app.sendError(req,res,"error",err);
								}
								else{
					      			app.send(req,res,[result]);							
								}      				
			      			});

			      
			    		});
					});

		app.get("/api/get_all_mediafiles/",function(req,res){
			var page = req.query.page;
			if(!page){
				page = "1";
			}
			var pageno = parseInt(page);
			
			var fixlimit = 15;
			mdb.mediafiles.find({}).sort({"_id":-1}).skip((pageno-1)*fixlimit).limit(fixlimit).exec(function(err,data){
				if(err){
					app.sendError(req,res,"error",err);
				}else{
					console.log('data length '+data.length);
					app.send(req,res,data);
				}
			});
		});


		app.get("/api/get_all_home_work/",function(req,res){
			var page = req.query.page;
			if(!page){
				page = "1";
			}
			var pageno = parseInt(page);
			
			var fixlimit = 15;
			mdb.homeworks.find({"class":req.query.class_code}).sort({"_id":-1}).skip((pageno-1)*fixlimit).limit(fixlimit).exec(function(err,data){
				if(err){
					app.sendError(req,res,"error",err);
				}else{
					console.log('data length '+data.length);
					app.send(req,res,data);
				}
			});
		});

 	}