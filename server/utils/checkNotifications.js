const Component = require('../models/Component');
const Notification = require('../models/Notification');

const checkNotifications = async () => {
  try {
    const components = await Component.find();

    for (let c of components) {
      // Low Stock
      if (c.quantity < c.criticalLow) {
        const exists = await Notification.findOne({
          component: c._id,
          type: 'low-stock'
        });

        if (!exists) {
          await Notification.create({
            component: c._id,
            type: 'low-stock',
            message: `Component ${c.name} is low on stock`
          });
        }
      }

      // Old Stock (unused for 90+ days)
      if (c.lastOutwardDate) {
        const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        if (c.lastOutwardDate < ninetyDaysAgo) {
          const exists = await Notification.findOne({
            component: c._id,
            type: 'old-stock'
          });

          if (!exists) {
            await Notification.create({
              component: c._id,
              type: 'old-stock',
              message: `Component ${c.name} has not been used in 3+ months`
            });
          }
        }
      }
    }
  } catch (err) {
    console.error('Notification check failed:', err.message);
  }
};

module.exports = checkNotifications;
