function checkIfDate(params,type){
    return (req, res, next) => {
        for(let i = 0; i < params.length; i++){
            if(new Date(req[type][params[i]]) == "Invalid Date"){
                return res.status(400).json({
                    message: "Invalid date"
                });
            }
        }
        next();
    }
}

module.exports = checkIfDate