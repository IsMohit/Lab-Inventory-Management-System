const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
  try {
    const list = await Notification.find()
      .populate('component', 'name partNumber category')
      .sort({ createdAt: -1 });

    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

exports.markAsSeen = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { seen: true });
    res.json({ message: 'Marked as seen' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update notification' });
  }
};
