function checkRequiredParams(requiredParams,type){
    return (req, res, next) => {
        const missingParams = requiredParams.filter(param => req[type][param] === undefined);
        if(missingParams.length){
            return res.status(400).json({
                message: "Missing required parameters"
            });
        }
        next();
    }
}

module.exports = checkRequiredParams;