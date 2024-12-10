const Return = require('../models/Return');
const emailService = require('../services/emailService');

exports.getReturns = async (req, res, next) => {
  try {
    const query = {};
    if (req.query.status) query.status = req.query.status;
    if (req.query.returnStatus) query.returnStatus = req.query.returnStatus;

    const total = await Return.countDocuments(query);
    const returns = await Return.find(query)
      .populate('order')
      .populate('product')
      .skip(req.pagination.skip)
      .limit(req.pagination.limit)
      .sort('-createdAt');

    res.json({
      returns,
      page: req.pagination.page,
      pages: Math.ceil(total / req.pagination.limit),
      total,
    });
  } catch (err) {
    next(err);
  }
};

exports.createReturn = async (req, res, next) => {
  try {
    const newReturn = new Return(req.body);
    const return_ = await newReturn.save();
    await return_.populate(['order', 'product']);
    await emailService.sendReturnConfirmation(return_);
    res.status(201).json(return_);
  } catch (err) {
    next(err);
  }
};

exports.updateReturnStatus = async (req, res, next) => {
  try {
    const return_ = await Return.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
        investigation: req.body.investigation,
      },
      { new: true }
    ).populate(['order', 'product']);

    if (!return_) {
      const error = new Error('Return not found');
      error.status = 404;
      throw error;
    }

    await emailService.sendReturnStatusUpdate(return_);
    res.json(return_);
  } catch (err) {
    next(err);
  }
};

exports.getReturnById = async (req, res, next) => {
  try {
    const return_ = await Return.findById(req.params.id).populate(['order', 'product']);
    if (!return_) {
      const error = new Error('Return not found');
      error.status = 404;
      throw error;
    }
    res.json(return_);
  } catch (err) {
    next(err);
  }
};
