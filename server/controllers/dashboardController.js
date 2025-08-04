const Component = require('../models/Component');
const Movement = require('../models/Movement');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalComponents = await Component.countDocuments();
    const totalMovements = await Movement.countDocuments();

    const lowStock = await Component.find({ $expr: { $lt: ["$quantity", "$criticalLow"] } });

    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const oldStock = await Component.find({
      lastOutwardDate: { $lt: ninetyDaysAgo }
    });

    res.json({
      summary: {
        totalComponents,
        totalMovements
      },
      lowStock,
      oldStock
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};

exports.getMonthlyMovementStats = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();

    const data = await Movement.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: {
            month: { $month: "$date" },
            type: "$type"
          },
          total: { $sum: "$quantity" }
        }
      }
    ]);

    const formatted = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      inward: 0,
      outward: 0
    }));

    for (const entry of data) {
      const idx = entry._id.month - 1;
      if (entry._id.type === 'inward') {
        formatted[idx].inward = entry.total;
      } else {
        formatted[idx].outward = entry.total;
      }
    }

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch monthly stats' });
  }
};
