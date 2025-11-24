
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import Cart from "../models/cart.model.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import CustomError from "../middlewares/error_handler.middleware.js";
import { ORDER_STATUS } from "../constants/enums.constant.js";


// ! create order
export const create = asyncHandler(async (req, res) => {

    // user id
    const user = req.User._id;

    // shipping address
    const { shippingAddress : address} = req.body;
    const shippingAddress = JSON.parse(shippingAddress) ?? {};


    // find cart    
    const cart = await Cart.findOne({ user }).populate("items.product");
    if (!cart || cart.items.length === 0) {
        throw new CustomError("Cart is empty", 400);
    }

    // calculate total amount
    let totalAmount = 0;
    cart.items.forEach((item) => {
        totalAmount += item.product.price * item.quantity;
        
    });

    // inventory management
    for (const item of cart.items) {
        const product = await Product.findById(item.product._id);
        if (product.stock < item.quantity) {
            throw new CustomError(`Insufficient stock for product: ${product.name}`, 400);
        }
        product.stock -= item.quantity;
        await product.save();
    }


    // create order
    const order = new Order({
        user,
        shippingAddress,
        items: cart.items,
        totalAmount
    });

    await order.save();

    // clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json({
        message: "Order created successfully",
        data: order,
        status: "success",
    });



});

// !cancel order
export const cancel = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const user = req.User._id;

    const order = await Order.findOne({ _id: orderId, user });

    if (!order) {
        throw new CustomError("Order not found", 404);
    }

    if (order.status !== ORDER_STATUS.PENDING) {
        throw new CustomError("Only pending orders can be cancelled", 400);
    }

    order.status = ORDER_STATUS.CANCELLED;
    await order.save();

    // restock products
    for (const item of order.items) {
        const product = await Product.findById(item.product);
        product.stock += item.quantity;
        await product.save();
    }

    res.status(200).json({
        message: "Order cancelled successfully",
        data: order,
        status: "success",
    });
});

// 
// !get user orders
export const getOrders = asyncHandler(async (req, res) => {
    const user = req.User._id;

    const orders = await Order.find({ user }).sort({ createdAt: -1 });

    res.status(200).json({
        message: "Orders fetched successfully",
        data: orders,
        status: "success",
    });
});

// !get all orders (admin)
export const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find().sort({ createdAt: -1 });

    res.status(200).json({
        message: "All orders fetched successfully",
        data: orders,
        status: "success",
    });
});

// !update order status (admin)
export const updateOrderStatus = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
        throw new CustomError("Order not found", 404);
    }

    order.status = status;
    await order.save();

    res.status(200).json({
        message: "Order status updated successfully",
        data: order,
        status: "success",
    });
});


// !change address of an order
export const changeOrderAddress = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const user = req.User._id;
    const { shippingAddress : address} = req.body;
    const shippingAddress = JSON.parse(address) ?? {};

    const order = await Order.findOne({ _id: orderId, user });

    if (!order) {
        throw new CustomError("Order not found", 404);
    }

    if (order.status !== ORDER_STATUS.PENDING) {
        throw new CustomError("Only pending orders can change address", 400);
    }

    order.shippingAddress = shippingAddress;
    await order.save();

    res.status(200).json({
        message: "Order address changed successfully",
        data: order,
        status: "success",
    });
});



