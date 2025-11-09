// services/emailService.js
const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = this.createTransporter();
  }

  createTransporter() {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  // Contact form emails
  async sendContactNotification(contactData) {
    const { name, email, subject, message } = contactData;
    
    const adminMailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: `🔔 New Contact Message: ${subject}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">SweetDrops</h1>
            <p style="color: white; margin: 5px 0 0 0; opacity: 0.9;">New Contact Message</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 30px; background: white; margin: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-bottom: 25px; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Contact Details</h2>
            
            <div style="display: grid; gap: 15px;">
              <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #667eea;">
                <strong style="color: #555;">👤 Name:</strong> <span style="color: #333;">${name}</span>
              </div>
              <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #28a745;">
                <strong style="color: #555;">✉️ Email:</strong> <span style="color: #333;">${email}</span>
              </div>
              <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107;">
                <strong style="color: #555;">📝 Subject:</strong> <span style="color: #333;">${subject}</span>
              </div>
            </div>
            
            <div style="margin-top: 25px; background: #fff; padding: 20px; border: 2px dashed #e9ecef; border-radius: 10px;">
              <h3 style="color: #555; margin-bottom: 15px;">💬 Message:</h3>
              <p style="line-height: 1.7; color: #333; font-size: 16px;">${message.replace(/\n/g, '<br>')}</p>
            </div>
            
            <div style="margin-top: 25px; padding: 15px; background: #e3f2fd; border-radius: 8px; text-align: center;">
              <p style="margin: 0; color: #1976d2;">
                <strong>📅 Received:</strong> ${new Date().toLocaleString('en-AE', { timeZone: 'Asia/Dubai' })} (Dubai Time)
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 25px;">
              <a href="mailto:${email}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 25px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: 500;">
                📧 Reply to ${name}
              </a>
            </div>
          </div>
        </div>
      `
    };

    return await this.transporter.sendMail(adminMailOptions);
  }

  async sendContactConfirmation(contactData) {
    const { name, email, subject } = contactData;
    
    const confirmationOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: '✅ Thank you for contacting SweetDrops!',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🍯 SweetDrops</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Natural Sweetener</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 30px; background: #f8f9fa;">
            <div style="background: white; padding: 30px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
              <h2 style="color: #333; text-align: center; margin-bottom: 20px;">Thank You, ${name}! 🙏</h2>
              
              <p style="color: #555; line-height: 1.7; font-size: 16px; text-align: center;">
                We've received your message about "<strong>${subject}</strong>" and our team will get back to you within <strong>24 hours</strong>.
              </p>
              
              <div style="background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%); padding: 25px; border-radius: 12px; margin: 25px 0; text-align: center;">
                <h3 style="color: #333; margin-bottom: 15px;">🌟 Why Choose SweetDrops?</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-top: 20px;">
                  <div style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <div style="font-size: 24px; margin-bottom: 8px;">🌱</div>
                    <strong style="color: #333;">100% Natural</strong>
                  </div>
                  <div style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <div style="font-size: 24px; margin-bottom: 8px;">🔥</div>
                    <strong style="color: #333;">Zero Calories</strong>
                  </div>
                  <div style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <div style="font-size: 24px; margin-bottom: 8px;">💚</div>
                    <strong style="color: #333;">Keto Friendly</strong>
                  </div>
                </div>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="http://localhost:3000" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 30px; display: inline-block; font-weight: 500; font-size: 16px;">
                  🛒 Shop Now
                </a>
              </div>
              
              <p style="color: #666; line-height: 1.6; font-size: 14px; text-align: center; margin-top: 25px;">
                Have questions? Reply to this email or call us at <strong>+971 56 273 4746</strong>
              </p>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background: #333; padding: 25px; text-align: center;">
            <p style="color: #ccc; margin: 0; line-height: 1.6;">
              📍 123 Sweet Street, Dubai, UAE<br>
              📞 +971 56 273 4746 | ✉️ nouramursal@gmail.com
            </p>
            <div style="margin-top: 15px;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                © 2025 SweetDrops. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      `
    };

    return await this.transporter.sendMail(confirmationOptions);
  }

  // Purchase confirmation emails
  async sendPurchaseNotification(orderData) {
    const { customerName, customerEmail, orderId, items, total, shippingAddress, deliveryFee, orderNotes } = orderData;
    
    const itemsList = items.map(item => `
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 12px; color: #333;">${item.name}</td>
        <td style="padding: 12px; text-align: center; color: #333;">${item.quantity}</td>
        <td style="padding: 12px; text-align: right; color: #333; font-weight: 500;">${item.price} AED</td>
      </tr>
    `).join('');

    const adminNotificationOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: `🛒 New Order #${orderId} - ${customerName}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">💰 New Order!</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Order #${orderId}</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 30px; background: white;">
            <h2 style="color: #333; margin-bottom: 20px;">Customer Details</h2>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 25px;">
              <p style="margin: 8px 0;"><strong>Name:</strong> ${customerName}</p>
              <p style="margin: 8px 0;"><strong>Email:</strong> ${customerEmail}</p>
              <p style="margin: 8px 0;"><strong>Address:</strong> ${shippingAddress}</p>
              ${orderNotes ? `<p style="margin: 8px 0;"><strong>Notes:</strong> ${orderNotes}</p>` : ''}
            </div>
            
            <h3 style="color: #333; margin-bottom: 15px;">Order Items</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
              <thead>
                <tr style="background: #f8f9fa;">
                  <th style="padding: 12px; text-align: left; color: #555;">Product</th>
                  <th style="padding: 12px; text-align: center; color: #555;">Qty</th>
                  <th style="padding: 12px; text-align: right; color: #555;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsList}
              </tbody>
            </table>
            
            <div style="background: #e8f5e8; padding: 20px; border-radius: 10px; text-align: center;">
              <h3 style="color: #28a745; margin: 0;">Total: ${total} AED</h3>
            </div>
            
            <p style="color: #666; text-align: center; margin-top: 20px;">
              Order received at: ${new Date().toLocaleString('en-AE', { timeZone: 'Asia/Dubai' })} (Dubai Time)
            </p>
          </div>
        </div>
      `
    };

    return await this.transporter.sendMail(adminNotificationOptions);
  }

  async sendPurchaseConfirmation(orderData) {
    const { customerName, customerEmail, orderId, items, total, shippingAddress, deliveryFee, orderNotes } = orderData;
    
    const itemsList = items.map(item => `
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 12px;">
          <div style="display: flex; align-items: center;">
            <div>
              <h4 style="margin: 0; color: #333;">${item.name}</h4>
              <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">Qty: ${item.quantity}</p>
            </div>
          </div>
        </td>
        <td style="padding: 12px; text-align: right; color: #333; font-weight: 500;">${item.price} AED</td>
      </tr>
    `).join('');

    const customerConfirmationOptions = {
      from: process.env.EMAIL_FROM,
      to: customerEmail,
      subject: `🎉 Order Confirmed #${orderId} - SweetDrops`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🍯 SweetDrops</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Order Confirmation</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 30px; background: #f8f9fa;">
            <div style="background: white; padding: 30px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="background: #e8f5e8; color: #28a745; padding: 15px 25px; border-radius: 25px; display: inline-block; font-weight: 500;">
                  ✅ Order Confirmed!
                </div>
              </div>
              
              <h2 style="color: #333; text-align: center; margin-bottom: 10px;">Thank you, ${customerName}!</h2>
              <p style="color: #666; text-align: center; margin-bottom: 30px;">Order #${orderId}</p>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 25px;">
                <h3 style="color: #333; margin-bottom: 15px;">📦 Order Details</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tbody>
                    ${itemsList}
                    <tr style="border-top: 2px solid #28a745;">
                      <td style="padding: 15px 12px; font-weight: 600; color: #333;">Subtotal</td>
                      <td style="padding: 15px 12px; text-align: right; color: #333;">${total - deliveryFee} AED</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 12px; color: #666;">Delivery Fee</td>
                      <td style="padding: 8px 12px; text-align: right; color: #666;">${deliveryFee} AED</td>
                    </tr>
                    <tr style="border-top: 2px solid #28a745; background: #f0f8f0;">
                      <td style="padding: 15px 12px; font-weight: 600; color: #28a745; font-size: 18px;">Total</td>
                      <td style="padding: 15px 12px; text-align: right; font-weight: 600; color: #28a745; font-size: 18px;">${total} AED</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div style="background: #fff3cd; padding: 20px; border-radius: 10px; border-left: 4px solid #ffc107; margin-bottom: 25px;">
                <h4 style="color: #856404; margin-bottom: 10px;">🚚 Shipping Information</h4>
                <p style="color: #856404; margin: 0; line-height: 1.5;">${shippingAddress}</p>
                <p style="color: #856404; margin: 10px 0 0 0; font-size: 14px;"><strong>Estimated delivery:</strong> 2-3 business days</p>
                ${orderNotes ? `<div style="background: #fff; padding: 15px; border-radius: 8px; margin-top: 15px;"><strong>Your Notes:</strong> ${orderNotes}</div>` : ''}
              </div>
              
              <div style="background: #e3f2fd; padding: 20px; border-radius: 10px; text-align: center; margin-bottom: 25px;">
                <h4 style="color: #1976d2; margin-bottom: 15px;">🎯 What's Next?</h4>
                <ul style="color: #1976d2; text-align: left; line-height: 1.8; padding-left: 20px;">
                  <li>We'll prepare your order with care</li>
                  <li>You'll receive a tracking number within 24 hours</li>
                  <li>Your SweetDrops will be delivered fresh</li>
                </ul>
              </div>
              
              <div style="text-align: center;">
                <a href="http://localhost:3000" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 30px; display: inline-block; font-weight: 500; margin: 0 10px;">
                  🛒 Shop More
                </a>
                <a href="mailto:nouramursal@gmail.com" style="background: transparent; color: #667eea; padding: 15px 30px; text-decoration: none; border-radius: 30px; display: inline-block; font-weight: 500; border: 2px solid #667eea; margin: 0 10px;">
                  📞 Contact Us
                </a>
              </div>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background: #333; padding: 25px; text-align: center;">
            <p style="color: #ccc; margin: 0; line-height: 1.6;">
              📍 123 Sweet Street, Dubai, UAE<br>
              📞 +971 56 273 4746 | ✉️ nouramursal@gmail.com
            </p>
            <div style="margin-top: 15px;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                © 2025 SweetDrops. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      `
    };

    return await this.transporter.sendMail(customerConfirmationOptions);
  }

  // Send both notification and confirmation emails
  async handleContactForm(contactData) {
    try {
      await Promise.all([
        this.sendContactNotification(contactData),
        this.sendContactConfirmation(contactData)
      ]);
      return { success: true, message: 'Emails sent successfully' };
    } catch (error) {
      console.error('Contact email error:', error);
      throw error;
    }
  }

  async handlePurchase(orderData) {
    try {
      await Promise.all([
        this.sendPurchaseNotification(orderData),
        this.sendPurchaseConfirmation(orderData)
      ]);
      return { success: true, message: 'Purchase emails sent successfully' };
    } catch (error) {
      console.error('Purchase email error:', error);
      throw error;
    }
  }
}

module.exports = new EmailService();