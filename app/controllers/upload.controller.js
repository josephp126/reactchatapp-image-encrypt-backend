//get messages
exports.uploadImage = async (req, res) => {
    const files = res.req.files;
    console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++", res.req.files);
    // console.log(res)
    if (!files) {
        const error = new Error('Please choose files')
        res.status(500).json(error);
    }
    res.status(200).json(files);
}
