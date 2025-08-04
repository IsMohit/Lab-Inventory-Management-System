const Movement = require('../models/Movement');
const Component = require('../models/Component');

exports.logMovement = async (req, res) => {
  const { componentId, type, quantity, reason } = req.body;
  const userId = req.user.id; // from auth middleware

  try {
    const component = await Component.findById(componentId);
    if (!component) return res.status(404).json({ error: 'Component not found' });

    // Adjust component quantity
    if (type === 'inward') {
      component.quantity += quantity;
    } else if (type === 'outward') {
      if (component.quantity < quantity) {
        return res.status(400).json({ error: 'Insufficient stock' });
      }
      component.quantity -= quantity;
      component.lastOutwardDate = new Date();
    }

    await component.save();

    const movement = new Movement({
      component: componentId,
      user: userId,
      type,
      quantity,
      reason
    });

    await movement.save();

    res.status(201).json({ message: 'Movement logged successfully', movement });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to log movement' });
  }
};

// View all movements
exports.getMovements = async (req, res) => {
  try {
    const logs = await Movement.find()
      .populate('component', 'name partNumber category')
      .populate('user', 'username')
      .sort({ date: -1 });

    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
};
