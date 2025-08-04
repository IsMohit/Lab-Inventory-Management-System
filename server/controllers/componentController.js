const Component = require('../models/Component');

// Create
exports.addComponent = async (req, res) => {
  try {
    const component = new Component(req.body);
    await component.save();
    res.status(201).json(component);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add component' });
  }
};

// Read all
exports.getComponents = async (req, res) => {
  try {
    const components = await Component.find().sort({ createdAt: -1 });
    res.json(components);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch components' });
  }
};

// Read one
exports.getComponent = async (req, res) => {
  try {
    const component = await Component.findById(req.params.id);
    if (!component) return res.status(404).json({ error: 'Component not found' });
    res.json(component);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch component' });
  }
};

// Update
exports.updateComponent = async (req, res) => {
  try {
    const updated = await Component.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Component not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update component' });
  }
};

// Delete
exports.deleteComponent = async (req, res) => {
  try {
    const deleted = await Component.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Component not found' });
    res.json({ message: 'Component deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete component' });
  }
};
