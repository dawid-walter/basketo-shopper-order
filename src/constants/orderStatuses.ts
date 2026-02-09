// Order Status Descriptions from CONTENT_COPY.md

export const ORDER_STATUS_INFO = {
  CREATED: {
    title: 'Order Placed ✓',
    description: 'Great news! Your order has been received and confirmed. We\'re preparing it for processing.',
    whatNext: 'Once payment is confirmed, we\'ll start processing your order right away.',
    estimatedTime: 'Payment confirmation typically takes a few minutes.',
    color: 'blue',
    showTracking: false,
    showFeedback: false,
  },
  PAID: {
    title: 'Payment Confirmed ✓',
    description: 'Your payment has been successfully processed. Thank you! Your order is now queued for preparation.',
    whatNext: 'Our team is preparing your items for shipment. You\'ll receive an update once your order ships.',
    estimatedTime: 'Processing usually takes 1-2 business days.',
    color: 'green',
    showTracking: false,
    showFeedback: false,
  },
  PROCESSING: {
    title: 'Order in Progress 📦',
    description: 'Your order is being carefully prepared and packaged by our team.',
    whatNext: 'Once packed, we\'ll hand it off to our shipping carrier and send you tracking information.',
    estimatedTime: 'Most orders are shipped within 1-2 business days.',
    color: 'yellow',
    showTracking: false,
    showFeedback: false,
  },
  SHIPPED: {
    title: 'On Its Way! 🚚',
    description: 'Excellent! Your order has been shipped and is on its way to you.',
    whatNext: 'Track your package using the tracking number below. You\'ll receive an email once it\'s delivered.',
    estimatedTime: 'Delivery times vary by location and shipping method selected.',
    color: 'blue',
    showTracking: true,
    showFeedback: false,
  },
  DELIVERED: {
    title: 'Delivered! ✨',
    description: 'Your order has been successfully delivered. We hope you love it!',
    whatNext: 'Enjoying your purchase? We\'d love to hear your feedback!',
    estimatedTime: '',
    color: 'green',
    showTracking: false,
    showFeedback: true,
  },
  CANCELLED: {
    title: 'Order Cancelled',
    description: 'This order has been cancelled.',
    whatNext: 'Your refund has been processed and should appear in your account within 5-7 business days.',
    estimatedTime: 'Refunds typically take 5-7 business days to appear.',
    color: 'red',
    showTracking: false,
    showFeedback: false,
  },
} as const;

export type OrderStatus = keyof typeof ORDER_STATUS_INFO;
