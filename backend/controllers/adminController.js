import { db } from '../models/db.js';

export const getAdminStats = (req, res) => {
    const sqlTotalUsers = "SELECT COUNT(*) AS total_users FROM login";
    const sqlActiveUsers = "SELECT COUNT(*) AS active_users FROM login WHERE status = 'active'";
    const sqlNewRegistrations = "SELECT COUNT(*) AS new_registrations FROM login WHERE registration_date > DATE_SUB(NOW(), INTERVAL 1 MONTH)";
    const sqlMonthlyRegistrations = `
        SELECT MONTH(registration_date) AS month, COUNT(*) AS registrations
        FROM login
        WHERE registration_date > DATE_SUB(NOW(), INTERVAL 6 MONTH)
        GROUP BY MONTH(registration_date)
        ORDER BY MONTH(registration_date)
    `;

    db.query(sqlTotalUsers, (err, totalUsersData) => {
        if (err) return res.json({ Error: "Error fetching total users!" });

        db.query(sqlActiveUsers, (err, activeUsersData) => {
            if (err) return res.json({ Error: "Error fetching active users!" });

            db.query(sqlNewRegistrations, (err, newRegistrationsData) => {
                if (err) return res.json({ Error: "Error fetching new registrations!" });

                db.query(sqlMonthlyRegistrations, (err, monthlyRegistrationsData) => {
                    if (err) return res.json({ Error: "Error fetching monthly registrations!" });

                    const monthlyRegistrations = [0, 0, 0, 0, 0, 0];
                    monthlyRegistrationsData.forEach(row => {
                        monthlyRegistrations[row.month - 1] = row.registrations;
                    });

                    return res.json({
                        Status: "Success",
                        totalUsers: totalUsersData[0].total_users,
                        activeUsers: activeUsersData[0].active_users,
                        newRegistrations: newRegistrationsData[0].new_registrations,
                        monthlyRegistrations,
                        name: ` ${req.name}`,
                        role: `${req.role}`
                    });
                });
            });
        });
    });
};
