function checkRequiredParams(requiredParams){
    return (req, res, next) => {
        const missingParams = requiredParams.filter(param => !req.body[param]);
        if(missingParams.length){
            return res.status(400).json({
                message: "Missing required parameters"
            });
        }
        next();
    }
}

module.exports = checkRequiredParams;