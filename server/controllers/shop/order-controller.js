import paypal from "../../helpers/paypal.js";
import Order from "../../models/Order.js";
import Cart from "../../models/Cart.js";
import Product from "../../models/Product.js";

export const createOrder = async (req, res) => {
    try {
        const { userId, cartId, cartItems, addressInfo, orderStatus, paymentMethod, paymentStatus,
            totalAmount, orderDate, orderUpdateDate, paymentId, payerId
        } = req.body;

        // create paypal payment json object
        const create_payment_json = {
            intent: 'sale',
            payer: {
                payment_method: 'paypal',
            },
            redirect_urls: {
                return_url: `${process.env.CLIENT_BASE_URL}/shop/paypal-return`,
                cancel_url: `${process.env.CLIENT_BASE_URL}/shop/paypal-cancel`
            },
            transactions: [
                {
                    item_list: {
                        items: cartItems.map((item) => ({
                            name: item.title,
                            sku: item.productId,
                            price: item.price.toFixed(2),
                            currency: 'USD',
                            quantity: item.quantity
                        }))
                    },
                    amount: {
                        currency: 'USD',
                        total: totalAmount.toFixed(2)
                    },
                    description: "This is the payment description."
                }
            ]
        }

        paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
            if (error) {
                console.log(error);
                res.status(500).json({
                    success: false,
                    message: "Error occured while creating paypal payment"
                });
            } else {
                const newlyCreatedOrder = new Order({
                    userId, cartId, cartItems, addressInfo, orderStatus, paymentMethod, paymentStatus,
                    totalAmount, orderDate, orderUpdateDate, paymentId, payerId
                });
                await newlyCreatedOrder.save();

                // after order saved to DB get the approval url from payment info status
                const approvalUrl = paymentInfo.links.find(link => link.rel === 'approval_url').href;

                res.status(201).json({
                    success: true,
                    approvalUrl,
                    orderId: newlyCreatedOrder._id
                });
            }
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error occurred in createOrder'
        });
    }
}

export const capturePayment = async (req, res) => {
    try {
        const { paymentId, payerId, orderId } = req.body;

        let order = await Order.findById(orderId);

        if (!order) return res.status(404).json({
            success: false,
            message: "Order not found"
        });

        order.paymentStatus = "paid";
        order.orderStatus = "confirmed";
        order.paymentId = paymentId;
        order.payerId = payerId;

        // after successful payment check the product stcock availability and manage 
        for (let item of order.cartItems) {
            let product = await Product.findById(item.productId);

            // if profuct not available then show out of stock status
            if (!product) return res.status(404).json({
                success: false,
                message: `Not enough stock for this product ${product.title}`
            });

            // if product available then manage product stock
            product.totalStock -= item.quantity;

            await product.save();
        }

        const getCartId = order.cartId;
        await Cart.findByIdAndDelete(getCartId);
        await order.save();

        res.status(200).json({
            success: true,
            message: "Order confirmed",
            data: order
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error occurred in capturePayment"
        });
    }
}

export const getAllOrdersByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const orders = await Order.find({ userId });

        if (!orders.length) return res.status(404).json({
            success: false,
            message: "No orders found"
        });

        res.status(200).json({
            success: true,
            data: orders
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error occurred in getAllOrdersByUser"
        });
    }
}

export const getOrderDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findById(id);

        if (!order) return res.status(404).json({
            success: false,
            message: "Order not found"
        });

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error occurred in getOrderDetails'
        });
    }
}