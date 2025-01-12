export const getUserDashboard = (req, res) => {
    return res.json({ Status: "Success", message: `Welcome User ${req.name}` });
};
