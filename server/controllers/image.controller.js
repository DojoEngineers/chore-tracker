export const addImage = (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.')
        }

        const url = `/images/${req.file.filename}`
        res.status(200).json({ url })

    } catch (error) {
        console.error("Error in addImage:", error);
        res.status(400).json({ error: error.message });
        throw error;
    }
}