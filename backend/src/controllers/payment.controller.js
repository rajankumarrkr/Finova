import { PaymentService } from '../services/payment.service.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const createOrder = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const orderData = await PaymentService.createOrder(req.user._id, amount);
    return ApiResponse.success(res, 'Payment order created successfully', orderData, 201);
  } catch (error) {
    next(error);
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const { providerOrderId, providerPaymentId, signature } = req.body;
    const payment = await PaymentService.verifyPayment({
      userId: req.user._id,
      providerOrderId,
      providerPaymentId,
      signature
    });
    return ApiResponse.success(res, 'Deposit completed and verified successfully', payment);
  } catch (error) {
    next(error);
  }
};

export const webhook = async (req, res, next) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const result = await PaymentService.processWebhook(req.body, signature);
    return ApiResponse.success(res, 'Webhook processed', result);
  } catch (error) {
    next(error);
  }
};
