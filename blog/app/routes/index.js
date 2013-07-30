
/*
 * GET home page.
 */

exports.index = function(req, res){
  console.log(res,req);
  res.render('index', { title: req.title });
};
