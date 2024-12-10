const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendOrderConfirmation = async (order) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: order.customer.email,
    subject: `Order Confirmation #${order._id}`,
    html: `
      <h1>Order Confirmation</h1>
      <p>Dear ${order.customer.name},</p>
      <p>Your order has been confirmed.</p>
      <p>Order Details: ...</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

// Add these to your existing emailService.js

exports.sendTaskAssignment = async (task) => {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: task.assignedTo.email,
      subject: `New Task Assignment: ${task.title}`,
      html: `
        <h1>New Task Assignment</h1>
        <p>Dear ${task.assignedTo.name},</p>
        <p>You have been assigned a new task:</p>
        <h2>${task.title}</h2>
        <p>${task.description}</p>
        <p>Priority: ${task.priority}</p>
        <p>Due Date: ${task.dueDate}</p>
      `
    };
  
    await transporter.sendMail(mailOptions);
  };
  
  exports.sendReturnConfirmation = async (return_) => {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: return_.customer.email,
      subject: `Return Request Confirmation #${return_._id}`,
      html: `
        <h1>Return Request Confirmation</h1>
        <p>Dear ${return_.customer.name},</p>
        <p>Your return request has been received.</p>
        <p>Return Details:</p>
        <ul>
          <li>Product: ${return_.product.product}</li>
          <li>Return Reason: ${return_.cause}</li>
          <li>Status: ${return_.status}</li>
        </ul>
      `
    };
  
    await transporter.sendMail(mailOptions);
  };