// utils/cookieUtils.js
export const clearCookie = (req, res) => {
    const cookies = req.cookies;
    for (const cookieName in cookies) {
        res.clearCookie(cookieName, { httpOnly: true, secure: true });
    }
};
